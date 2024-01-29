using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using System.Diagnostics.CodeAnalysis;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculationsController : ApiBase
    {
        private readonly ILogger _logger;
        public CalculationsController(DatabaseContext context, ILogger<CalculationsController> logger) : base(context)
        {
            _logger = logger;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<DistrictInfo>>> Places()
        {
            var d = await _ctx.Districts.Select(t => new DistrictInfo
            {
                Id = t.Id,
                Title = t.Title,
                SvgTag = t.SvgTag,
            }).ToListAsync();
            var c = await _ctx.Cities.Select(t => new CityInfo
            {
                Id = t.Id,
                DistrictId = t.DistrictId,
                Title = t.Title,
                SvgTag = t.SvgTag,
            }).ToListAsync();
            var m = await _ctx.Microdistricts.Select(t => new MicrodistrictInfo
            {
                Id = t.Id,
                CityId = t.CityId,
                Title = t.Title,
                SvgTag = t.SvgTag,
            }).ToListAsync();

            foreach (var item in c)
                item.Microdistricts = m.Where(t => t.CityId == item.Id);

            foreach (var item in d)
                item.Cities = c.Where(t => t.DistrictId == item.Id);
            return Ok(d);
        }

        [HttpPost("[action]")]
        public ActionResult<SummaryResult> Summary(SummaryForm form)
        {
            IQueryable<Threat> data = _ctx.Threats.AsNoTracking().Include(t => t.Microdistrict)
                .Include(t => t.Microdistrict.City).Include(t => t.Microdistrict.City.District);

            if (form.BeginDate.HasValue)
                data = data.Where(t => t.DateTime >= form.BeginDate.Value);
            if (form.EndDate.HasValue)
                data = data.Where(t => t.DateTime <= form.EndDate.Value);
            if (form.MicrodistrictId.HasValue)
                data = data.Where(t => t.MicrodistrictId == form.MicrodistrictId.Value);
            else if (form.CityId.HasValue)
                data = data.Where(t => t.Microdistrict.CityId == form.CityId.Value);
            else if (form.DistrictId.HasValue)
                data = data.Where(t => t.Microdistrict.City.DistrictId == form.DistrictId.Value);


            var result = _ctx.ThreatsTypes.AsNoTracking()
                .GroupJoin(data, t => t.Id, t => t.TypeId, (t, c) => new ThreatByType
                {
                    Id = t.Id,
                    Title = t.Title,
                    Value = c.Count(),
                });
            return new SummaryResult
            {
                Query = form,
                Threats = result,
            };
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<StatsModel>> Query(QueryForm form)
        {
            IQueryable<Threat> data = _ctx.Threats.AsNoTracking().Include(t => t.Microdistrict)
                .Include(t => t.Microdistrict.City).Include(t => t.Microdistrict.City.District);

            if (form.BeginDate.HasValue)
                data = data.Where(t => t.DateTime >= form.BeginDate.Value);
            if (form.EndDate.HasValue)
                data = data.Where(t => t.DateTime <= form.EndDate.Value);
            if (form.MicrodistrictId.HasValue)
                data = data.Where(t => t.MicrodistrictId == form.MicrodistrictId.Value);
            else if (form.CityId.HasValue)
                data = data.Where(t => t.Microdistrict.CityId == form.CityId.Value);
            else if (form.DistrictId.HasValue)
                data = data.Where(t => t.Microdistrict.City.DistrictId == form.DistrictId.Value);

            IQueryable<StatsItem> result = null;
            switch (form.Axis)
            {
                case Axis.Date:
                    result = data.GroupBy(t => t.DateTime.Date).Select(t => new StatsItem
                    {
                        Key = t.Key.ToShortDateString(),
                        Values = t.GroupBy(t => t.Type)
                            .Select(t => new Pair(t.Key.Title, t.Count()))
                    });
                    break;
                case Axis.District:
                    result = data.GroupBy(t => t.Microdistrict.City.District).Select(t => new StatsItem
                    {
                        Key = t.Key.Title,
                        Values = t.GroupBy(t => t.Type)
                            .Select(t => new Pair(t.Key.Title, t.Count()))
                    });
                    break;
                case Axis.City:
                    result = data.GroupBy(t => t.Microdistrict.City).Select(t => new StatsItem
                    {
                        Key = t.Key.Title,
                        Values = t.GroupBy(t => t.Type)
                            .Select(t => new Pair(t.Key.Title, t.Count()))
                    });
                    break;
                case Axis.Microdistrict:
                    result = data.GroupBy(t => t.Microdistrict).Select(t => new StatsItem
                    {
                        Key = t.Key.Title,
                        Values = t.GroupBy(t => t.Type)
                            .Select(t => new Pair(t.Key.Title, t.Count()))
                    });
                    break;
                default:
                    break;
            }
            var r = result.AsEnumerable();
            var zeroValues = await _ctx.ThreatsTypes.AsNoTracking()
                .Select(t => new Pair(t.Title, 0)).ToListAsync();
            var comparer = new PairComparer();

            return new StatsModel
            {
                Query = form,
                Threats = r.Select(t => new StatsItem
                {
                    Key = t.Key,
                    Values = t.Values.Union(zeroValues, comparer).OrderBy(t => t.Key)
                })
            };
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> GenerateData()
        {
            if (await _ctx.Users.AnyAsync()) return BadRequest();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("admin1"));
            var hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            await _ctx.Users.AddAsync(new User
            {
                Username = "admin1",
                Password = hash
            });
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("User added");

            var dir = new DirectoryInfo(@"InitialData\Districts");
            await _ctx.Districts.AddRangeAsync(dir.GetFiles()
                .Select(t => new District
                {
                    Title = Regex.Match(t.Name, @"^\d\.(.+)\.txt$").Groups[1].Value,
                    SvgTag = ""
                }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Districts added");

            foreach (var file in dir.GetFiles())
            {
                await _ctx.Cities.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(file.FullName)).Select(t => new City
                {
                    DistrictId = int.Parse(file.Name.Substring(0, file.Name.IndexOf("."))),
                    Title = t,
                    SvgTag = ""
                }));
            }
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Cities added");

            var c = 1;
            foreach (var file in dir.GetFiles())
            {
                await _ctx.Microdistricts.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(file.FullName)).Select(t => new Microdistrict
                {
                    CityId = c++,
                    Title = t,
                    SvgTag = ""
                }));
            }
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Microdistricts added");

            await _ctx.ThreatsTypes.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(@"InitialData\types.txt")).Select(t => new ThreatsType
            {
                Title = t.Split('\t')[0],
                Level = int.Parse(t.Split('\t')[1]),
            }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Types added");

            var today = DateTime.Today;
            var temp = new DateTime(today.Year, today.Month, 1).AddDays(-1);
            var end = new DateTimeOffset(temp).ToUniversalTime();
            var begin = end.AddYears(-1);

            var rand = new Random();
            while (begin < end)
            {
                var p = rand.Next(5, 20);

                for (int i = 0; i < p; i++)
                {
                    await _ctx.Threats.AddAsync(new Threat
                    {
                        DateTime = begin.AddHours(rand.Next(24)).AddMinutes(rand.Next(60)),
                        MicrodistrictId = rand.Next(1, c),
                        TypeId = rand.Next(1, 7)
                    });
                }
                await _ctx.SaveChangesAsync();
                begin = begin.AddDays(1);
            }

            return Ok();
        }
    }

    class PairComparer : IEqualityComparer<Pair>
    {
        public bool Equals(Pair x, Pair y)
        {
            return x.Key == y.Key;
        }

        public int GetHashCode([DisallowNull] Pair obj)
        {
            return obj.Key.GetHashCode();
        }
    }
}

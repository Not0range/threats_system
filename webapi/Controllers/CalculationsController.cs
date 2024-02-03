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

            var threats = r.Select(t => new StatsItem
            {
                Key = t.Key,
                Values = t.Values.Union(zeroValues, comparer).OrderBy(t => t.Key)
            });

            IEnumerable<StatsItem> lim = null;
            if (form.Axis == Axis.Date && (form.MicrodistrictId.HasValue || form.CityId.HasValue))
            {
                int id;
                if (form.MicrodistrictId.HasValue)
                    id = (await _ctx.Microdistricts.FirstAsync(t => t.Id == form.MicrodistrictId.Value)).CityId;
                else
                    id = form.CityId.Value;

                var limits = await _ctx.Limits.Include(t => t.Type).OrderBy(t => t.Date).Where(t => t.CityId == id).ToListAsync();
                lim = r.Select(t => new StatsItem
                {
                    Key = t.Key,
                    Values = limits.Where(t2 => t2.Date < DateTimeOffset.Parse(t.Key))
                    .GroupBy(t => t.Type).Select(t => new Pair(t.Key.Title, t.MaxBy(t2 => t2.Date).Value))
                    .Union(zeroValues, comparer).OrderBy(t => t.Key)
                });
            }

            return new StatsModel
            {
                Query = form,
                Threats = threats,
                Limits = lim
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
                Name = "admin1",
                Position = "admin1",
                Password = hash
            });
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("User added");

            await _ctx.Districts.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(@"InitialData\districts.txt")).Select(t => new District
            {
                Title = t.Split('\t')[0],
                SvgTag = t.Split('\t')[1],
            }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Districts added");

            var dir = new DirectoryInfo(@"InitialData\Districts");
            foreach (var file in dir.GetFiles())
            {
                await _ctx.Cities.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(file.FullName)).Select(t => new City
                {
                    DistrictId = int.Parse(file.Name.Substring(0, file.Name.IndexOf("."))),
                    Title = t.Split('\t')[0],
                    SvgTag = t.Split('\t')[1]
                }));
            }
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Cities added");

            dir = new DirectoryInfo(@"InitialData\Micro");
            foreach (var file in dir.GetFiles())
            {
                await _ctx.Microdistricts.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(file.FullName)).Select(t => new Microdistrict
                {
                    CityId = int.Parse(file.Name.Substring(0, file.Name.IndexOf("."))),
                    Title = t.Split('\t')[0],
                    SvgTag = t.Split('\t')[1],
                }));
            }
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Microdistricts added stage 1");

            var cities = await _ctx.Cities.Where(t => t.Id > 2).ToListAsync();
            await _ctx.Microdistricts.AddRangeAsync(cities.Select(t => new Microdistrict
            {
                CityId = t.Id,
                Title = "Прочие",
                SvgTag = "",
            }));
            _logger.LogWarning("Microdistricts added stage 2");

            await _ctx.ThreatsTypes.AddRangeAsync((await System.IO.File.ReadAllLinesAsync(@"InitialData\types.txt")).Select(t => new ThreatsType
            {
                Title = t.Split('\t')[0],
                Level = int.Parse(t.Split('\t')[1]),
            }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Types added");

            var count = await _ctx.Microdistricts.CountAsync();
            var end = new DateTimeOffset(DateTime.Today.ToUniversalTime());
            var begin = end.AddYears(-1);

            var rand = new Random();
            while (begin < end)
            {
                var p = rand.Next(5, 30);

                for (int i = 0; i < p; i++)
                {
                    await _ctx.Threats.AddAsync(new Threat
                    {
                        DateTime = begin.AddHours(rand.Next(24)).AddMinutes(rand.Next(60)),
                        MicrodistrictId = rand.Next(1, count + 1),
                        TypeId = rand.Next(1, 7)
                    });
                }
                await _ctx.SaveChangesAsync();
                begin = begin.AddDays(1);
            }
            _logger.LogWarning("Threats added");

            var limit = await _ctx.ThreatsTypes.Select(t => new { t.Id, Limit = 1.0 / t.Level * 10 }).ToListAsync();
            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 1,
                TypeId = t.Id,
                Value = (int)t.Limit,
                Date = DateTimeOffset.UnixEpoch
            }));
            await _ctx.SaveChangesAsync();

            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 2,
                TypeId = t.Id,
                Value = (int)t.Limit,
                Date = DateTimeOffset.UnixEpoch
            }));
            await _ctx.SaveChangesAsync();

            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 1,
                TypeId = t.Id,
                Value = (int)(t.Limit * 1.5),
                Date = end.AddMonths(-6)
            }));
            await _ctx.SaveChangesAsync();

            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 2,
                TypeId = t.Id,
                Value = (int)(t.Limit * 1.2),
                Date = end.AddMonths(-6)
            }));
            await _ctx.SaveChangesAsync();

            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 1,
                TypeId = t.Id,
                Value = (int)(t.Limit * 0.9),
                Date = end.AddMonths(-2)
            }));
            await _ctx.SaveChangesAsync();

            await _ctx.Limits.AddRangeAsync(limit.Select(t => new Limit
            {
                CityId = 2,
                TypeId = t.Id,
                Value = (int)t.Limit,
                Date = end.AddMonths(-2)
            }));
            await _ctx.SaveChangesAsync();
            _logger.LogWarning("Limits added");

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

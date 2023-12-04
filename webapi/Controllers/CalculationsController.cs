using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Diagnostics.CodeAnalysis;
using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculationsController : ApiBase
    {
        public CalculationsController(DatabaseContext context) : base(context) { }

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

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThreatsController : ApiBase
    {
        public ThreatsController(DatabaseContext context) : base(context) { }

        [HttpGet]
        public async Task<Pagination<ThreatInfo>> GetList(int page = 1, int count = 20)
        {
            var threats = _ctx.Threats.AsNoTracking();
            var total = await threats.CountAsync();
            var result = ToOutput(threats.OrderByDescending(t => t.DateTime)
                .Skip((page - 1) * count).Take(count)).AsEnumerable();

            return new Pagination<ThreatInfo>
            {
                Result = result,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(total / (double)count),
                Count = count,
                TotalCount = total
            };
        }

        [HttpPut, Authorize(Roles = "0,1")]
        public async Task<ActionResult<ThreatInfo>> Add(ThreatModel model)
        {
            Source source = null;
            if (!string.IsNullOrWhiteSpace(model.Name) || !string.IsNullOrWhiteSpace(model.Phone) ||
                !string.IsNullOrWhiteSpace(model.Address))
            {
                source = await _ctx.Sources.FirstOrDefaultAsync(t => (t.Address == null || t.Address == model.Address) &&
                (t.Phone == null || t.Phone == model.Phone) && (t.Name == null || t.Name == model.Name));
                if (source == null)
                {
                    source = new Source
                    {
                        Name = string.IsNullOrWhiteSpace(model.Name) ? null : model.Name,
                        Phone = string.IsNullOrWhiteSpace(model.Phone) ? null : model.Phone,
                        Address = string.IsNullOrWhiteSpace(model.Address) ? null : model.Address,
                    };
                    await _ctx.Sources.AddAsync(source);
                    await _ctx.SaveChangesAsync();
                }
            }

            if (!await _ctx.ThreatsTypes.AnyAsync(t => t.Id == model.TypeId) ||
                !await _ctx.Microdistricts.AnyAsync(t => t.Id == model.MicrodistrictId)) return BadRequest();

            var threat = new Threat
            {
                TypeId = model.TypeId,
                MicrodistrictId = model.MicrodistrictId,
                DateTime = model.DateTime,
                SourceId = source?.Id,
            };
            await _ctx.Threats.AddAsync(threat);
            await _ctx.SaveChangesAsync();

            return await ToOutput(_ctx.Threats.AsNoTracking().Where(t => t.Id == threat.Id)).FirstAsync();
        }

        [HttpDelete, Authorize(Roles = "0")]
        public async Task<ActionResult> Delete(int id)
        {
            var threat = await _ctx.Threats.FirstOrDefaultAsync(t => t.Id == id);
            if (threat == null) return NotFound();

            _ctx.Threats.Remove(threat);
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        private IQueryable<ThreatInfo> ToOutput(IQueryable<Threat> threats)
        {
            return threats.Select(t => new ThreatInfo
            {
                Id = t.Id,
                Type = t.Type,
                DateTime = t.DateTime.DateTime,
                Source = t.Source,
                Place = new Place
                {
                    MictodistrictId = t.MicrodistrictId,
                    CityId = t.Microdistrict.CityId,
                    DistrictId = t.Microdistrict.City.DistrictId,
                    MicrodistrictTitle = t.Microdistrict.Title,
                    CityTitle = t.Microdistrict.City.Title,
                    DistrictTitle = t.Microdistrict.City.District.Title,
                }
            });
        }
    }
}

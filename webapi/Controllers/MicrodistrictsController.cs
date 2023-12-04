using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using System.Data;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

using Optional = webapi.Models.Input.Optional;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MicrodistrictsController : ApiBase
    {
        public MicrodistrictsController(DatabaseContext context) : base(context) { }

        [HttpGet("{cityId}")]
        public IEnumerable<CommonInfo> GetList(int cityId)
        {
            return ToOutput(_ctx.Microdistricts.Where(t => t.CityId == cityId)).AsEnumerable();
        }

        [HttpPut, Authorize(Roles = "0")]
        public async Task<ActionResult<CommonInfo>> Add(MicrodistrictModel model)
        {
            if (!await _ctx.Cities.AnyAsync(t => t.Id == model.CityId))
                return BadRequest();

            var micro = new Microdistrict
            {
                CityId = model.CityId,
                Title = model.Title,
                SvgTag = model.SvgTag,
            };
            await _ctx.Microdistricts.AddAsync(micro);
            await _ctx.SaveChangesAsync();
            return await ToOutput(_ctx.Microdistricts.Where(t => t.Id == micro.Id)).FirstAsync();
        }

        [HttpPost("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult<CommonInfo>> Edit(int id, Optional.MicrodistrictModel model)
        {
            var micro = await _ctx.Microdistricts.FirstOrDefaultAsync(t => t.Id == id);
            if (micro == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(model.Title))
                micro.Title = model.Title;

            if (!string.IsNullOrWhiteSpace(model.SvgTag))
                micro.SvgTag = model.SvgTag;

            if (model.CityId.HasValue)
            {
                if (!await _ctx.Cities.AnyAsync(t => t.Id == model.CityId.Value))
                    return BadRequest();
                micro.CityId = model.CityId.Value;
            }


            await _ctx.SaveChangesAsync();
            return await ToOutput(_ctx.Microdistricts.Where(t => t.Id == micro.Id)).FirstAsync();
        }

        [HttpDelete("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult> Delete(int id)
        {
            var micro = await _ctx.Microdistricts.FirstOrDefaultAsync(t => t.Id == id);
            if (micro == null) return NotFound();

            _ctx.Microdistricts.Remove(micro);
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        private IQueryable<CommonInfo> ToOutput(IQueryable<Microdistrict> microdistricts)
        {
            return microdistricts.Select(t => new CommonInfo
            {
                Id = t.Id,
                Title = t.Title,
                SvgTag = t.SvgTag,
            });
        }
    }
}

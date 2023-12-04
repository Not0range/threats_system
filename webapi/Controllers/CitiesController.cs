using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Data;

using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

using Optional = webapi.Models.Input.Optional;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ApiBase
    {
        public CitiesController(DatabaseContext context) : base(context) { }

        [HttpGet("{districtId}")]
        public IEnumerable<CommonInfo> GetList(int districtId)
        {
            return ToOutput(_ctx.Cities.Where(t => t.DistrictId == districtId)).AsEnumerable();
        }

        [HttpPut, Authorize(Roles = "0")]
        public async Task<ActionResult<CommonInfo>> Add(CityModel model)
        {
            if (!await _ctx.Districts.AnyAsync(t => t.Id == model.DistrictId))
                return BadRequest();

            var city = new City
            {
                DistrictId = model.DistrictId,
                Title = model.Title,
                SvgTag = model.SvgTag,
            };
            await _ctx.Cities.AddAsync(city);
            await _ctx.SaveChangesAsync();
            return await ToOutput(_ctx.Cities.Where(t => t.Id == city.Id)).FirstAsync();
        }

        [HttpPost("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult<CommonInfo>> Edit(int id, Optional.CityModel model)
        {
            var city = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == id);
            if (city == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(model.Title))
                city.Title = model.Title;
            if (!string.IsNullOrWhiteSpace(model.SvgTag))
                city.SvgTag = model.SvgTag;

            if (model.DistrictId.HasValue)
            {
                if (!await _ctx.Districts.AnyAsync(t => t.Id == model.DistrictId.Value))
                    return BadRequest();
                city.DistrictId = model.DistrictId.Value;
            }


            await _ctx.SaveChangesAsync();
            return await ToOutput(_ctx.Cities.Where(t => t.Id == city.Id)).FirstAsync();
        }

        [HttpDelete("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult> Delete(int id)
        {
            var city = await _ctx.Cities.FirstOrDefaultAsync(t => t.Id == id);
            if (city == null) return NotFound();

            _ctx.Cities.Remove(city);
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        private IQueryable<CommonInfo> ToOutput(IQueryable<City> cities)
        {
            return cities.Select(t => new CommonInfo
            {
                Id = t.Id,
                Title = t.Title,
                SvgTag = t.SvgTag,
            });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Data;

using webapi.Entities;
using webapi.Models.Input;

using Optional = webapi.Models.Input.Optional;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistrictsController : ApiBase
    {
        public DistrictsController(DatabaseContext context) : base(context) { }

        [HttpGet]
        public IEnumerable<District> GetList()
        {
            return _ctx.Districts.AsEnumerable();
        }

        [HttpPut, Authorize(Roles = "0")]
        public async Task<ActionResult<District>> Add(DistrictModel model)
        {
            if (await _ctx.Districts.AnyAsync(t => t.Title.ToLower() == model.Title.ToLower()))
                return BadRequest();

            var district = new District
            {
                Title = model.Title,
                SvgTag = model.SvgTag,
            };
            await _ctx.Districts.AddAsync(district);
            await _ctx.SaveChangesAsync();
            return district;
        }

        [HttpPost("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult<District>> Edit(int id, Optional.DistrictModel model)
        {
            var district = await _ctx.Districts.FirstOrDefaultAsync(t => t.Id == id);
            if (district == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(model.Title))
            {
                if (await _ctx.Districts.AnyAsync(t => t.Title.ToLower() == model.Title.ToLower()))
                    return BadRequest();
                district.Title = model.Title;
            }
            if (!string.IsNullOrWhiteSpace(model.SvgTag))
                district.SvgTag = model.SvgTag;

            await _ctx.SaveChangesAsync();
            return district;
        }

        [HttpDelete("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult> Delete(int id)
        {
            var district = await _ctx.Districts.FirstOrDefaultAsync(t => t.Id == id);
            if (district == null) return NotFound();

            _ctx.Districts.Remove(district);
            await _ctx.SaveChangesAsync();
            return Ok();
        }
    }
}

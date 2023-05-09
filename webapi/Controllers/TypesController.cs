using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using webapi.Entities;
using webapi.Models;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TypesController : ApiBase
    {
        public TypesController(DatabaseContext context) : base(context) { }

        [HttpGet]
        public IEnumerable<ThreatsType> GetList()
        {
            return _ctx.ThreatsTypes.AsEnumerable();
        }

        [HttpPut, Authorize(Roles = "0")]
        public async Task<ActionResult<ThreatsType>> Add(ThreatsTypeModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Title) || !model.Level.HasValue)
                return BadRequest();

            var type = new ThreatsType
            {
                Title = model.Title,
                Level = model.Level.Value
            };
            await _ctx.ThreatsTypes.AddAsync(type);
            await _ctx.SaveChangesAsync();
            return type;
        }

        [HttpPost("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult<ThreatsType>> Edit(int id, ThreatsTypeModel model)
        {
            var type = await _ctx.ThreatsTypes.FirstOrDefaultAsync(t => t.Id == id);
            if (type == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(model.Title))
                type.Title = model.Title;
            if (model.Level.HasValue)
                type.Level = model.Level.Value;

            await _ctx.SaveChangesAsync();
            return type;
        }

        [HttpDelete("{id}"), Authorize(Roles = "0")]
        public async Task<ActionResult> Delete(int id)
        {
            var type = await _ctx.ThreatsTypes.FirstOrDefaultAsync(t => t.Id == id);
            if (type == null) return NotFound();

            _ctx.ThreatsTypes.Remove(type);
            await _ctx.SaveChangesAsync();
            return Ok();
        }
    }
}

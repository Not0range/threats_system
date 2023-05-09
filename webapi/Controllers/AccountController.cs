using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

using System.Text;

using webapi.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using webapi.Entities;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ApiBase
    {
        public AccountController(DatabaseContext context) : base(context) { }

        [HttpPost("[action]")]
        public async Task<ActionResult> Login([FromForm] LoginModel login)
        {
            var user = await _ctx.Users.AsNoTracking().FirstOrDefaultAsync(t => 
                t.Username.ToLower() == login.Username.ToLower());
            if (user == null) return NotFound();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(login.Password));
            var hash = Encoding.UTF8.GetString(await sha.ComputeHashAsync(stream));
            stream.Close();

            if (user.Password != hash)
                return NotFound();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, ((byte)user.Role).ToString()),
                new Claim(ClaimTypes.Sid, user.Id.ToString())
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity), new AuthenticationProperties
                {
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(1)
                });
            return Ok();
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult> Logout()
        {
            if (UserId == null) return BadRequest();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult<string>> Check()
        {
            if (UserId == null) return BadRequest();

            var user = await _ctx.Users.AsNoTracking().FirstOrDefaultAsync(t => t.Id == UserId);
            if (user == null)
            {
                SignOut(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized();
            }
            return user.Username;
        }

        [HttpGet("[action]")]
        public async Task<ActionResult> InitialCreate()
        {
            if (await _ctx.Users.AsNoTracking().AnyAsync()) return BadRequest();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes("Admin1"));
            var hash = Encoding.UTF8.GetString(await sha.ComputeHashAsync(stream));
            stream.Close();

            var user = new User
            {
                Username = "Admin1",
                Password = hash,
                Role = UserRole.Administrator
            };
            await _ctx.Users.AddAsync(user);
            await _ctx.SaveChangesAsync();
            return Ok();
        }
    }
}

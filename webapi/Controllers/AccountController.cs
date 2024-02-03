using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Security.Claims;

using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using webapi.Entities;
using webapi.Models.Input;
using webapi.Models.Output;

namespace webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ApiBase
    {
        private const int digitCount = '9' - '0' + 1;
        private const int alphaCount = 'z' - 'a' + 1;

        public AccountController(DatabaseContext context) : base(context) { }

        [HttpGet("[action]"), Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<FullUserModel>>> List()
        {
            return await _ctx.Users.OrderBy(t => t.Id).Select(t => new FullUserModel
            {
                Id = t.Id,
                Username = t.Username,
                Name = t.Name,
                Position = t.Position,
                Role = t.Role,
            }).ToListAsync();
        }

        [HttpPost("[action]")]
        public async Task<ActionResult<FullUserModel>> Login([FromForm] LoginModel login)
        {
            var user = await _ctx.Users.AsNoTracking().FirstOrDefaultAsync(t =>
                t.Username.ToLower() == login.Username.ToLower());
            if (user == null) return NotFound();

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(login.Password));
            var hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            if (!user.Password.SequenceEqual(hash))
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
            return new FullUserModel
            {
                Id = user.Id,
                Username = user.Username,
                Name = user.Name,
                Position = user.Position,
                Role = user.Role,
            };
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult> Logout()
        {
            if (UserId == null) return BadRequest();
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("[action]"), Authorize]
        public async Task<ActionResult<FullUserModel>> Check()
        {
            if (UserId == null) return BadRequest();

            var user = await _ctx.Users.AsNoTracking().FirstOrDefaultAsync(t => t.Id == UserId);
            if (user == null)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized();
            }
            return new FullUserModel
            {
                Id = user.Id,
                Username = user.Username,
                Name = user.Name,
                Position = user.Position,
                Role = user.Role,
            };
        }

        [HttpPost("[action]"), Authorize(Roles = "0")]
        public async Task<ActionResult<NewUserModel>> Create(UserForm model)
        {
            if (await _ctx.Users.AnyAsync(t => t.Username.ToLower() == model.Username.ToLower()) ||
                model.Role < 0 || model.Role > (int)UserRole.User)
                return BadRequest();

            var sha = SHA256.Create();
            var pass = GenerateString(6);
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(pass));
            var hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            var user = new User
            {
                Username = model.Username,//TODO
                Name = model.Name,
                Position = model.Position,
                Password = hash,
                Role = (UserRole)model.Role
            };
            await _ctx.Users.AddAsync(user);
            await _ctx.SaveChangesAsync();

            return new NewUserModel
            {
                Username = model.Username,
                Name = model.Name,
                Position = model.Position,
                Password = pass,
                Role = (UserRole)model.Role
            };
        }

        [HttpPost("[action]/{userId}"), Authorize(Roles = "0")]
        public async Task<ActionResult<UserModel>> Edit(int userId, Models.Input.Optional.UserForm model)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(t => t.Id == userId);
            if (user == null)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(model.Username))
                user.Username = model.Username;
            if (!string.IsNullOrWhiteSpace(model.Name))
                user.Name = model.Name;
            if (!string.IsNullOrWhiteSpace(model.Position))
                user.Position = model.Position;
            await _ctx.SaveChangesAsync();

            return new UserModel
            {
                Username = model.Username,
                Name = model.Name,
                Position = model.Position,
                Role = (UserRole)model.Role
            };
        }

        [HttpPost("[action]"), Authorize]
        public async Task<ActionResult> ChangePassword(ChangePasswordModel model)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(t => t.Id == UserId);
            if (user == null)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized();
            }

            var sha = SHA256.Create();
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(model.OldPassword));
            var hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            if (!user.Password.SequenceEqual(hash))
                return NotFound();

            stream = new MemoryStream(Encoding.UTF8.GetBytes(model.NewPassword));
            hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            user.Password = hash;
            await _ctx.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("[action]/{userId}"), Authorize(Roles = "0")]
        public async Task<ActionResult<NewUserModel>> ResetPassword(int userId)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(t => t.Id == userId);
            if (user == null)
            {
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return NotFound();
            }

            var sha = SHA256.Create();
            var pass = GenerateString(6);
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(pass));
            var hash = await sha.ComputeHashAsync(stream);
            stream.Close();

            user.Password = hash;
            await _ctx.SaveChangesAsync();

            return new NewUserModel
            {
                Username = user.Username,
                Name = user.Name,
                Position = user.Position,
                Password = pass,
                Role = user.Role
            };
        }

        private string GenerateString(int count)
        {
            var rand = new Random();
            var builder = new StringBuilder();
            for (int i = 0; i < count; i++)
            {
                char c;
                var n = (byte)rand.Next(digitCount + alphaCount * 2);
                if (n >= digitCount)
                {
                    n -= digitCount;
                    if (n >= alphaCount)
                        c = (char)(0x61 + n - alphaCount);
                    else
                        c = (char)(0x41 + n);
                }
                else
                    c = (char)(0x30 + n);
                builder.Append(c);
            }
            return builder.ToString();
        }
    }
}

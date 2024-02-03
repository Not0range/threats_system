using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

using webapi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.CustomSchemaIds(type => type.FullName);
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(option =>
    {
        option.ExpireTimeSpan = new TimeSpan(24, 0, 0);
        option.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        option.Cookie.SameSite = SameSiteMode.None;
        option.AccessDeniedPath = string.Empty;
    });

builder.Services.AddDbContext<DatabaseContext>(option =>
    option.UseNpgsql(builder.Configuration.GetConnectionString("Database"))
);
builder.Services.AddLogging();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}


app.UseAuthorization();
app.UseAuthorization();

app.MapControllers();
if (!app.Environment.IsDevelopment())
    app.MapFallbackToFile("index.html");

app.Run();

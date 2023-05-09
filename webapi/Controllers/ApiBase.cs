using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

using System.Security.Claims;

namespace webapi.Controllers
{
    public class ApiBase : ControllerBase
    {
        protected readonly DatabaseContext _ctx;
        public ApiBase(DatabaseContext context)
        {
            _ctx = context;
        }

        protected int? UserId
        {
            get
            {
                var id = User.Claims.FirstOrDefault(t => t.Type == ClaimTypes.Sid);
                if (id == null) return null;
                else return id.Value.ToInt();
            }
        }
    }
}

using webapi.Entities;

namespace webapi.Models.Output
{
    public class NewUserModel
    {
        public string Username { get; set; }
        public UserRole Role { get; set; }
        public string Password { get; set; }
    }
}

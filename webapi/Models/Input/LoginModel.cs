using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class LoginModel
    {
        [Required, MaxLength(30)]
        public string Username { get; set; }
        [Required, MaxLength(50)]
        public string Password { get; set; }
    }
}

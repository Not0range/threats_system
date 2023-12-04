using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class LoginModel
    {
        [Required, MinLength(6), MaxLength(30)]
        public string Username { get; set; }
        [Required, MinLength(6), MaxLength(50)]
        public string Password { get; set; }
    }
}

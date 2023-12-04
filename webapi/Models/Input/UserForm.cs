using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class UserForm
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public int Role { get; set; }
    }
}

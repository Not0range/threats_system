using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class UserForm
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Position { get; set; }
        [Required]
        public int Role { get; set; }
    }
}

namespace webapi.Models.Input.Optional
{
    public class UserForm
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int? Role { get; set; }
    }
}

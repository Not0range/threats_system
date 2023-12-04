using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class ChangePasswordModel
    {
        [Required]
        public string OldPassword { get; set; }
        [Required]
        public string NewPassword { get; set; }
    }
}

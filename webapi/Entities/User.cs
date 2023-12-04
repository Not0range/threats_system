using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Toolbelt.ComponentModel.DataAnnotations.Schema.V5;

namespace webapi.Entities
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required, IndexColumn, MaxLength(50)]
        public string Username { get; set; }
        [Required]
        public byte[] Password { get; set; }
        [Required]
        public UserRole Role { get; set; }
    }

    public enum UserRole : byte
    {
        Administrator,
        Moderator,
        User
    }
}

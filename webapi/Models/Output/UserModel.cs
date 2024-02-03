using System.ComponentModel.DataAnnotations;

using webapi.Entities;

namespace webapi.Models.Output
{
    public class FullUserModel
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public UserRole Role { get; set; }
    }
    public class UserModel
    {
        public string Username { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public UserRole Role { get; set; }
    }
}

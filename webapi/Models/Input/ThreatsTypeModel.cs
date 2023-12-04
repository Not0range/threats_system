using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class ThreatsTypeModel
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public int Level { get; set; }
    }
}

namespace webapi.Models.Input.Optional
{
    public class ThreatsTypeModel
    {
        public string Title { get; set; }
        public int? Level { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class ThreatsTypeModel
    {
        public string Title { get; set; }
        public int? Level { get; set; }
    }
}

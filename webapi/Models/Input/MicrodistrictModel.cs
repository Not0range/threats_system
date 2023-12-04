using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class MicrodistrictModel
    {
        [Required]
        public int CityId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string SvgTag { get; set; }
    }

}
namespace webapi.Models.Input.Optional
{
    public class MicrodistrictModel
    {
        public int? CityId { get; set; }
        public string Title { get; set; }
        public string SvgTag { get; set; }
    }
}
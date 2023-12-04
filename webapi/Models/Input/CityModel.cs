using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class CityModel
    {
        [Required]
        public int DistrictId { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string SvgTag { get; set; }
    }
    
}
namespace webapi.Models.Input.Optional
{
    public class CityModel
    {
        public int? DistrictId { get; set; }
        public string Title { get; set; }
        public string SvgTag { get; set; }
    }
}

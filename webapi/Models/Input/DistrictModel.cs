using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class DistrictModel
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string SvgTag { get; set; }
    }
}

namespace webapi.Models.Input.Optional
{
    public class DistrictModel
    {
        public string Title { get; set; }
        public string SvgTag { get; set; }
    }
}

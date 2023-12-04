using System.ComponentModel.DataAnnotations;

namespace webapi.Models.Input
{
    public class ThreatModel
    {
        [Required]
        public int TypeId { get; set; }
        [Required]
        public int MicrodistrictId { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entities
{
    [Table("Cities")]
    public class City
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(District))]
        public int DistrictId { get; set; }
        public District District { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string SvgTag { get; set; }
    }
}

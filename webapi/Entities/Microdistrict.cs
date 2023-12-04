using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace webapi.Entities
{
    [Table("Microdisstricts")]
    public class Microdistrict
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(City))]
        public int CityId { get; set; }
        public City City { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string SvgTag { get; set; }
    }
}

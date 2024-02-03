using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entities
{
    [Table("Limits")]
    public class Limit
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(City))]
        public int CityId { get; set; }
        public City City { get; set; }
        [ForeignKey(nameof(Type))]
        public int TypeId { get; set; }
        public ThreatsType Type { get; set; }
        [Required]
        public DateTimeOffset Date { get; set; }
        [Required]
        public int Value { get; set; }
    }
}

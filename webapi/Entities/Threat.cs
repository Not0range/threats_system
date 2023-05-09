using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Entities
{
    [Table("Threats")]
    public class Threat
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(Type))]
        public int TypeId { get; set; }
        public ThreatsType Type { get; set; }
        [Required, MaxLength(500)]
        public string Address { get; set; }
        [Required]
        public DateTime DateTime { get; set; }
        [ForeignKey(nameof(Source))]
        public int? SourceId { get; set; }
        public Source Source { get; set; }
    }
}

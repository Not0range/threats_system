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
        [ForeignKey(nameof(Microdistrict))]
        public int MicrodistrictId { get; set; }
        public Microdistrict Microdistrict { get; set; }
        [Required]
        public DateTimeOffset DateTime { get; set; }
        [ForeignKey(nameof(Source))]
        public int? SourceId { get; set; }
        public Source Source { get; set; }
    }
}

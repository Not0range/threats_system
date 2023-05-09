using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace webapi.Entities
{
    [Table("Sources")]
    public class Source
    {
        [Key]
        public int Id { get; set; }
        [MaxLength(50)]
        public string Name { get; set; }
        [MaxLength(10)]
        public string Phone { get; set; }
        [MaxLength(500)]
        public string Address { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace SmsSablon.Models
{
    public class SmsHeader
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Header { get; set; }

        // Navigation property: Bir Header'ın birçok Info'su olabilir
        public List<Info>? Infos { get; set; }
    }
}

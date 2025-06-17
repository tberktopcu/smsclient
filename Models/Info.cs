using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmsSablon.Models
{
    public class Info
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string SmsText { get; set; }

        public bool IsLocked { get; set; }

        public string TemplateName { get; set; }

        // Foreign Key
        public int SmsHeaderId { get; set; }

        // Navigation property
        [ForeignKey("SmsHeaderId")]
        [JsonIgnore]  // <- Döngüyü önlemek için eklendi
        public SmsHeader? SmsHeader { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Token { get; set; }

        public DateTime Expiration { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
    }

}

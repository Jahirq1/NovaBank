namespace Backend.Models.DTO
{
    public class UserProfileUpdateDto
    {
        public int id { get; set; }

        public string? name { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? address { get; set; }
        public string? city { get; set; }

        // yyyy-MM-dd vjen si string –  binder-i e kthen në DateOnly
        public DateOnly? dateOfBirth { get; set; }
    }
}

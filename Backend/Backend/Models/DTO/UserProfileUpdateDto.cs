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

   
        public DateOnly? dateOfBirth { get; set; }
    }
}

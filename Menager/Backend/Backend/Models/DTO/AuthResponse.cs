namespace Backend.Models.DTO
{
    public class AuthResponse
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public string Role { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; } = "Login successful";
    }

}

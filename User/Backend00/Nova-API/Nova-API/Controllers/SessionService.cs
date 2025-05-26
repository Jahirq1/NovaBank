namespace NOVA_API.Controllers
{
    public class SessionService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        private const string UserIdKey = "UserId";
        private const string UserRoleKey = "UserRole";

        public SessionService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        // Merr ID e përdoruesit nga sesioni
        public int? GetUserId()
        {
            var userIdString = _httpContextAccessor.HttpContext?.Session.GetString(UserIdKey);
            if (int.TryParse(userIdString, out int userId))
                return userId;
            return null;
        }

        // Ruaj ID e përdoruesit në sesion
        public void SetUserId(int userId)
        {
            _httpContextAccessor.HttpContext?.Session.SetString(UserIdKey, userId.ToString());
        }

        // Merr rolin e përdoruesit nga sesioni
        public string GetUserRole()
        {
            return _httpContextAccessor.HttpContext?.Session.GetString(UserRoleKey);
        }

        // Ruaj rolin në sesion
        public void SetUserRole(string role)
        {
            _httpContextAccessor.HttpContext?.Session.SetString(UserRoleKey, role);
        }

        // Pastro sesionin komplet
        public void ClearSession()
        {
            _httpContextAccessor.HttpContext?.Session.Clear();
        }
    }
}

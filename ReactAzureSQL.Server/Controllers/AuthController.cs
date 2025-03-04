using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ReactAzureSQL.Server.Data;
using ReactAzureSQL.Server.Models;

namespace ReactAzureSQL.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        //[HttpOptions("login/preflight")]
        //public IActionResult Preflight()
        //{
        //    Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:54720");
        //    Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
        //    Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
        //    Response.Headers.Add("Access-Control-Allow-Credentials", "true");
        //    return Ok(); // Must return a valid response
        //}
        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginModel loginModel)
        {
            //if (loginModel.Username == "testuser" && loginModel.Password == "password123")
            //{
            //    //var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InRlc3R1c2VyIiwibmJmIjoxNzQxMTAzOTM3LCJleHAiOjE3NDExMDc1MzcsImlhdCI6MTc0MTEwMzkzN30.C7BJ_0qLUC_tW2V92s-3so41cHeR0Et2BhBwcLiBndg"; // Simulated JWT token

            //    // Manually adding CORS headers for debugging
            //    Response.Headers.Add("Access-Control-Allow-Origin", "https://localhost:54720");
            //    Response.Headers.Add("Access-Control-Allow-Credentials", "true");

            //    return Ok("ok ok");
            //}
            if (loginModel == null) return BadRequest("Invalid client request.");

            var user = _context.User.FirstOrDefault(u => u.Username == loginModel.Username && u.IsActive);
            if (user == null) return Unauthorized("User not found or inactive.");

            if (user.Password != loginModel.Password) return Unauthorized("Invalid credentials.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("politeatonetwothreefourfivesixseverneightnineten");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Username) }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return Ok(new { Token = tokenString, RememberMe = user.RememberMe });

        }
    }
}

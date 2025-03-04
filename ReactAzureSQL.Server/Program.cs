using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactAzureSQL.Server.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy BEFORE services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:54721") // Ensure React URL is correct
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required if sending credentials (JWT, Cookies)
    });
});

// Add authentication with JWT
var key = Encoding.ASCII.GetBytes("politeatonetwothreefourfivesixseverneightnineten");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false, // Consider setting `true` if you have an issuer
            ValidateAudience = false // Consider setting `true` if you have an audience
        };

        // Allow frontend to send the token via the "Authorization" header
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["token"]; // If using cookies
                if (string.IsNullOrEmpty(context.Token) && !string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }
                return Task.CompletedTask;
            }
        };
    });

// Add database context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add controllers and API documentation
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
// Use CORS **before authentication & authorization**
app.UseCors("AllowSpecificOrigin");

// Apply authentication & authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

app.Run();

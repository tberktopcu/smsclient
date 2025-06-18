using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SmsSablon.Models;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(UserManager<ApplicationUser> userManager,
                          SignInManager<ApplicationUser> signInManager,
                          JwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok("Kayıt başarılı");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return Unauthorized("Kullanıcı bulunamadı");

        var check = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!check.Succeeded) return Unauthorized("Hatalı giriş");

        var token = _jwtTokenService.GenerateToken(user);
        return Ok(new { token });
    }

    [Authorize(AuthenticationSchemes = "Bearer")]
    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;          
        var user = await _userManager.FindByIdAsync(userId!);
        return Ok(new { user.UserName, user.Email});
    }
}

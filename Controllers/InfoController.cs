using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmsSablon.Data;
using SmsSablon.Models;

namespace SmsSablon.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    [Route("api/[controller]")]
    public class InfoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InfoController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Info
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Info>>> GetAll()
        {
            return await _context.Infos
                .Include(i => i.SmsHeader)
                .OrderBy(i => i.Id)
                .ToListAsync();
        }

        // GET: api/Info/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Info>> GetById(int id)
        {
            var info = await _context.Infos.Include(i => i.SmsHeader)
                          .FirstOrDefaultAsync(i => i.Id == id);
            if (info == null)
                return NotFound();

            return info;
        }

        // POST: api/Info
        [HttpPost]
        public async Task<ActionResult<Info>> Create(Info info)
        {
            _context.Infos.Add(info);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = info.Id }, info);
        }

        // PUT: api/Info/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Info info)
        {
            if (id != info.Id)
                return BadRequest("ID uyuşmuyor");

            var existingInfo = await _context.Infos.FindAsync(id);
            if (existingInfo == null)
                return NotFound();

            // Güncellenecek alanları tek tek kopyala
            existingInfo.SmsText = info.SmsText;
            existingInfo.IsLocked = info.IsLocked;
            existingInfo.TemplateName = info.TemplateName;
            existingInfo.SmsHeaderId = info.SmsHeaderId;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Güncelleme sırasında hata oluştu: " + ex.Message);
            }

            return NoContent();
        }


        // DELETE: api/Info/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var info = await _context.Infos.FindAsync(id);
            if (info == null)
                return NotFound();

            _context.Infos.Remove(info);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
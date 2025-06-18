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
    public class SmsHeaderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SmsHeaderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/SmsHeader
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SmsHeader>>> GetAll()
        {
            return await _context.SmsHeaders.Include(h => h.Infos).ToListAsync();
        }

        // GET: api/SmsHeader/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SmsHeader>> GetById(int id)
        {
            var header = await _context.SmsHeaders.Include(h => h.Infos)
                        .FirstOrDefaultAsync(h => h.Id == id);
            if (header == null)
                return NotFound();

            return header;
        }

        // POST: api/SmsHeader
        [HttpPost]
        public async Task<ActionResult<SmsHeader>> Create(SmsHeader header)
        {
            _context.SmsHeaders.Add(header);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = header.Id }, header);
        }

        // PUT: api/SmsHeader/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SmsHeader header)
        {
            if (id != header.Id)
                return BadRequest();

            _context.Entry(header).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.SmsHeaders.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Bu başlık bir SMS şablonunda kullanılıyor mu kontrolü
            bool isUsed = await _context.Infos.AnyAsync(i => i.SmsHeaderId == id);

            if (isUsed)
            {
                return BadRequest("Bu başlık en az bir SMS şablonunda kullanılıyor ve silinemez.");
            }

            var header = await _context.SmsHeaders.FindAsync(id);
            if (header == null)
                return NotFound();

            _context.SmsHeaders.Remove(header);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

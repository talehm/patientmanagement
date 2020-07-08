using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cepres.Models;
using System.Collections.Immutable;
using Microsoft.AspNetCore.Authorization;

namespace cepres.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly PatientDBContext _context;

        public RecordsController(PatientDBContext context)
        {
            _context = context;
        }

        // GET: api/Records
        [HttpGet]
        public async Task<ActionResult<List<object>>> GetRecords()
        {
            //var pateintNames=_context.Patient.Select()

            var collection = (from p in _context.Patient
                              join r in _context.Records
                              on p.Id equals r.PatientId
                              select new
                              {
                                  p.Name,
                                  r.Disease,
                                  CreatedAt = r.CreatedAt.HasValue ? r.CreatedAt.Value.ToString("MMMM dd yyyy") : "<not available>"
                              });
            var result = await collection.ToListAsync();
            return new JsonResult(new { result });
        }

        
        // POST: api/Records
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Records>> PostRecords(Records records)
        {

            _context.Records.Add(records);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RecordsExists(records.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            //return CreatedAtAction("GetRecords", new { id = records.Id }, records);
            return StatusCode(200);
        }



        private bool RecordsExists(int id)
        {
            return _context.Records.Any(e => e.Id == id);
        }
    }
}

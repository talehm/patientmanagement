using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cepres.Models;
using Microsoft.AspNetCore.Authorization;

namespace cepres.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MetaDatasController : ControllerBase
    {
        private readonly PatientDBContext _context;

        public MetaDatasController(PatientDBContext context)
        {
            _context = context;
        }

        // GET: api/MetaDatas
        [HttpGet("statistics/")]
        public async Task<ActionResult<List<object>>> GetMetaData()
        {
            var metaDataPatientCount= await _context.MetaData
                .GroupBy(m=>m.PatientId)
                .Select(g => g.Count() )
                .ToListAsync();
            var metaDataCount =await _context.MetaData
                .Select(m=>m.Id)
                .ToListAsync();
            float AverageNumberOfUsedMetaData = metaDataCount.Count() / metaDataPatientCount.Count();
            var maxNumberOfUsedMetaData = await _context.MetaData
                .Select(m =>m.PatientId)
                .GroupBy(m => m)
                .Select(m => m.Count())
                .OrderByDescending(m => m)
                .FirstOrDefaultAsync();
            var TopThreeHighestKeys = await _context.MetaData
                .Select(m =>new { m.Key})
                .GroupBy(m => m)
                .OrderByDescending(m =>m.Count() )
                .Select(m=>m.Key)
                .Take(3)
                .ToArrayAsync();
            return new JsonResult(new { 
                AverageNumberOfUsedMetaData,
                maxNumberOfUsedMetaData,
                TopThreeHighestKeys
            });
        }        
    }
}

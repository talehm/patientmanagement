using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using cepres.Models;
using System.Net.Http;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
    
namespace cepres.Controllers
{   [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientDBContext _context;

        public PatientsController(PatientDBContext context)
        {
            _context = context;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<List<object>>> GetPatient(int page,int pageSize, bool firstPage, bool lastPage)
        {
            if (pageSize < 1 ) pageSize = 10;
            if (lastPage)
            {
                var count = _context.Patient.Count();
                page = count / pageSize;

            }
            if (page < 1 || firstPage ) page = 1;
            
            var collection =  _context.Patient
                 .Include(a => a.Records)
                 .Select(a =>
                     new
                     {

                         name = a.Name,
                         id = a.Id,
                         dateOfBirth = a.DateOfBirth.HasValue ? a.DateOfBirth.Value.ToString("MMMM dd yyyy") : "<not available>",
                         lastEntry = a.Records.Max(t => t.CreatedAt).HasValue ? a.Records.Max(t => t.CreatedAt).Value.ToString("MMMM dd yyyy") : "<not available>",
                         metaDataCount = a.MetaData.Count(m => m.Id > 0)
                     
                      }
                     );

            var result = await collection.Skip((Math.Max(0, page - 1)) * pageSize).Take(pageSize).ToListAsync();
            return new JsonResult(new { result, page, pageSize });
            
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<object>>> GetPatient(int id)
        {
            var collection = _context.Patient
                 .Include(a => a.MetaData)
                 .Select(a =>
                     new
                     {
                         name = a.Name,
                         email=a.Email,
                         id = a.Id,
                         dateOfBirth = a.DateOfBirth,
                         officialId = a.OfficialId,
                         metaData = a.MetaData.Select(m =>new { m.Key, m.Value, m.Id})
                     }
                     ).Where(x=>id==x.id);
            var result= await collection.ToListAsync();
            return new JsonResult(new { result });
        }

        // GET: api/Patients/name/test
        [HttpGet("name/{name}")]
        public async Task<ActionResult<List<object>>> GetPatientName(string name)
        {
            var collection = _context.Patient.Select(a =>
                     new
                     {
                       a.Name,
                         a.Id
                     }
                     ).Where(x => x.Name.Contains(name));
            var result = await collection.ToListAsync();
            return new JsonResult(new { result });
        }

        // GET: api/Patients/report
        [HttpGet("report/{id}")]
        public async Task<ActionResult<List<object>>> GetPatientReport(int id)
        {
            //similar deseased patients

            var patientDiseasesAll = await _context.Records.Where(x => x.PatientId == id).Select(x => x.Disease).ToArrayAsync();
            var similarDeseasedPatientIdList = await
                    _context
                    .Records
                    .Where(x => x.PatientId != id)
                    .Where(x => patientDiseasesAll.Contains(x.Disease))
                    .GroupBy(x => x.PatientId)
                    .Where(x => x.Count() > 1)
                    .Select(x => x.Key)
                    .ToArrayAsync();

            var similarDeseasedPatientsList = await _context
                .Patient
                .Where(x => similarDeseasedPatientIdList.Contains(x.Id))
                .Select(x => new { x.Id, x.Name })
                .ToArrayAsync();

            var RecordsCollection = _context.Records.Where(r => r.PatientId == id);
            double? AverageBill = RecordsCollection.Average(r => r.Bill);
            double? StdDevOfBills = CalculateStdDevv(RecordsCollection.Select(x => Convert.ToDouble(x.Bill)));
            double? AverageBillWithoutOutlier = GetAverageBillWithoutOutlier(RecordsCollection, AverageBill, StdDevOfBills);
            var FifthRecord = await RecordsCollection.
                OrderBy(x => x.CreatedAt).
                Skip(4).
                Select(x=>  
                    new { 
                        x.Disease,
                        x.Description,
                        x.Bill, 
                        CreatedAt=x.CreatedAt.HasValue ? x.CreatedAt.Value.ToString("MMMM dd yyyy") : "<not available>" }).
                FirstOrDefaultAsync();
            var allMonths = CultureInfo.CurrentCulture.DateTimeFormat.MonthNames;
            var MonthOfHighestVisit =
                _context
                .Records
                .Where(x => x.PatientId == id)
                .Select(x => x.CreatedAt.Value.Month)
                .GroupBy(x => x)
                .OrderByDescending(x => x.Count())
                .Select(x => x.Key)
                .AsEnumerable()
                .Select(x => allMonths[x - 1])
                .FirstOrDefault();

            var collection = _context.Patient.Include(a => a.Records).Select(a =>
                     new
                     {
                         a.Id,
                         a.Name,
                         Age = GetAge(a.DateOfBirth),
                         AverageBill=AverageBill != null ? String.Format("{0:0.00}", AverageBill) : "<not available>",
                         AverageBillWithoutOutlier = AverageBillWithoutOutlier != null ? String.Format("{0:0.00}", AverageBillWithoutOutlier) : "<not available>",
                         FifthRecord,
                         Patients = similarDeseasedPatientsList,
                         MonthOfHighestVisit = MonthOfHighestVisit ?? "<not available>"
                     }).Where(a => a.Id == id);

            var result = await collection.ToListAsync();
            return new JsonResult(new { result });
        }

        private static double? GetAverageBillWithoutOutlier(IQueryable<Records> RecordsCollection, double? AverageBill, double? StdDevOfBills)
        {
            return RecordsCollection.Where(r => r.Bill > (AverageBill - 2 * StdDevOfBills) && r.Bill < (AverageBill + 2 * StdDevOfBills)).Average(r => r.Bill);
        }

        private static int GetAge(DateTime? date)
        {
            var years = DateTime.Now.Year - date.Value.Year;
            //get the date of the birthday this year
            var birthdayThisYear = date.Value.AddYears(years);
            if (birthdayThisYear > DateTime.Now) return years - 1;
            else { return years; }
        }
        public static double CalculateStdDevv( IEnumerable<double> values)
        {
            double ret = 0;
            int count = values.Count();
            if (count > 1)
            {
                //Compute the Average
                double avg = values.Average();

                //Perform the Sum of (value-avg)^2
                double sum = values.Sum(d => (d - avg) * (d - avg));

                //Put it all together
                ret = Math.Sqrt(sum / count);
            }
            return ret;
        }


        // PUT: api/Patients/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, Patient patient)
        {
            if (id != patient.Id)
            {
                if (patient == null) return BadRequest();
                patient.Id = id;
            }
            var oldEntity = _context.Patient.FirstOrDefault(x => x.Id == id);
            if (oldEntity == null) return NotFound();
            oldEntity.Name = patient.Name;
            oldEntity.OfficialId = patient.OfficialId;
            oldEntity.Email = patient.Email;
            oldEntity.DateOfBirth = patient.DateOfBirth;

            _context.Entry(oldEntity).State = EntityState.Modified;
            foreach (MetaData metaData in patient.MetaData)
            {
                var oldMetaData= _context.MetaData.FirstOrDefault(x => x.Id == metaData.Id);
                if (oldMetaData == null)
                {
                    var newMetaData = new MetaData
                    {
                        PatientId = id,
                        Key = metaData.Key,
                        Value = metaData.Value
                    };
                    _context.MetaData.Add(newMetaData);
                }
                else
                {
                    oldMetaData.Key = metaData.Key;
                    oldMetaData.Value = metaData.Value;
                    _context.Entry(oldMetaData).State = EntityState.Modified;
                }
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                if (!PatientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return new JsonResult(new { Success = false, Error = ex.Message });
                }
            }

            return new JsonResult(new { Success = true });

        }

        // POST: api/Patients
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient( [FromBody] Patient patient)
        {
            var newPatient = new Patient
            {
                Name = patient.Name,
                DateOfBirth = patient.DateOfBirth,
                Email = patient.Email,
                OfficialId = patient.OfficialId
            };
            
            _context.Patient.Add(newPatient);
           

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (PatientExists(patient.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            foreach (MetaData metaData in patient.MetaData)
            {
                var newMetaData = new MetaData
                {
                    PatientId = newPatient.Id,
                    Key = metaData.Key,
                    Value = metaData.Value,
                };
                _context.MetaData.Add(newMetaData);
            }
            try
            {
                await _context.SaveChangesAsync();
            }

            catch (DbUpdateException)
            {
                if (PatientExists(patient.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return new JsonResult(newPatient);
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Patient>> DeletePatient(int id)
        {
            var patient = await _context.Patient.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patient.Remove(patient);
            await _context.SaveChangesAsync();

            return patient;
        }

        private bool PatientExists(int id)
        {
            return _context.Patient.Any(e => e.Id == id);
        }
    }
}

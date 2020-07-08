using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cepres.Models
{
    public partial class Records
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Disease { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string Description { get; set; }
        public double? Bill { get; set; }
    }
}

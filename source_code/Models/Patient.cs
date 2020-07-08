using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cepres.Models
{
    public partial class Patient
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public int OfficialId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; }
        // public IEnumerable<Records> Records { get; set; }
        public ICollection<Records> Records { get; set; }
        public ICollection<MetaData> MetaData { get; set; }

    }
}

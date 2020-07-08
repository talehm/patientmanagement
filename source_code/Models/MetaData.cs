using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace cepres.Models
{
   
    public partial class MetaData
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
    }
}

using Lekarzowo.DataAccessLayer;
using System;
using System.Collections.Generic;

namespace Lekarzowo.Models
{
    public partial class Referral
    {
        public decimal Id { get; set; }
        public DateTime Dateofissue { get; set; }
        public string Description { get; set; }
        public decimal PatientId { get; set; }
        public decimal TreatmentId { get; set; }
        public decimal DoctorId { get; set; }

        public virtual Doctor Doctor { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Treatment Treatment { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer
{
    public class Slot
    {
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public decimal DoctorId { get; set; }
        public decimal LocalId { get; set; }

        public Slot(
            DateTime start, 
            DateTime end)
        {
            Start = start;
            End = end;
        }
    }
}

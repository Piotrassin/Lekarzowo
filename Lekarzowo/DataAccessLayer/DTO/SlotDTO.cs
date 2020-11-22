using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class SlotDTO
    {

        public decimal DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string DoctorLastname { get; set; }
        public string DoctorSpecialization { get; set; }
        public decimal DoctorBasePrice { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string LocalName { get; set; }


        public SlotDTO(DateTime start, DateTime end)
        {
            Start = start;
            End = end;
        }

        public SlotDTO(int docId, string docName, string docLname, string docSpec,
            decimal docPrice, DateTime start, DateTime end, string locName)
        {
            DoctorId = docId;
            DoctorName = docName;
            DoctorLastname = docLname;
            DoctorSpecialization = docSpec;
            DoctorBasePrice = docPrice;
            Start = start;
            End = end;
            LocalName = locName;
        }

    }
}

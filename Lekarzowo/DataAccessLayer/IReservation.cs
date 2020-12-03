using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.DTO
{
    public interface IReservation : IEntity
    {
    decimal Id { get; set; }
    decimal DoctorId { get; set; }
    decimal PatientId { get; set; }
    DateTime Starttime { get; set; }
    DateTime Endtime { get; set; }
    decimal? Canceled { get; set; }
    }
}

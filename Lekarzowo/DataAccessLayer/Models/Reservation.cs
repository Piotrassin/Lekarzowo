﻿using System;
using System.Collections.Generic;
using Lekarzowo.DataAccessLayer.DTO;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Reservation : IEntity, IReservation
    {
        public decimal Id { get; set; }
        public decimal DoctorId { get; set; }
        public decimal PatientId { get; set; }
        public DateTime Starttime { get; set; }
        public DateTime Endtime { get; set; }
        public bool Canceled { get; set; }
        public decimal RoomId { get; set; }

        public virtual Doctor Doctor { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Room Room { get; set; }
        public virtual Visit Visit { get; set; }
    }
}

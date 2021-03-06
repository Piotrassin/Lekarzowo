﻿using System;
using System.Collections.Generic;

namespace Lekarzowo.DataAccessLayer.Models
{
    public partial class Workinghours : IEntity
    {
        public decimal Id { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public decimal DoctorId { get; set; }
        public decimal LocalId { get; set; }

        public virtual Doctor Doctor { get; set; }
        public virtual Local Local { get; set; }
    }
}

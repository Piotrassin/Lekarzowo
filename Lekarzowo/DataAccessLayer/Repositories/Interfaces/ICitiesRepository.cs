﻿using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface ICitiesRepository : IBaseRepository<City>
    {
        bool Exists(City city);
    }
}
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public interface ICustomUserRolesService
    {
        Task<List<String>> GatherAllUserRoles(decimal personId);
    }
}

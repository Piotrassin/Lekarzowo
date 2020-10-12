﻿using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class LocalsRepository : BaseRepository<Local>, ILocalsRepository
    {
        private readonly ModelContext _context;
        public LocalsRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }


            /// <summary>
            /// TODO: Nie działa nie wiedzieć czemu
            /// </summary>
            /// <param name="local"></param>
            /// <returns></returns>
        public bool Exists(Local local)
        {
            return _context.Local.Any(x => x.Postcode == local.Postcode);
            //return _context.Local.Any(x => x.Postcode == "00-902");
        }
    }
}

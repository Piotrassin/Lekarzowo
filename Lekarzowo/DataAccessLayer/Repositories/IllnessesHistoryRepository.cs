﻿using Lekarzowo.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class IllnessesHistoryRepository : BaseRepository<Illnesshistory>, IIllnessesHistoryRepository
    {
        private readonly ModelContext _context;

        public IllnessesHistoryRepository(ModelContext context) : base(context)
        {
            this._context = context;
        }

        public bool Exists(Illnesshistory t)
        {
            throw new NotImplementedException();
        }
    }
}

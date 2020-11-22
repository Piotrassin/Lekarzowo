﻿using Lekarzowo.DataAccessLayer;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Services
{
    public class PaginationService<T> where T : class
    {
        private static readonly int defaultLimit = 15;
        private static readonly int defaultSkip = 0;


        public static IOrderedQueryable<object> SplitAndLimitQueryable(int? skip, int? limit, IOrderedQueryable<object> query)
        {
            query = skip.HasValue ? (IOrderedQueryable<object>)query.Skip(skip.Value) : (IOrderedQueryable<object>)query.Skip(defaultSkip);
            query = limit.HasValue ? (IOrderedQueryable<object>)query.Take(limit.Value) : (IOrderedQueryable<object>)query.Take(defaultLimit);
            return query;
        }

        public static IEnumerable<T> SplitAndLimitIEnumerable(int? skip, int? limit, IEnumerable<T> collection)
        {
            collection = skip.HasValue ? collection.Skip(skip.Value) : collection.Skip(defaultSkip);
            collection = limit.HasValue ? collection.Take(limit.Value) : collection.Take(defaultLimit);
            return collection;
        }
    }
}

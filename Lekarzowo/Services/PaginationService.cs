using System.Collections.Generic;
using System.Linq;

namespace Lekarzowo.Services
{
    public class PaginationService<T> where T : class
    {
        //private static readonly int defaultLimit = Int32.MaxValue;
        //private static readonly int defaultSkip = 0;


        public static IOrderedQueryable<object> SplitAndLimitQueryable(int? skip, int? limit, IOrderedQueryable<object> query)
        {
            query = skip.HasValue ? (IOrderedQueryable<object>)query.Skip(skip.Value) : query;
            query = limit.HasValue ? (IOrderedQueryable<object>)query.Take(limit.Value) : query;
            return query;
        }

        public static IEnumerable<T> SplitAndLimitIEnumerable(int? skip, int? limit, IEnumerable<T> collection)
        {
            collection = skip.HasValue ? collection.Skip(skip.Value) : collection;
            collection = limit.HasValue ? collection.Take(limit.Value) : collection;
            return collection;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer
{
    public interface INamedEntity
    {
        string Name { get; set; }
    }
}

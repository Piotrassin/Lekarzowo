using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public interface IMedicinesRepository : IBaseNameRepository<Medicine>
    {
        bool Exists(Medicine t);
    }
}

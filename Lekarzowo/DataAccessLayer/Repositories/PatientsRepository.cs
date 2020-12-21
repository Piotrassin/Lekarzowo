using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.DataAccessLayer.Repositories
{
    public class PatientsRepository : BaseIdRepository<Patient>, IPatientsRepository
    {
        public PatientsRepository(ModelContext context) : base(context) { }
    }
}

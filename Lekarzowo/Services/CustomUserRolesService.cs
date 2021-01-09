using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lekarzowo.DataAccessLayer.Repositories;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Services
{
    public class CustomUserRolesService : ICustomUserRolesService
    {
        private readonly IStandardUserRolesRepository _repository;
        private readonly IDoctorsRepository _doctorsRepository;
        private readonly IPatientsRepository _patientsRepository;
        public static readonly string PatientRoleName = "patient";
        public static readonly string DoctorRoleName = "doctor";

        public CustomUserRolesService(IStandardUserRolesRepository repository, IDoctorsRepository doctorsRepository, IPatientsRepository patRepo)
        {
            _repository = repository;
            _doctorsRepository = doctorsRepository;
            _patientsRepository = patRepo;
        }

        private async Task<bool> IsADoctor(decimal personId)
        {
            return _doctorsRepository.Exists(personId);
        }

        private async Task<bool> IsAPatient(decimal personId)
        {
            return _patientsRepository.Exists(personId);
        }

        public async Task<List<String>> GatherAllUserRoles(decimal personId)
        {
            var roles = new List<String>();
            if (await IsAPatient(personId))
            {
                roles.Add(PatientRoleName);
            }
            if (await IsADoctor(personId))
            {
                roles.Add(DoctorRoleName);
            }

            roles.AddRange(_repository.GetAll(personId).Select(x => x.Role.Name));

            return roles;
        }
    }
}

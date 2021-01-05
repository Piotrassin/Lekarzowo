using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using Lekarzowo.Repositories;

namespace Lekarzowo.Validators
{
    public class UserRoleValidator : AbstractValidator<Userroles>
    {
        public UserRoleValidator(IPeopleRepository peopleRepository, IRolesRepository rolesRepository)
        {
            RuleFor(x => x.PersonId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Person>(peopleRepository, "Osoba nie istnieje."));

            RuleFor(x => x.RoleId)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .SetValidator(new BaseIdValidator<Role>(rolesRepository, "Rola nie istnieje."));
        }
    }
}

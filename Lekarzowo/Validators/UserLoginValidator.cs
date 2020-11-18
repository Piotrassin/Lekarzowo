using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class UserLoginValidator : AbstractValidator<UserLoginDTO>
    {
        private readonly PasswordValidator validator;
        public UserLoginValidator(IPeopleRepository peopleRepository) 
        {
            validator = new PasswordValidator(peopleRepository);

            RuleFor(x => x.Email)
               .Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Email")
               .EmailAddress().WithMessage("{PropertyName} jest niepoprawny");

            RuleFor(x => x.Password.Value)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Hasło")
                .Length(11, Int16.MaxValue).WithMessage("Długość musi wynosić co najmniej {MinLength} znaków. Wpisano {TotalLength}")
                .Must(BeEqualToAPwdInDB).WithMessage("{PropertyName} lub adres email są niepoprawne");
        }

        bool BeEqualToAPwdInDB(UserLoginDTO user, string pwd)
        {
            return validator.BeEqualToAPasswordInDatabase(user.Email, user.Password.Value);
        }
    }
}

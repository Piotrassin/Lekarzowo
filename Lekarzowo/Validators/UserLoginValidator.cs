using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class UserLoginValidator : AbstractValidator<UserLoginDTO>
    {
        public UserLoginValidator() 
        {
            RuleFor(x => x.Email)
               .Cascade(CascadeMode.Stop)
               .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Email")
               .EmailAddress().WithMessage("{PropertyName} jest niepoprawny");

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Hasło")
                .Length(11, Int16.MaxValue).WithMessage("Długość musi wynosić co najmniej {MinLength} znaków. Wpisano {TotalLength}");
        }
    }
}

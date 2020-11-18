using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class PersonValidator : AbstractValidator<Person>
    {
        public PersonValidator(IPeopleRepository repo)
        {
            var validator = new UserRegistrationValidator(repo);
            
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Imię")
                .Length(2, 63).WithMessage("Długość musi wynosić od {MinLength} do {MaxLength} znaków. Wpisano {TotalLength}")
                .Must(validator.BeAValidWord).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Lastname)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Nazwisko")
                .Length(2, 127).WithMessage("Długość musi wynosić od {MinLength} do {MaxLength} znaków. Wpisano {TotalLength}")
                .Must(validator.BeAValidWord).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Email")
                .EmailAddress().WithMessage("{PropertyName} jest niepoprawny");

            RuleFor(x => x.Birthdate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Data urodzenia")
                .Must(validator.BeAValidBirthday).WithMessage("{PropertyName}" + String.Format(" nie może być w przyszłości, ani być dawniej niż {0} lat temu", validator.MaxAgeValue));

            RuleFor(x => x.Pesel)
                .Cascade(CascadeMode.Stop)
                .Length(11).WithMessage("Długość musi wynosić {MinLength} cyfr. Wpisano {TotalLength}").WithName("PESEL")
                .Must(validator.BeAValidNumber).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Gender)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Płeć")
                .Length(1).WithMessage("{PropertyName} musi zawierać jeden znak")
                .Must(x => x.All(char.IsLetter)).WithMessage("{PropertyName} musi się składać z litery");
        }
    }
}

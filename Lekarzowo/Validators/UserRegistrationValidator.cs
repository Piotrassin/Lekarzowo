using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class UserRegistrationValidator : AbstractValidator<UserRegistrationDTO>
    {
        public readonly int MaxAgeValue = 150;
        public UserRegistrationValidator()
        {

            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Imię")
                .Length(2, 63).WithMessage("Długość musi wynosić od {MinLength} do {MaxLength} znaków. Wpisano {TotalLength}")
                .Must(BeAValidWord).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Lastname)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Nazwisko")
                .Length(2, 127).WithMessage("Długość musi wynosić od {MinLength} do {MaxLength} znaków. Wpisano {TotalLength}")
                .Must(BeAValidWord).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Email")
                .EmailAddress().WithMessage("{PropertyName} jest niepoprawny");

            RuleFor(x => x.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Hasło")
                .Length(11, Int16.MaxValue).WithMessage("Długość musi wynosić co najmniej {MinLength} znaków. Wpisano {TotalLength}")
                .Must(BeAValidPassword).WithMessage("{PropertyName} musi zawierać co najmniej 1 małą literę, 1 dużą literę i 1 cyfrę");

            RuleFor(x => x.Birthdate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Data urodzenia")
                .Must(BeAValidBirthday).WithMessage("{PropertyName}" + String.Format(" nie może być w przyszłości, ani być dawniej niż {0} lat temu", MaxAgeValue));

            RuleFor(x => x.Pesel)
                .Cascade(CascadeMode.Stop)
                .Length(11).WithMessage("Długość musi wynosić {MinLength} cyfr. Wpisano {TotalLength}").WithName("PESEL")
                .Must(BeAValidNumber).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x.Gender)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Płeć")
                .Length(1).WithMessage("{PropertyName} musi zawierać jeden znak")
                .Must(x => x.All(char.IsLetter)).WithMessage("{PropertyName} musi się składać z litery");
        }

        public bool BeAValidWord(string text)
        {
            text = text.Trim();
            text = text.Replace("-", "");
            text = text.Replace(".", "");
            text = text.Replace(",", "");
            text = text.Replace("'", "");
            return text.All(char.IsLetter);
        }

        public bool BeAValidPassword(string text)
        {
            Regex rx = new Regex(@"^.*(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$");

            return rx.IsMatch(text);
        }

        public bool BeAValidBirthday(DateTime date)
        {
            if(date <= DateTime.Now && date.Year >= (DateTime.Now.Year - MaxAgeValue))
            {
                return true;
            }
            return false;
        }

        public bool BeAValidNumber(string text)
        {
            return text.All(char.IsDigit);
        }
    }
}

﻿using FluentValidation;
using Lekarzowo.DataAccessLayer;
using System;
using System.Linq;

namespace Lekarzowo.Validators.UserValidators
{
    public class BasePersonValidator : AbstractValidator<IPerson>
    {
        public readonly int MaxAgeValue = 150;
        public BasePersonValidator()
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

            RuleFor(x => x.Birthdate)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Data urodzenia")
                .Must(BeAValidBirthday).WithMessage("{PropertyName}" + String.Format(" nie może być w przyszłości, ani być dawniej niż {0} lat temu", MaxAgeValue));

            RuleFor(x => x.Pesel)
                .Cascade(CascadeMode.Stop)
                .Length(11).WithMessage("Długość musi wynosić {MinLength} cyfr. Wpisano {TotalLength}").WithName("PESEL")
                .Must(BeAValidNumber).WithMessage("{PropertyName} zawiera niedozwolone znaki");

            RuleFor(x => x)
                .Cascade(CascadeMode.Stop)
                .Must(x => BeAValidPESEL(x.Pesel, x.Birthdate)).WithMessage("{PropertyName} PESEL nie zgadza się z datą urodzenia")
                .When(x => x.Pesel != null);

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

        public bool BeAValidBirthday(DateTime date)
        {
            return date <= DateTime.Now && date.Year >= (DateTime.Now.Year - MaxAgeValue);
        }

        public bool BeAValidNumber(string text)
        {
            return text.All(char.IsDigit);
        }

        public bool BeAValidPESEL(string pesel, DateTime bday)
        {
            var yearPesel = Int16.Parse(pesel.Substring(0, 2));
            var monthPesel = Int16.Parse(pesel.Substring(2, 2));
            var dayPesel = Int16.Parse(pesel.Substring(4, 2));

            if (bday.Year.ToString().EndsWith(yearPesel.ToString()) 
                && monthPesel == bday.Month 
                && dayPesel == bday.Day)
            {
                return true;
            }

            return false;
        }
    }
}

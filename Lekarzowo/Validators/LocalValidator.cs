using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class LocalValidator : AbstractValidator<Local>
    {
        public LocalValidator(ICitiesRepository cityRepo)
        {
            RuleFor(x => x.CityId)
                .SetValidator(new BaseIdValidator<City>(cityRepo, "Miasto nie istnieje."));

            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.Streetname)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");

            RuleFor(x => x.Postcode)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(BeAValidPostCode).WithMessage("Niepoprawny kod pocztowy.");

            RuleFor(x => x.Streetnumber)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .Must(x => x > 0).WithMessage("Niepoprawny numer ulicy.");

            RuleFor(x => x.Blocknumber)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(15).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }

        protected bool BeAValidPostCode(string postcode)
        {
            Regex rx = new Regex(@"^\d{2}[-]\d{3}$");
            return rx.IsMatch(postcode);
        }
    }
}

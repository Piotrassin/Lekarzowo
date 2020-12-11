using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Validators
{
    public class IllnessValidator : AbstractValidator<Illness>
    {
        public IllnessValidator()
        {
            RuleFor(x => x.Name)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Pole nie może być puste.")
                .MaximumLength(127).WithMessage("Maksymalna długość wynosi {MaxLength} znaków, wpisano {TotalLength}.");
        }
    }
}

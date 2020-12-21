using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using System;
using System.Text.RegularExpressions;

namespace Lekarzowo.Validators
{
    public class PasswordValidator : AbstractValidator<PasswordDTO>
    {
        protected readonly IPeopleRepository repo;
        public PasswordValidator(IPeopleRepository peopleRepository)
        {
            repo = peopleRepository;
            
            RuleFor(x => x.Value)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("Hasło")
                .Length(11, Int16.MaxValue).WithMessage("Długość musi wynosić co najmniej {MinLength} znaków. Wpisano {TotalLength}")
                .Must(BeAValidPassword).WithMessage("{PropertyName} musi zawierać co najmniej 1 małą literę, 1 dużą literę i 1 cyfrę");
        }

        public bool BeAValidPassword(string text)
        {
            Regex rx = new Regex(@"^.*(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$");
            return rx.IsMatch(text);
        }

        public bool BeEqualToAPasswordInDatabase(string email, string pwd)
        {
            var user = repo.GetByEmail(email);
            return user != null && AuthService.VerifyPassword(pwd, user.Password);
        }
    }
}

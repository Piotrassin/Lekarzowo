﻿using FluentValidation;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class UserChangePasswordValidator : AbstractValidator<UserChangePasswordDTO>
    {
        private readonly PasswordValidator pwdValidator;
        public UserChangePasswordValidator(IPeopleRepository peopleRepository)
        {
            pwdValidator = new PasswordValidator(peopleRepository);

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("To pol");

            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("{PropertyName} musi mieć wartość").WithName("To pole");

            RuleFor(x => x.NewPassword)
                .SetValidator(pwdValidator);

            RuleFor(x => x.ConfirmPassword)
                .SetValidator(pwdValidator);

            RuleFor(x => x.ConfirmPassword.Value)
                .Equal(x => x.NewPassword.Value).WithMessage("Hasła muszą być identyczne");
        }

        bool BeEqualToAPwdInDb(UserChangePasswordDTO user, PasswordDTO pwd)
        {
            return pwdValidator.BeEqualToAPasswordInDatabase(user.Email, user.CurrentPassword.Value);
        }
    }
}
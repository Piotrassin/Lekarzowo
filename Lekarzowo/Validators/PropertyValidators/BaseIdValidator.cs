using FluentValidation;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation.Validators;

namespace Lekarzowo.Validators
{
    public class BaseIdValidator<T> : PropertyValidator where T : class, IEntity
    {
        private readonly IBaseRepository<T> _repository;

        public BaseIdValidator(IBaseRepository<T> repo, string errorMessage) : base(errorMessage)
        {
            _repository = repo;
        }

        protected override bool IsValid(PropertyValidatorContext context)
        {
            decimal value = (decimal) context.PropertyValue;
            return _repository.Exists(value);
        }
    }
}

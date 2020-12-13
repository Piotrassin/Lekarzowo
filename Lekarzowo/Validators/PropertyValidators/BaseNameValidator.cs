using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation.Resources;
using FluentValidation.Validators;
using Lekarzowo.DataAccessLayer;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators.PropertyValidators
{
    public class BaseNameValidator<T> : PropertyValidator where T : class, INamedEntity
    {
        private readonly IBaseNameRepository<T> _repository;

        public BaseNameValidator(IBaseNameRepository<T> repo, string errorMessage) : base(errorMessage)
        {
            _repository = repo;
        }

        protected override bool IsValid(PropertyValidatorContext context)
        {
            string name = (string) context.PropertyValue;
            return _repository.Exists(name);
        }

    }
}

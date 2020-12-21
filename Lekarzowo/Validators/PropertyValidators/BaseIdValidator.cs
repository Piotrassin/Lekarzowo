using FluentValidation.Validators;
using Lekarzowo.DataAccessLayer;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;

namespace Lekarzowo.Validators
{
    public class BaseIdValidator<T> : PropertyValidator where T : class, IEntity
    {
        private readonly IBaseIdRepository<T> _repository;

        public BaseIdValidator(IBaseIdRepository<T> repo, string errorMessage) : base(errorMessage)
        {
            _repository = repo;
        }

        protected override bool IsValid(PropertyValidatorContext context)
        {
            decimal value = (decimal) context.PropertyValue;
            return _repository.Exists(value);
        }

        public bool NotExist(decimal id)
        {
            return !_repository.Exists(id);
        }
    }
}

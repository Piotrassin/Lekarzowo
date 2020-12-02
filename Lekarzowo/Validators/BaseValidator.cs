using FluentValidation;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Validators
{
    public class BaseValidator<T> : AbstractValidator<T> where T : class, IEntity
    {
        protected static int chunkSizeMinutes = ReservationsController.chunkSizeMinutes;
        private readonly IBaseRepository<T> _repository;

        /// <summary>
        /// TODO: Stworzyć generyczny BaseValidator<T>, do którego można przekazać {PropertyName} z zewnątrz
        /// i wywoływać wyłącznie jego konstruktor i wyświetlać dynamiczną informację o waldiacji.
        /// </summary>
        /// <param name="repo"></param>
        public BaseValidator(IBaseRepository<T> repo)
        {
            _repository = repo;
            //RuleFor(x => x.Id)
            //    .NotNull().WithMessage("Pole nie może być puste.")
            //    .Must(BeAValidId).WithMessage("Podany {PropertyName} nie istnieje.");
        }

        public bool BeAValidId(decimal Id)
        {
            return _repository.Exists(Id);
        }
    }
}

﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using System;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Repositories.Interfaces;
using System.Transactions;
using Lekarzowo.DataAccessLayer.Models;

namespace Lekarzowo.Controllers
{
    //[Authorize] //wystarczy to odkomentować żeby na wszystkie końcówki z tego kontrolera, była potrzebna autoryzacja, chyba że końcówka jest oznaczona jako [AllowAnonymous].
    [Route("api/[controller]")]
    [ApiController]
    public class PeopleController : BaseController
    {
        private readonly IPeopleRepository _repository;
        private readonly IJWTService _jwtService;
        private readonly IPatientsRepository _patRepository;
        public PeopleController(IPeopleRepository repository, IJWTService jwtService, IPatientsRepository patRepository)
        {
            _jwtService = jwtService;
            _repository = repository;
            _patRepository = patRepository;
        }


        // GET: api/People
        [HttpGet("[action]")]
        public ActionResult<IEnumerable<Person>> All()
        {
            return Ok(_repository.GetAll());
        }

        // GET: api/People/AllByName?Name=abc&limit=0&skip=0
        [HttpGet("[action]")]
        public async Task<ActionResult<IEnumerable<Person>>> AllByName(string name, int? limit, int? skip)
        {
            return Ok(await _repository.GetAllByNameOrLastname(name, limit, skip));
        }

        // GET: api/People/5
        [HttpGet("[action]")]
        public ActionResult<Person> Single()
        {
            var id = GetUserIdFromToken();
            var person =  _repository.GetByID(id);

            if (person == null)
            {
                return NotFound();
            }
            return person;
        }

        //POST: api/People
        [AllowAnonymous]
        [HttpPost]
        public ActionResult RegisterUser(UserRegistrationDTO newPerson)
        {
            if (ModelState.IsValid)
            {
                newPerson.Password.Value = AuthService.CreateHash(newPerson.Password.Value);

                if (_repository.Exists(newPerson.Email))
                {
                    return Conflict("User with that email address already exists");
                    //return StatusCode(409, "User with that email address already exists");
                }
                using(var transaction = new TransactionScope())
                {
                    _repository.Insert(newPerson);
                    _repository.Save();

                    Person user = _repository.GetByEmail(newPerson.Email);
                    Patient newPatient = new Patient() { Id = user.Id, IdNavigation = user };

                    _patRepository.Insert(newPatient);
                    _repository.Save();

                    transaction.Complete();
                }
                //return CreatedAtAction("GetPerson", new { id = person.Id }, person);
                return Created("", null);
            }
            return BadRequest();
            
        }

        //POST: api/People/Login
        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult<Person> LoginUser(UserLoginDTO current)
        {
            try
            {
                Person stored = _repository.GetByEmail(current.Email);
                //if (stored == null || !AuthService.VerifyPassword(current.Password.Value, stored.Password))
                //{
                //    return NotFound();
                //}
                var token = _jwtService.GenerateAccessToken(stored);

                return Accepted(new
                {
                    Id = stored.Id,
                    FirstName = stored.Name,
                    LastName = stored.Lastname,
                    Email = stored.Email,
                    Token = token
                });
            }
            catch (Exception e)
            {
                //throw;
                return Conflict(e.Message);
            }
        }

        //POST: api/People/ChangePassword
        [HttpPost("[action]")]
        public ActionResult<Person> ChangePassword(UserChangePasswordDTO current)
        {
            var id = GetUserIdFromToken();
            current.NewPassword.Value = AuthService.CreateHash(current.NewPassword.Value);
            var userById = _repository.GetByID(id);
            var userByEmail = _repository.GetByEmail(current.Email);
            if (userById == userByEmail)
            {
                userByEmail.Password = current.NewPassword.Value;
                try
                {
                    _repository.Save();
                    return Ok("Hasło zmienione");
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return StatusCode(503, e.Message);
                }
            }
            return BadRequest();

        }

        // PUT: api/People/5
        [HttpPut("{id}")]
        public ActionResult PutPerson(decimal id, Person edited)
        {
            if (ModelState.IsValid)
            {
                if (id == edited.Id && _repository.Exists(edited.Id))
                {
                    var userToEdit = _repository.GetByID(edited.Id);
                    userToEdit.Name = edited.Name;
                    userToEdit.Lastname = edited.Lastname;
                    userToEdit.Pesel = edited.Pesel;
                    userToEdit.Email = edited.Email.ToLower();
                    userToEdit.Birthdate = edited.Birthdate;
                    userToEdit.Gender = edited.Gender;

                    _repository.Update(userToEdit);
                    try
                    {
                        _repository.Save();
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        return StatusCode(503, e.Message);
                    }
                    return Ok();
                }
            }
            return BadRequest();
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public  ActionResult<Person> DeletePerson(decimal id)
        {
            var person = _repository.GetByID(id);
            if (person == null)
            {
                return NotFound();
            }
            _repository.Delete(person);
            _repository.Save();

            return person;
        }


    }
}

using Autofac.Extras.Moq;
using Lekarzowo.Controllers;
using Lekarzowo.DataAccessLayer.DTO;
using Lekarzowo.DataAccessLayer.Models;
using Lekarzowo.Models;
using Lekarzowo.Repositories;
using Lekarzowo.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Lekarzowo.Tests
{
    public class PeopleControllerTests
    {
        [Fact]
        public void GetAll_Valid()
        {
            using (var mock = AutoMock.GetLoose())
            {
                //Arrange
                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetAll())
                    .Returns(GetSamplePeople());

                IEnumerable<Person> expected = GetSamplePeople();

                //Act
                PeopleController PeopleCtrl = mock.Create<PeopleController>();
                IEnumerable<Person> actual = PeopleCtrl.All().Value;

                //Assert
                Assert.True(actual != null);
                Assert.True(actual.Count() == expected.Count());
                for (int i = 0; i < expected.Count(); i++)
                {
                    Assert.True(expected.ElementAt(i).Name == actual.ElementAt(i).Name);
                    Assert.True(expected.ElementAt(i).Email == actual.ElementAt(i).Email);
                }
            }
        }

        [Theory]
        [InlineData(43, "test")]
        [InlineData(46, "test2")]
        [InlineData(61, "test3")]
        public void GetPerson_Valid(int id, string password)
        {
            using (var mock = AutoMock.GetLoose())
            {
                //Arrange
                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetByID(id))
                    .Returns(GetSamplePeople().FirstOrDefault(x => x.Id == id));

                //Act
                PeopleController PeopleCtrl = mock.Create<PeopleController>();
                Person actual = PeopleCtrl.GetPerson(id).Value;

                //Assert
                Assert.True(actual != null);
                Assert.True(!String.IsNullOrEmpty(actual.Password));
                Assert.True(AuthService.VerifyPassword(password, actual.Password));
            }
        }

        [Theory]
        [InlineData(4000)]
        [InlineData(-1)]
        [InlineData(null)]
        [InlineData(1.5)]
        public void GetPerson_Wrong(int id)
        {
            using (var mock = AutoMock.GetLoose())
            {
                //Arrange
                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetByID(id))
                    .Returns(GetSamplePeople().FirstOrDefault(x => x.Id == id));

                //Act
                PeopleController PeopleCtrl = mock.Create<PeopleController>();
                var actual = PeopleCtrl.GetPerson(id).Result;

                //Assert
                Assert.IsType<NotFoundResult>(actual);
            }
        }

        // <summary>
        // TODO: TESTY DO POZOSTAŁYCH METOD
        // </summary>
        // <returns></returns>
        
        [Theory]
        [InlineData("test4", "testowy", "1981-1-1", "abc@mail.mail", "test4", "F", "80101012345")]
        public void RegisterUser_Valid(string name, string lastname, DateTime bday, string email, string pwd, string gender, string pesel)
        {
            using (var mock = AutoMock.GetLoose())
            {
                //Arrange
                PersonRegistrationDTO person = new PersonRegistrationDTO  //hasło test
                {
                    Name = name,
                    Lastname = lastname,
                    Birthdate = bday,
                    Pesel = pesel,
                    Gender = gender,
                    Email = email,
                    Password = new PasswordDTO()
                    {
                        Value = pwd
                    }
                };

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetByEmail(person.Email))
                    .Returns(GetSamplePeople().FirstOrDefault(x => x.Email == email));

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.Insert(person));

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.Save());

                //Act
                PeopleController PeopleCtrl = mock.Create<PeopleController>();
                var actual = PeopleCtrl.RegisterUser(person);

                //Assert
                mock.Mock<IPeopleRepository>().Verify(x => x.Insert(person), Times.Exactly(1));
                mock.Mock<IPeopleRepository>().Verify(x => x.Save(), Times.Exactly(1));
                Assert.IsType<CreatedResult>(actual);
            }
        }

        [Theory]
        [InlineData("test4", "testowy", "1981-1-1", "test@work.pl", "test4", "F", "80101012345")]
        public void RegisterUser_Wrong(string name, string lastname, DateTime bday, string email, string pwd, string gender, string pesel)
        {
            using (var mock = AutoMock.GetLoose())
            {
                //Arrange
                PersonRegistrationDTO person = new PersonRegistrationDTO  //hasło test
                {
                    Name = name,
                    Lastname = lastname,
                    Birthdate = bday,
                    Pesel = pesel,
                    Gender = gender,
                    Email = email,
                    Password = new PasswordDTO()
                    {
                        Value = pwd
                    }
                };

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetByEmail(person.Email))
                    .Returns(GetSamplePeople().FirstOrDefault(x => x.Email == email));

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.Insert(person));

                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.Save());

                //Act
                PeopleController PeopleCtrl = mock.Create<PeopleController>();
                var actual = PeopleCtrl.RegisterUser(person);

                //Assert
                mock.Mock<IPeopleRepository>().Verify(x => x.Insert(person), Times.Exactly(0));
                mock.Mock<IPeopleRepository>().Verify(x => x.Save(), Times.Exactly(0));
                Assert.IsType<ConflictObjectResult>(actual);
            }
        }

        private IEnumerable<Person> GetSamplePeople()
        {
            IEnumerable<Person> output = new List<Person>
            {
                new Person  //hasło test
                {
                    Id = 43,
                    Name = "Jerzy",
                    Lastname = "Zięba",
                    Birthdate = new DateTime(1956, 5, 2),
                    Pesel = "56050262341",
                    Gender = "M",
                    Email = "test@work.pl",
                    Password = "$2b$10$tx8ZnzY73bc30r4YS20C8.RJ99LNplm4GvpXd/9EDLaZU1aOwXc.y"
                },
                new Person  //hasło test2
                {
                    Id = 46,
                    Name = "test2",
                    Lastname = "hashowania",
                    Birthdate = new DateTime(1977, 4, 12),
                    Pesel = "1234567890",
                    Gender = "F",
                    Email = "test@work2.pl",
                    Password = "$2b$10$hj1vEwsSxKdZh/F051EtB.3uYma40IBbiPRB0ZUcbfcIRPHQUmhva"
                },
                new Person  //hasło test3
                {
                    Id = 61,
                    Name = "Tomasz",
                    Lastname = "Hajto",
                    Birthdate = new DateTime(1980, 2, 13),
                    Pesel = "80021312345",
                    Gender = "M",
                    Email = "test@work3.pl",
                    Password = "$2b$10$.gkdgJutJMVhz.sFsqzLy.tY1k6TS07sgxHv2WZWscI2gYWoKQ8Py"
                },
            };

            return output;
        }
    }
}

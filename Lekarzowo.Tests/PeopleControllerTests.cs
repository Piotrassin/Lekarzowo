using Autofac.Extras.Moq;
using Lekarzowo.Controllers;
using Lekarzowo.Models;
using Lekarzowo.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace Lekarzowo.Tests
{
    public class PeopleControllerTests
    {
        [Fact]
        public void GetAll_ValidCall()
        {
            using (var mock = AutoMock.GetLoose())
            {
                mock.Mock<IPeopleRepository>()
                    .Setup(x => x.GetAll())
                    .Returns(GetSamplePeople());

                var PeopleCtrl = mock.Create<PeopleController>();
                IEnumerable<Person> expected =  GetSamplePeople();

                var actual = PeopleCtrl.GetPeople();

                Assert.True(actual != null);
                //for (int i = 0; i < expected.Count(); i++)
                //{
                //    Assert.True(expected. == actual[i].)
                //}
                
            }
        }

        private IEnumerable<Person> GetSamplePeople()
        {
            IEnumerable<Person> output = new List<Person>
            {
                new Person
                {
                    Name = "Adam",
                    Lastname = "Testowy",
                    Birthdate = new DateTime(1980, 2, 13),
                    Pesel = "80021312345",
                    Gender = "M",
                    Email = "a.testowy@abc.com",
                    Password = "hasło123"
                },
                new Person
                {
                    Name = "Adam1",
                    Lastname = "Testowy1",
                    Birthdate = new DateTime(1981, 6, 14),
                    Pesel = "80021312346",
                    Gender = "M",
                    Email = "a.testow1y@abc.com",
                    Password = "hasło1234"
                }
            };

            return output;
        }
    }
}

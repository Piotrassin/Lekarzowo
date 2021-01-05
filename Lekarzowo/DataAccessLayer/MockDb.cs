using Lekarzowo.DataAccessLayer.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.DataAccessLayer
{
    /// <summary>
    /// TODO: Zrobić bazę danych w pamięci dla łatwiejszej implementacji
    /// </summary>
    public class MockDb
    {

        private DbContextOptions<ModelContext> options;


        public MockDb()
        {
            options = new DbContextOptionsBuilder<ModelContext>()
           .UseInMemoryDatabase(databaseName: "LekarzowoMockDbInMemeory")
           .Options;

            Seed();
        }

        private void Seed()
        {
            //using (var context = new ModelContext(options))
            //{
            //    context.Person.Add(new Person
            //    {
            //        Name = "Adam",
            //        Lastname = "Testowy",
            //        Birthdate = new DateTime(1980, 2, 13),
            //        Pesel = "80021312345",
            //        Gender = "M",
            //        Email = "a.testowy@abc.com",
            //        Password = "hasło123"
            //    });s
            //}
        }
    }
}

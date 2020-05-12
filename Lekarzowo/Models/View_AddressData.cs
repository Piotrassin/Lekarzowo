using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lekarzowo.Models
{
    public class View_AddressData
    {
        [Column("Local_Id")]
        public int LocalId { get; private set; }

        [Column("Room_Id")]
        public int RoomId { get; private set; }

        [Column("Room_Number")]
        public int RoomNumber { get; private set; }

        [Column("City_Name")]
        public String CityName { get; private set; }

        [Column("Local_Name")]
        public String LocalName { get; private set; }

        [Column("Local_StreetName")]
        public String LocalStreetName { get; private set; }

        [Column("Local_StreetNumber")]
        public int LocalStreetNumber { get; private set; }

        [Column("Local_BlockNumber")]
        public String LocalBlockNumber { get; private set; }

        [Column("Local_Postcode")]
        public String LocalPostcode { get; private set; }

    }
}

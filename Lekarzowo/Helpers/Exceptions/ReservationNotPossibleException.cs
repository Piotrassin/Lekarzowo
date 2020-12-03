using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Lekarzowo.Helpers.Exceptions
{
    public class ReservationNotPossibleException : Exception
    {
        public ReservationNotPossibleException()
        {
        }

        public ReservationNotPossibleException(string message) : base(message)
        {
        }

        public ReservationNotPossibleException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected ReservationNotPossibleException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}

namespace Lekarzowo.DataAccessLayer.DTO
{
    public class VisitDescriptionOnlyDTO : IEntity
    {
        public decimal Id { get; set; }
        public string Description { get; set; }
    }
}

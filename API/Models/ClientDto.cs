namespace API.Models
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Address1 { get; set; } = string.Empty;
        public string Address2 { get; set; } = string.Empty;
        public string Address3 { get; set; } = string.Empty;
        public string Suburb { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PostCode { get; set; } = string.Empty;
    }
}

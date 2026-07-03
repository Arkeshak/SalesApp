using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domain.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        
        public int ClientId { get; set; }
        public Client Client { get; set; } = null!;
        
        [Required]
        public string InvoiceNo { get; set; } = string.Empty;
        
        public DateTime InvoiceDate { get; set; }
        
        public string? ReferenceNo { get; set; }
        
        public string? Note { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalExcl { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalTax { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalIncl { get; set; }
        
        public ICollection<OrderLine> Lines { get; set; } = new List<OrderLine>();
    }
}

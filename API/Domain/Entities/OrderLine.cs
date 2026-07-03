using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Domain.Entities
{
    public class OrderLine
    {
        [Key]
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;
        
        public int ItemId { get; set; }
        public Item Item { get; set; } = null!;
        
        public string? Description { get; set; }
        public string? Note { get; set; }
        
        public int Quantity { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxRate { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal ExclAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal InclAmount { get; set; }
    }
}

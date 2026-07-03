using System;
using System.Collections.Generic;

namespace API.Models
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }

        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }

        public List<OrderLineDto> Lines { get; set; } = new();
    }

    public class OrderLineDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Note { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }
        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }
}

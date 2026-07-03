using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Domain.Entities;
using API.Application.Interfaces;
using API.Infrastructure.Data;

namespace API.Infrastructure.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;

        public OrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _context.Orders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .ToListAsync();
        }

        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task UpdateAsync(Order order)
        {
            // Load existing order with its lines
            var existing = await _context.Orders
                .Include(o => o.Lines)
                .FirstOrDefaultAsync(o => o.Id == order.Id);

            if (existing == null) return;

            // Update scalar fields on the parent Order
            existing.ClientId    = order.ClientId;
            existing.InvoiceNo   = order.InvoiceNo;
            existing.InvoiceDate = order.InvoiceDate;
            existing.ReferenceNo = order.ReferenceNo;
            existing.Note        = order.Note;
            existing.TotalExcl   = order.TotalExcl;
            existing.TotalTax    = order.TotalTax;
            existing.TotalIncl   = order.TotalIncl;

            // Remove all existing lines then re-add the new ones
            _context.OrderLines.RemoveRange(existing.Lines);
            existing.Lines.Clear();

            foreach (var line in order.Lines)
            {
                line.Id      = 0; // ensure EF inserts as new
                line.OrderId = order.Id;
                existing.Lines.Add(line);
            }

            await _context.SaveChangesAsync();
        }
    }
}

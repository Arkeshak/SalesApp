using System.Collections.Generic;
using System.Threading.Tasks;
using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order?> GetByIdAsync(int id);
        Task<Order> AddAsync(Order order);
        Task UpdateAsync(Order order);
    }
}

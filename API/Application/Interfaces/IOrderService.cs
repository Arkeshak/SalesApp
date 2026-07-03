using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;

namespace API.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(OrderDto orderDto);
        Task UpdateOrderAsync(int id, OrderDto orderDto);
    }
}

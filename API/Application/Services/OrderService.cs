using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using API.Application.Interfaces;
using API.Domain.Entities;
using API.Models;

namespace API.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IItemRepository itemRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _itemRepository  = itemRepository;
            _mapper          = mapper;
        }

        public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<OrderDto>>(orders);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return null;
            return _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto> CreateOrderAsync(OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            await ResolveItemIds(order, orderDto);
            await _orderRepository.AddAsync(order);
            // Reload with navigation props for accurate DTO response
            var saved = await _orderRepository.GetByIdAsync(order.Id);
            return _mapper.Map<OrderDto>(saved!);
        }

        public async Task UpdateOrderAsync(int id, OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            order.Id = id;
            await ResolveItemIds(order, orderDto);
            await _orderRepository.UpdateAsync(order);
        }

        /// <summary>
        /// Resolves ItemId for each line from the ItemCode sent by the frontend.
        /// </summary>
        private async Task ResolveItemIds(Order order, OrderDto dto)
        {
            var allItems = await _itemRepository.GetAllAsync();
            var itemMap = new Dictionary<string, Item>();
            foreach (var item in allItems)
                itemMap[item.ItemCode] = item;

            foreach (var (line, lineDto) in System.Linq.Enumerable.Zip(order.Lines, dto.Lines))
            {
                if (lineDto.ItemId > 0)
                {
                    line.ItemId = lineDto.ItemId;
                }
                else if (!string.IsNullOrEmpty(lineDto.ItemCode) && itemMap.TryGetValue(lineDto.ItemCode, out var found))
                {
                    line.ItemId = found.Id;
                    line.Price  = found.Price;
                }
            }
        }
    }
}

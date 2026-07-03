using System.Collections.Generic;
using System.Threading.Tasks;
using API.Models;

namespace API.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
    }
}

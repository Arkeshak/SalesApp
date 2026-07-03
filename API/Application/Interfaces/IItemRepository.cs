using System.Collections.Generic;
using System.Threading.Tasks;
using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllAsync();
    }
}

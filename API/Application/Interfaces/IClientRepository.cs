using System.Collections.Generic;
using System.Threading.Tasks;
using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
    }
}

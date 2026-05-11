using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Repository
{
    public interface IInformationRepository : IGenericRepository<Information>
    {
        Task<IEnumerable<Information>> GetByTypeAsync(string type);
    }
}

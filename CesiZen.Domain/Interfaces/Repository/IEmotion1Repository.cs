using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Repository
{
    public interface IEmotion1Repository : IGenericRepository<Emotion1>
    {
        Task<IEnumerable<Emotion1>> GetAllWithEmotions2Async();
        Task<Emotion1?> GetByIdWithEmotions2Async(int id);
    }
}

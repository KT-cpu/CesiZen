using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Repository
{
    public interface IEmotion2Repository : IGenericRepository<Emotion2>
    {
        Task<IEnumerable<Emotion2>> GetByEmotion1IdAsync(int emotion1Id);
        Task<Emotion2?> GetByIdWithEmotion1Async(int id);
    }
}

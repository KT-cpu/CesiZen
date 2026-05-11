using System.Collections.Generic;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;

namespace CesiZen.Domain.Interfaces.Service
{
    public interface IEmotionService
    {
        Task<IEnumerable<Emotion1>> GetAllEmotions1Async();
        Task<Emotion1> GetEmotion1ByIdAsync(int id);
        Task<IEnumerable<Emotion2>> GetEmotions2ByEmotion1IdAsync(int emotion1Id);
        Task<Emotion2> GetEmotion2ByIdAsync(int id);

        Task<Emotion1> CreerEmotion1Async(string nom, string nomCreateur);
        Task<Emotion2> CreerEmotion2Async(string nom, string nomCreateur, int emotion1Id);
        Task SupprimerEmotion1Async(int id);
        Task SupprimerEmotion2Async(int id);
    }
}

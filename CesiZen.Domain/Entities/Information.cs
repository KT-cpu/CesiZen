using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CesiZen.Domain.Entities
{
    public class Information
    {
        public int Id { get; set; }
        public required string Titre { get; set; }
        public required string Type { get; set; }
        public required string Contenu { get; set; }
        public DateTime DateCreation { get; set; }
        public DateTime DateModification { get; set; }

    }
}

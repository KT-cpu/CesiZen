using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CesiZen.Domain.Entities;
using CesiZen.Domain.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CesiZen.Infrastructure.Data
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(
            ApplicationDbContext context,
            ILogger<DatabaseSeeder> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedAsync(string adminPassword)
        {

            await SeedUtilisateursAsync(adminPassword);
            await SeedEmotionsAsync();
            await SeedInformationsAsync();
            await SeedTrackerEntriesAsync();
        }

        // ─── Utilisateurs ────────────────────────────────────────────────────

        private async Task SeedUtilisateursAsync(string adminPassword)
        {
            var dejaSeede = await _context.Utilisateurs
                .IgnoreQueryFilters()
                .AnyAsync();

            if (dejaSeede)
            {
                _logger.LogInformation("Utilisateurs déjà présents, seed ignoré.");
                return;
            }

            if (string.IsNullOrWhiteSpace(adminPassword) || adminPassword.Length < 8)
                throw new InvalidOperationException(
                    "Seed__AdminPassword n'est pas défini ou trop court.");

            var utilisateurs = new List<Utilisateur>
            {
                // ── Administrateurs ──────────────────────────────────────────
                new Utilisateur
                {
                    Pseudo        = "admin",
                    Email         = "admin@cesizen.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        adminPassword, workFactor: 12),
                    Role          = RoleUtilisateur.Administrateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Utilisateur
                {
                    Pseudo        = "admin_sante",
                    Email         = "sante@cesizen.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        adminPassword, workFactor: 12),
                    Role          = RoleUtilisateur.Administrateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 1, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new Utilisateur
                {
                    Pseudo        = "admin_contenu",
                    Email         = "contenu@cesizen.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        adminPassword, workFactor: 12),
                    Role          = RoleUtilisateur.Administrateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 2, 1, 0, 0, 0, DateTimeKind.Utc)
                },

                new Utilisateur
                {
                    Pseudo        = "marie_dupont",
                    Email         = "marie.dupont@email.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        "User123!", workFactor: 12),
                    Role          = RoleUtilisateur.Utilisateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 2, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new Utilisateur
                {
                    Pseudo        = "thomas_martin",
                    Email         = "thomas.martin@email.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        "User123!", workFactor: 12),
                    Role          = RoleUtilisateur.Utilisateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 3, 10, 0, 0, 0, DateTimeKind.Utc)
                },
                new Utilisateur
                {
                    Pseudo        = "sophie_lambert",
                    Email         = "sophie.lambert@email.fr",
                    MotDePasseHash = BCrypt.Net.BCrypt.HashPassword(
                        "User123!", workFactor: 12),
                    Role          = RoleUtilisateur.Utilisateur,
                    EstActif      = true,
                    DateCreation  = new DateTime(2024, 4, 5, 0, 0, 0, DateTimeKind.Utc)
                },
            };

            await _context.Utilisateurs.AddRangeAsync(utilisateurs);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "6 utilisateurs créés (3 admins, 3 utilisateurs).");
        }


        private async Task SeedEmotionsAsync()
        {
            if (await _context.Emotions1.AnyAsync())
            {
                _logger.LogInformation("Émotions déjà présentes, seed ignoré.");
                return;
            }

            var emotions = new[]
            {
                new
                {
                    Nom = "Joie",
                    SousEmotions = new[]
                    {
                        "Fierté", "Contentement", "Enchantement",
                        "Excitation", "Émerveillement", "Gratitude"
                    }
                },
                new
                {
                    Nom = "Colère",
                    SousEmotions = new[]
                    {
                        "Frustration", "Irritation", "Rage",
                        "Ressentiment", "Agacement", "Hostilité"
                    }
                },
                new
                {
                    Nom = "Peur",
                    SousEmotions = new[]
                    {
                        "Inquiétude", "Anxiété", "Terreur",
                        "Appréhension", "Panique", "Crainte"
                    }
                },
                new
                {
                    Nom = "Tristesse",
                    SousEmotions = new[]
                    {
                        "Chagrin", "Mélancolie", "Abattement",
                        "Désespoir", "Solitude", "Dépression"
                    }
                },
                new
                {
                    Nom = "Surprise",
                    SousEmotions = new[]
                    {
                        "Étonnement", "Stupéfaction", "Sidération",
                        "Incrédulité", "Confusion", "Émerveillement"
                    }
                },
                new
                {
                    Nom = "Dégoût",
                    SousEmotions = new[]
                    {
                        "Répulsion", "Déplaisir", "Nausée",
                        "Dédain", "Horreur", "Dégoût profond"
                    }
                },
            };

            foreach (var e in emotions)
            {
                var emotion1 = new Emotion1
                {
                    Nom = e.Nom,
                    NomCreateur = "system",
                    DateCreation = DateTime.UtcNow,
                    Emotions2 = e.SousEmotions.Select(nom => new Emotion2
                    {
                        Nom = nom,
                        NomCreateur = "system",
                        DateCreation = DateTime.UtcNow
                    }).ToList()
                };

                await _context.Emotions1.AddAsync(emotion1);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "6 émotions de base et 36 sous-émotions créées.");
        }

        // ─── Informations ────────────────────────────────────────────────────

        private async Task SeedInformationsAsync()
        {
            if (await _context.Informations.AnyAsync())
            {
                _logger.LogInformation("Informations déjà présentes, seed ignoré.");
                return;
            }

            var informations = new List<Information>
            {
                new Information
                {
                    Titre           = "Comprendre et gérer le stress au quotidien",
                    Type            = "Stress",
                    Contenu         = @"Le stress est une réponse naturelle et universelle de notre organisme face à des situations perçues comme menaçantes ou dépassant nos capacités d'adaptation. En petites doses, il peut même être bénéfique en nous motivant à agir. Cependant, lorsqu'il devient chronique, il affecte profondément notre santé physique et mentale.

Qu'est-ce que le stress ?

Le stress est déclenché par ce que les spécialistes appellent des ""stresseurs"" : événements de vie, pression professionnelle, conflits relationnels, difficultés financières, ou même certaines pensées.

Les signes du stress chronique

Un stress persistant peut se manifester par des tensions musculaires, des troubles du sommeil, une irritabilité accrue, des maux de tête fréquents et des problèmes digestifs.

Stratégies efficaces pour gérer le stress

1. La respiration consciente : quelques minutes de respiration profonde activent le système nerveux parasympathique.
2. L'activité physique régulière : libère des endorphines et réduit les niveaux de cortisol.
3. La pleine conscience (mindfulness) : créer une distance salutaire avec les sources de stress.
4. La gestion du temps : prioriser ses tâches, apprendre à déléguer et à dire non.
5. Les connexions sociales : partager ses préoccupations avec des proches de confiance.",
                    DateCreation    = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 1, 10, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "Techniques de respiration pour se calmer",
                    Type            = "Activités de détente",
                    Contenu         = @"La respiration est l'un des rares processus physiologiques à la fois automatique et contrôlable volontairement. C'est précisément ce qui en fait un outil thérapeutique exceptionnel.

Technique 1 : La respiration 4-7-8

1. Expirez complètement par la bouche
2. Inspirez silencieusement par le nez pendant 4 secondes
3. Retenez votre souffle pendant 7 secondes
4. Expirez complètement par la bouche pendant 8 secondes

Technique 2 : La cohérence cardiaque

Inspirez pendant 5 secondes, expirez pendant 5 secondes. Pratiquez pendant 5 minutes, idéalement 3 fois par jour. C'est la règle des 3-6-5.

Technique 3 : La respiration carrée (Box Breathing)

Utilisée par les forces spéciales : inspirez 4 secondes, retenez 4 secondes, expirez 4 secondes, retenez à vide 4 secondes.

Technique 4 : La respiration abdominale

Posez une main sur votre poitrine, l'autre sur votre ventre. Inspirez en gonflant le ventre uniquement.",
                    DateCreation    = new DateTime(2024, 1, 18, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 1, 18, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "La méditation de pleine conscience",
                    Type            = "Activités de détente",
                    Contenu         = @"La pleine conscience (mindfulness) est la pratique qui consiste à porter intentionnellement son attention sur le moment présent, sans jugement. Issue des traditions bouddhistes, elle a été adaptée et validée scientifiquement par des chercheurs comme Jon Kabat-Zinn.

Les bienfaits prouvés

Des centaines d'études montrent que la pratique régulière réduit les symptômes d'anxiété et de dépression, améliore la concentration, renforce le système immunitaire et améliore la qualité du sommeil.

Pour commencer : une méditation simple

1. Installez-vous confortablement, dos droit.
2. Fermez doucement les yeux.
3. Portez attention à votre respiration.
4. Quand votre esprit vagabonde, ramenez doucement l'attention vers la respiration, sans vous juger.
5. Commencez par 5 minutes et augmentez progressivement.

Le scan corporel

Allongez-vous et portez successivement votre attention sur chaque partie de votre corps, des orteils jusqu'au sommet du crâne, en observant les sensations sans chercher à les modifier.",
                    DateCreation    = new DateTime(2024, 2, 5, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 2, 5, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "L'importance du sommeil pour la santé mentale",
                    Type            = "Sommeil",
                    Contenu         = @"Le sommeil n'est pas une simple pause dans notre vie active — c'est un processus biologique fondamental pendant lequel notre cerveau et notre corps effectuent des réparations essentielles.

Ce qui se passe pendant que vous dormez

Votre cerveau consolide les mémoires, élimine les déchets métaboliques, régule les émotions et restaure les niveaux de sérotonine et de dopamine.

Combien d'heures faut-il dormir ?

Les adultes ont besoin de 7 à 9 heures par nuit. Les jeunes adultes également. Les personnes âgées de 65 ans et plus ont besoin de 7 à 8 heures.

10 conseils pratiques pour mieux dormir

1. Horaires réguliers, même le week-end.
2. Évitez les écrans 1h avant le coucher.
3. Chambre fraîche entre 16 et 19°C.
4. Obscurité totale.
5. Limitez la caféine après 14h.
6. Évitez l'alcool le soir.
7. Activité physique régulière, mais pas trop proche du coucher.
8. Créez un rituel du soir.
9. Notez vos inquiétudes sur papier avant de dormir.
10. Réservez le lit uniquement au sommeil.",
                    DateCreation    = new DateTime(2024, 2, 20, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 2, 20, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "Comprendre ses émotions pour mieux les gérer",
                    Type            = "Émotions",
                    Contenu         = @"Les émotions sont souvent mal comprises dans notre société qui valorise davantage la rationalité. Pourtant, elles constituent des informations précieuses sur notre état intérieur et nos besoins fondamentaux.

Les émotions de base

Le psychologue Paul Ekman a identifié 6 émotions fondamentales universelles : la joie, la colère, la peur, la tristesse, la surprise et le dégoût. Chacune est un signal sur nos besoins.

Pourquoi ne faut-il pas supprimer ses émotions ?

Réprimer ses émotions ne les fait pas disparaître — elles s'accumulent et resurgiront plus intensément. Les études montrent que l'acceptation émotionnelle réduit le stress physiologique.

Comment mieux gérer ses émotions ?

1. Nommer l'émotion : ""Je ressens de la colère"" plutôt que ""Je suis en colère"".
2. Identifier le besoin sous-jacent.
3. Accueillir sans juger — toutes les émotions sont valides.
4. Exprimer de façon adaptée : écriture, art, conversation.
5. Pratiquer la régulation par la respiration et la pleine conscience.

Le journal des émotions

Tenir un journal émotionnel quotidien est l'une des pratiques les plus efficaces pour développer l'intelligence émotionnelle.",
                    DateCreation    = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 3, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "Marche en nature : l'antidépresseur naturel",
                    Type            = "Activités de détente",
                    Contenu         = @"De plus en plus d'études scientifiques confirment ce que beaucoup ressentent intuitivement : la nature est bonne pour notre santé mentale.

Ce que dit la science

20 minutes en nature suffisent à réduire significativement les niveaux de cortisol. Une heure de marche en forêt réduit l'activité dans le cortex préfrontal dorsolatéral, une région associée à la rumination.

Le concept de bain de forêt (Shinrin-yoku)

Développé au Japon dans les années 1980, il consiste à s'immerger consciemment dans l'atmosphère de la forêt : marcher lentement, engager tous ses sens, respirer profondément et éviter son téléphone pendant au moins 30 minutes.

Intégrer la nature dans votre quotidien

Même en ville : déjeunez dans un parc, choisissez des itinéraires verts, ayez des plantes chez vous, pratiquez des sports de plein air le week-end.",
                    DateCreation    = new DateTime(2024, 3, 15, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 3, 15, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "Gérer l'anxiété : stratégies pratiques",
                    Type            = "Anxiété",
                    Contenu         = @"L'anxiété touche environ 15 à 20% de la population à un moment de leur vie. Si elle peut être paralysante, de nombreuses stratégies efficaces existent.

Comprendre l'anxiété

L'anxiété est une réponse émotionnelle à une menace perçue, réelle ou imaginaire. Elle se distingue de la peur par son caractère anticipatoire. Elle devient problématique lorsqu'elle est disproportionnée et persistante.

Stratégies cognitives (TCC)

1. Identifier les pensées anxieuses en les notant sur papier.
2. Questionner leur réalité : ""Quelle est la probabilité réelle que cela arrive ?""
3. Remettre en perspective : ""Dans 5 ans, sera-ce important ?""
4. Remplacer par des pensées alternatives plus réalistes.

La technique du stop à la rumination

Quand vous vous surprenez à ruminer : dites mentalement ""STOP"", redirigez votre attention vers quelque chose de concret et pratiquez une activité engageante pendant 10-15 minutes.

Habitudes de vie anti-anxiété

Limitez la caféine et l'alcool, pratiquez une activité physique régulière, maintenez un rythme de sommeil régulier et cultivez des connexions sociales positives.",
                    DateCreation    = new DateTime(2024, 3, 22, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 3, 22, 0, 0, 0, DateTimeKind.Utc)
                },
                new Information
                {
                    Titre           = "Construire sa résilience émotionnelle",
                    Type            = "Développement personnel",
                    Contenu         = @"La résilience est la capacité à faire face aux adversités, à s'adapter aux changements difficiles et à rebondir après des épreuves. C'est une compétence que tout le monde peut développer.

Les 7 piliers de la résilience

1. La conscience de soi : connaître ses forces et ses limites.
2. La régulation émotionnelle : gérer ses réactions sans les supprimer.
3. Le sens et les valeurs : avoir un ""pourquoi"" qui donne sens aux difficultés.
4. L'optimisme réaliste : croire que les choses peuvent s'améliorer tout en restant lucide.
5. Les connexions sociales : s'appuyer sur un réseau de soutien solide.
6. La flexibilité cognitive : accepter de remettre en question ses croyances.
7. Prendre soin de soi : respecter ses besoins fondamentaux.

Comment développer sa résilience ?

Pratiquez l'auto-compassion, cultivez la gratitude (noter 3 choses positives par jour), développez une mentalité de croissance en voyant les obstacles comme des opportunités d'apprentissage, et construisez des rituels de récupération quotidiens.",
                    DateCreation    = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc),
                    DateModification = new DateTime(2024, 4, 1, 0, 0, 0, DateTimeKind.Utc)
                },
            };

            await _context.Informations.AddRangeAsync(informations);
            await _context.SaveChangesAsync();

            _logger.LogInformation("8 articles d'information créés.");
        }

        // ─── Tracker d'émotions (données de démonstration) ───────────────────

        private async Task SeedTrackerEntriesAsync()
        {
            if (await _context.TrackerEmotions.AnyAsync())
            {
                _logger.LogInformation("Entrées tracker déjà présentes, seed ignoré.");
                return;
            }

            var marie = await _context.Utilisateurs
                .FirstOrDefaultAsync(u => u.Email == "marie.dupont@email.fr");

            if (marie is null)
            {
                _logger.LogWarning("Utilisateur marie_dupont introuvable, tracker ignoré.");
                return;
            }

            var emotions2 = await _context.Emotions2.ToListAsync();

            Emotion2? FindEmotion(string nom) =>
                emotions2.FirstOrDefault(e =>
                    string.Equals(e.Nom, nom, StringComparison.OrdinalIgnoreCase));

            var sampleData = new[]
            {
                ("Gratitude",    0), ("Contentement",  2), ("Excitation",    4),
                ("Mélancolie",   6), ("Anxiété",        8), ("Frustration",  10),
                ("Fierté",      12), ("Étonnement",    14), ("Chagrin",      16),
                ("Enchantement",18), ("Inquiétude",    20), ("Irritation",   22),
                ("Gratitude",   24), ("Abattement",    26), ("Contentement", 28),
                ("Confusion",   30), ("Émerveillement",32), ("Appréhension", 34),
                ("Fierté",      36), ("Agacement",     38),
            };

            var now = new DateTime(2026, 3, 3, 0, 0, 0, DateTimeKind.Utc);
            var entries = new List<TrackerEmotion>();

            foreach (var (nomEmotion, joursAvant) in sampleData)
            {
                var emotion2 = FindEmotion(nomEmotion);
                if (emotion2 is null) continue;

                entries.Add(new TrackerEmotion
                {
                    UtilisateurId = marie.Id,
                    Emotion2Id = emotion2.Id,
                    DateSaisie = now.AddDays(-joursAvant)
                });
            }

            await _context.TrackerEmotions.AddRangeAsync(entries);
            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "{Count} entrées tracker créées pour marie_dupont.", entries.Count);
        }
    }
}

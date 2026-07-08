# CESIZen — Documentation technique

**CESIZen** est une plateforme de santé mentale grand public permettant aux utilisateurs de suivre leurs émotions et de consulter des ressources de bien-être.

Le projet est composé de trois applications autour d'une API centrale :

| Composant | Technologie | Rôle |
|---|---|---|
| **API** | .NET 9 (Clean Architecture) | Cœur métier, authentification, exposition REST |
| **Client web** | React 18 + TypeScript + Vite | Interface utilisateur et espace d'administration |
| **Client mobile** | React Native / Expo | Application mobile (iOS / Android) |

## Navigation

- [**Architecture**](architecture.md) — la structure en couches et la stack technique.
- [**Installation**](installation.md) — prérequis et mise en route en local.
- [**Déploiement**](deploiement.md) — environnements, hébergement et livraison.
- [**CI/CD**](cicd.md) — la chaîne d'intégration et de livraison continues.
- [**Sécurité**](securite.md) — les mesures de protection mises en œuvre.
- [**Tests**](tests.md) — tests automatisés et tests de charge.
- [**Maintenance**](maintenance.md) — ticketing, versions et sauvegardes.
- [**API**](api.md) — les points d'entrée exposés.

!!! info "Contexte"
    Ce projet est réalisé dans le cadre de l'évaluation du Bloc 3 (CDA) : déployer et sécuriser les applications informatiques.

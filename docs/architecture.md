# Architecture

## Vue d'ensemble

L'API suit une **architecture en couches (Clean Architecture)**, qui isole le domaine métier des détails techniques (base de données, framework web). Chaque couche ne dépend que de la couche plus interne.

| Projet | Responsabilité |
|---|---|
| `CesiZen.API` | Couche de présentation : contrôleurs REST, middlewares, configuration, sécurité |
| `CesiZen.Domain` | Cœur métier : entités, interfaces, règles. Aucune dépendance technique |
| `CesiZen.Infrastructure` | Accès aux données : EF Core, repositories, configuration de la base |
| `CesiZen.Tests` | Tests unitaires et d'intégration (xUnit) |

## Stack technique

| Domaine | Choix |
|---|---|
| Langage / framework API | C# / .NET 9 |
| ORM | Entity Framework Core |
| Base de données | PostgreSQL (hébergée sur Neon) |
| Authentification | JWT (HS256), stocké en cookie `httpOnly` côté web |
| Hachage des mots de passe | BCrypt (facteur de coût 12) |
| Client web | React 18, TypeScript, Vite, servi par nginx |
| Client mobile | React Native / Expo |
| Conteneurisation | Docker (images multi-stage, exécution non-root) |

## Séparation des clients

Le **client web** s'authentifie via un cookie `httpOnly` (le jeton n'est jamais exposé au JavaScript). Le **client mobile** utilise l'en-tête `Authorization: Bearer`. L'API accepte les deux mécanismes : le header est prioritaire, sinon le cookie est lu.

# Installation & développement

## Prérequis

À installer sur la machine de développement :

- **.NET SDK 9.0**
- **Node.js 20 LTS** ou supérieur
- **Docker** et **Docker Compose**
- **Outils EF Core CLI** :
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Récupération du projet

```bash
git clone <url-du-depot>
cd CesiZen.API
```

## Dépendances

```bash
# Backend
dotnet restore

# Front web
cd CesiZen.Web/cesizen.web.client
npm install
```

## Configuration

Les secrets (chaîne de connexion, secret JWT) ne sont **jamais versionnés**. Ils sont fournis via un fichier `.env` non suivi par Git, injecté par Docker Compose.

!!! warning "Sécurité"
    Ne jamais committer le fichier `.env` ni aucune clé. En CI/CD, les secrets sont fournis par les secrets GitHub chiffrés ; en production, par les variables d'environnement de l'hébergeur.

## Lancement en local

```bash
docker compose up --build
```

L'application est alors servie par nginx (front + proxy `/api` vers l'API), dans une configuration proche de la production.

!!! note "Swagger"
    La documentation interactive Swagger n'est disponible qu'en environnement **Development** (lancement via `dotnet run` dans `CesiZen.API`). Elle est volontairement désactivée en staging et en production.

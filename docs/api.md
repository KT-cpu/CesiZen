# API

L'API expose des points d'entrée REST. En dehors de l'environnement de développement, la documentation Swagger est désactivée.

## Authentification (`/api/Auth`)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| POST | `/register` | Public | Création d'un compte |
| POST | `/login` | Public | Connexion (pose le cookie `httpOnly`, renvoie le rôle) |
| POST | `/logout` | Authentifié | Déconnexion (efface le cookie) |

Les routes de connexion et d'inscription sont protégées par une **limitation de débit** (5 requêtes/minute/IP).

## Émotions & informations (`/api/Emotion`, `/api/Information`)

| Méthode | Accès | Description |
|---|---|---|
| GET | Public | Consultation des ressources |
| POST / PUT / DELETE | `Administrateur` | Gestion du contenu |

## Journal d'émotions (`/api/TrackerEmotion`)

Toutes les routes exigent une authentification. **Chaque utilisateur n'accède qu'à ses propres entrées** (contrôle de propriété côté service).

| Méthode | Route | Description |
|---|---|---|
| GET | `/` | Journal de l'utilisateur |
| GET | `/{id}` | Une entrée (si elle appartient à l'utilisateur) |
| POST | `/` | Ajouter une entrée |
| PUT | `/{id}` | Modifier une entrée |
| DELETE | `/{id}` | Supprimer une entrée |
| GET | `/rapport` | Statistiques sur une période |

## Utilisateurs (`/api/Utilisateur`)

Routes authentifiées ; la gestion des utilisateurs est réservée au rôle `Administrateur`. La route `/me` renvoie l'utilisateur courant (utilisée pour restaurer l'état de session à partir du cookie).

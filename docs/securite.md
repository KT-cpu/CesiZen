# Sécurité

La sécurité repose sur deux principes : **sécurité dès la conception** et **défense en profondeur** (plusieurs couches de protection indépendantes).

## Authentification & autorisation

- **JWT signé (HS256)**, à durée de vie limitée. Le secret fait au moins 32 caractères et n'est jamais versionné.
- **Cookie `httpOnly`** côté web : `Secure` (en HTTPS), `SameSite=Strict` (protection CSRF). Le jeton n'est jamais accessible au JavaScript, ce qui neutralise son vol par XSS.
- **BCrypt** (facteur 12) pour le hachage des mots de passe.
- **Autorisation par rôle** : les opérations d'administration exigent le rôle `Administrateur`. Chaque utilisateur n'accède qu'à ses propres données (contrôle de propriété vérifié côté service, protection contre l'IDOR).

## Sécurité applicative

- **Requêtes paramétrées** (EF Core) contre les injections SQL.
- **En-têtes de sécurité** : `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- **Limitation de débit** (rate limiting) sur l'authentification : 5 tentatives par minute et par IP, contre la force brute.
- **CORS** restrictif en production (origines explicites, sans `AllowCredentials`).
- **Swagger désactivé** hors développement.

## Sécurité de l'infrastructure

- **Conteneurs non-root** : l'API et le front nginx s'exécutent en utilisateur non privilégié.
- **En-têtes serveur masqués** (`server_tokens off`, header Kestrel désactivé).
- **Gestion des secrets** hors dépôt (`.env` non versionné, secrets GitHub chiffrés).

## Détection & journalisation

Les événements de sécurité (`auth.login.success`, `auth.login.failure`, `auth.logout`) sont **journalisés au format JSON structuré**, prêts à être ingérés par un SIEM (Wazuh / ELK) pour la détection d'anomalies (force brute, accès hors horaires). Aucun mot de passe n'est jamais journalisé.

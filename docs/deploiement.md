# Déploiement

## Les trois environnements

| Environnement | Déclencheur | Hébergement | Rôle |
|---|---|---|---|
| **Développement** | Local (`docker compose`) | Poste du développeur + Neon (branche dev) | Itération rapide en local |
| **Staging** | Push sur `develop` | Render + Neon (branche staging) | Validation avant production |
| **Production** | Merge sur `main` | Render + Neon (branche production) | Application en service |

Les trois environnements partagent le même code mais des **instances d'infrastructure distinctes** (serveur, base, configuration).

## Hébergement

- **Render** (PaaS) : héberge l'API et le client web (services séparés). Terminaison TLS, URL publique fixe, redéploiement automatique sur push.
- **Neon** (PostgreSQL managé, région Frankfurt) : base de données, avec branches isolées par environnement et récupération à un instant T (PITR, 7 jours).
- **Azure Blob Storage** : stockage externe des sauvegardes quotidiennes de la base de production.

!!! info "Dépendance à Neon"
    Les trois environnements dépendent de Neon pour la donnée. Cette dépendance critique (point de défaillance unique) est atténuée par la sauvegarde externe indépendante sur Azure.

## Déploiement du mobile

Le déploiement de l'application mobile est pris en charge par **Expo** (build et distribution des binaires natifs via EAS). Il sort du périmètre du déploiement web/API décrit ici.

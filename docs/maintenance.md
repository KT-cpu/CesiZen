# Maintenance

## Ticketing & gestion des incidents

Le suivi s'appuie sur les **GitHub Issues**, avec des modèles standardisés (`bug_report`, `feature_request`) garantissant la complétude des informations. Chaque anomalie est qualifiée par un niveau de sévérité déterminant sa priorité et son délai de traitement (SLA).

| Sévérité | Prise en charge | Résolution cible |
|---|---|---|
| Critique | Immédiate | < 4 heures |
| Majeure | < 4 heures | < 24 heures |
| Mineure | < 2 jours | < 1 semaine |
| Cosmétique | Planifiée | Prochaine version |

## Gestion des versions

Le projet suit **GitFlow** et le **versionnement sémantique** (`MAJEUR.MINEUR.CORRECTIF`) :

- **MAJEUR** : changement incompatible avec les versions précédentes.
- **MINEUR** : ajout d'une fonctionnalité rétrocompatible.
- **CORRECTIF** : correction d'une anomalie, rétrocompatible.

Chaque version fait l'objet d'une entrée dans le `CHANGELOG.md` et d'une étiquette (tag) sur `main`.

## Sauvegarde & restauration

La stratégie suit le principe **3-2-1** :

- **Récupération à un instant T** : PITR natif de Neon sur 7 jours.
- **Sauvegarde externe quotidienne** : export `pg_dump` automatisé vers Azure Blob Storage, avec une **rétention de 30 jours**.

La procédure de restauration est testée périodiquement sur une base isolée afin de ne jamais affecter la production.

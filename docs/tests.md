# Tests

## Tests automatisés

Les tests sont écrits avec **xUnit** et regroupés dans le projet `CesiZen.Tests` :

- **Tests unitaires** : validation de la logique métier isolée.
- **Tests d'intégration** : exécutés via `WebApplicationFactory` avec une base **SQLite en mémoire**, ils valident le comportement bout-en-bout de l'API (endpoints, autorisation, cloisonnement des données).

Ces tests sont exécutés automatiquement à chaque intégration dans la chaîne CI/CD.

## Tests de charge (K6)

Quatre profils de charge distincts sont définis dans `tests/k6/`, factorisant une logique commune (`common.js`) :

| Profil | Objectif | Charge |
|---|---|---|
| **Load** | Comportement sous charge nominale | ~20 VU (montée progressive) |
| **Stress** | Localiser le point de rupture | 20 → 80 VU (paliers) |
| **Spike** | Résistance à un pic soudain | 5 → 100 VU (brutal) |
| **Soak** | Stabilité dans la durée (fuites mémoire) | 15 VU sur ~20 min |

### Résultats observés

Sur l'environnement de staging, les quatre profils présentent **0 % d'erreur** : l'application ne tombe jamais, même sous stress et pic. Le test d'endurance maintient une latence stable (`p95 ≈ 63 ms` sur 24 minutes), démontrant l'absence de fuite mémoire.

!!! note "Compromis sécurité / performance"
    Sous forte concurrence de connexions, la latence provient quasi exclusivement de l'authentification (hachage BCrypt), un choix de sécurité délibéré. Les lectures restent performantes. La limitation de débit empêche l'exploitation de ce coût en déni de service.

!!! warning "Limite méthodologique"
    Sur hébergement gratuit (ressources partagées), les valeurs absolues des tests de stress et de pic reflètent en partie l'infrastructure. Ce sont la forme des profils et le comportement (dégradation propre, récupération) qui importent.

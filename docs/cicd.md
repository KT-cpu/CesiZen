# CI/CD

La chaîne d'intégration et de livraison continues est implémentée avec **GitHub Actions**. Les workflows suivent une convention de nommage : `_NN_` pour les orchestrateurs, `NN-N_` pour les workflows réutilisables, `z_` / `x_` pour les workflows annexes.

## Étape d'intégration

Déclenchée à chaque push et pull request :

- **Tests back & front** : compilation et exécution des tests automatisés.
- **Analyse qualité (SonarQube)** : analyse statique du code avec un **Quality Gate bloquant** — le code ne respectant pas les critères de qualité et de sécurité ne peut pas être intégré.

## Étape de staging

Déclenchée sur la branche `develop` :

- **Build & publication des images** sur GitHub Container Registry (ghcr.io).
- **Scan de vulnérabilités (Trivy)** : analyse des images de conteneurs, **bloquant** sur les vulnérabilités critiques, élevées et moyennes.
- **Tests de charge (K6)** : validation du comportement sous charge sur l'environnement de staging.

## Workflows annexes

- **Sauvegarde de production** (`x_backup_prod`) : export quotidien automatisé de la base vers Azure Blob Storage, avec politique de rétention.
- **Infrastructure SonarQube** : la VM d'analyse est décrite en **Infrastructure as Code** (Bicep) dans `infra/sonarqube/`.

!!! success "Sécurité intégrée (DevSecOps)"
    La sécurité est automatisée et non contournable : analyse statique (SonarQube), scan de dépendances (Trivy), et analyse dynamique (OWASP ZAP) sont intégrés à la chaîne.

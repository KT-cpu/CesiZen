## [1.1.0] - 2026-07-03

### Ajouté
- Pipeline CI/CD complet (intégration, staging)
- Analyse qualité SonarQube self-hosted avec Quality Gate bloquant
- Analyse des branches (develop, main, feature/*)
- Scan de vulnérabilités des images Docker (Trivy, bloquant)
- Tests de charge automatisés (K6) sur l'environnement de staging
- Environnement de staging isolé (Render + branche Neon dédiée)
- Sauvegarde automatisée quotidienne de la base de production (Azure Blob Storage)
- Infrastructure SonarQube décrite en Infrastructure as Code (Bicep)

### Sécurité
- Correction des vulnérabilités libexpat de l'image frontend

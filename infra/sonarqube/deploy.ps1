# deploy.ps1 — Déploiement infrastructure SonarQube

# ============================================
# PARAMÈTRES
# ============================================
$resourceGroup = "rg-cesizen-sonarqube"
$location = "francecentral"
$adminUsername = "azureuser"
$sshPublicKeyPath = "C:\Users\33627\Desktop\CESI\Formation CDA\Partie 3\Bloc 3\Nouveau dossier\cesizen-sonarqube-key.pub"

# IP publique
$myIp = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
$allowedIp = "$myIp/32"
Write-Host "IP autorisee detectee : $allowedIp" -ForegroundColor Cyan

# Mot de passe BDD depuis variable env
$sonarDbPasswordPlain = $env:SONAR_DB_PASSWORD
if (-not $sonarDbPasswordPlain) {
    Write-Error "Definir `$env:SONAR_DB_PASSWORD = 'UnMotDePasse'"
    exit 1
}

# ============================================
# PREPARATION DU CLOUD-INIT
# ============================================
Write-Host "Preparation du cloud-init..." -ForegroundColor Cyan

if (-not (Test-Path ".\cloud-init.yaml")) {
    Write-Error "Fichier cloud-init.yaml introuvable."
    exit 1
}

$cloudInitContent = Get-Content -Path ".\cloud-init.yaml" -Raw
$cloudInitContent = $cloudInitContent -replace "__SONAR_DB_PASSWORD__", $sonarDbPasswordPlain
$cloudInitBytes = [System.Text.Encoding]::UTF8.GetBytes($cloudInitContent)
$cloudInitBase64 = [System.Convert]::ToBase64String($cloudInitBytes)
Write-Host "Cloud-init encode (longueur : $($cloudInitBase64.Length))" -ForegroundColor Cyan

# Cle publique SSH
$sshPublicKey = (Get-Content $sshPublicKeyPath -Raw).Trim()

# ============================================
# GENERATION DU FICHIER DE PARAMETRES JSON
# ============================================
Write-Host "Generation du fichier de parametres..." -ForegroundColor Cyan

$parameters = @{
    '$schema' = "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#"
    contentVersion = "1.0.0.0"
    parameters = @{
        adminUsername = @{ value = $adminUsername }
        adminPublicKey = @{ value = $sshPublicKey }
        sonarDbPassword = @{ value = $sonarDbPasswordPlain }
        allowedSourceIp = @{ value = $allowedIp }
        cloudInitData = @{ value = $cloudInitBase64 }
    }
}

# Ecrire le fichier de parametres temporaire
$paramFile = ".\params.generated.json"
$parameters | ConvertTo-Json -Depth 10 | Out-File -FilePath $paramFile -Encoding utf8

# ============================================
# DEPLOIEMENT
# ============================================
Write-Host "Creation du resource group..." -ForegroundColor Cyan
az group create --name $resourceGroup --location $location

Write-Host "Deploiement du Bicep (3-5 minutes)..." -ForegroundColor Cyan
az deployment group create `
  --resource-group $resourceGroup `
  --template-file ".\main.bicep" `
  --parameters "@$paramFile"

# ============================================
# NETTOYAGE
# ============================================
Write-Host "Nettoyage du fichier de parametres temporaire..." -ForegroundColor Cyan
Remove-Item -Path $paramFile -Force

Write-Host "Deploiement termine. Acces sonarqubeUrl dans les outputs ci-dessus." -ForegroundColor Green
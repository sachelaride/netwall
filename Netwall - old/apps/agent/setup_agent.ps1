# Script de Instalação Automatizada - Agente Netwall
# Versão: 1.0

$ErrorActionPreference = "Stop"

# 1. Verificar privilégios de Administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Por favor, execute este script como Administrador!"
    return
}

Write-Host "--- Iniciando Instalação do Agente Netwall ---" -ForegroundColor Cyan

# 2. Instalar Node.js via winget (se necessário)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js não encontrado. Instalando via winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
    Write-Host "Node.js instalado. Reiniciando sessão para atualizar PATH (simulado)..." -ForegroundColor Cyan
    # Adiciona o caminho do node ao PATH da sessão atual para evitar erro nos próximos comandos
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "Node.js já está instalado: $(node -v)" -ForegroundColor Green
}

# 3. Preparar diretório
$installPath = "C:\agente"
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath
}

# 4. Extrair o arquivo (agente.zip deve estar no mesmo diretório do script ou em Downloads)
$zipFile = Join-Path $PSScriptRoot "agente.zip"
if (-not (Test-Path $zipFile)) {
    $zipFile = "$HOME\Downloads\agente.zip"
}

if (Test-Path $zipFile) {
    Write-Host "Extraindo $zipFile para $installPath..." -ForegroundColor Cyan
    Expand-Archive -Path $zipFile -DestinationPath $installPath -Force
} else {
    Write-Warning "Arquivo agente.zip não encontrado em $PSScriptRoot ou Downloads. Pulando extração."
}

# 5. Configurar .env se não existir
cd $installPath
if (Test-Path "apps\agent") { cd "apps\agent" } # Caso tenha extraído a estrutura completa

if (-not (Test-Path ".env")) {
    Write-Host "Configurando servidor padrão (192.168.0.121)..." -ForegroundColor Cyan
    "SERVER_URL=http://192.168.0.121:3001" | Out-File -FilePath ".env" -Encoding ascii
}

# 6. Instalar dependências
Write-Host "Instalando dependências (npm install)... Isso pode levar um minuto." -ForegroundColor Cyan
npm install

Write-Host "`n--- Instalação Concluída com Sucesso! ---" -ForegroundColor Green
Write-Host "Para iniciar o agente, execute: npm run dev" -ForegroundColor Cyan
Write-Host "Dica: Use o NSSM para rodar como serviço."

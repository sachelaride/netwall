# Guia de Instalação Completo - Netwall (Local)

> **Ambiente Validado**:
> - **OS**: Ubuntu 24.04 LTS (Noble Numbat)
> - **Serviços**: PostgreSQL 16, InfluxDB 2.7, Redis 7.2
> - **Node.js**: v18.19.1 LTS (via NVM)

Este guia descreve o passo a passo exato para instalar o Netwall em um sistema **Ubuntu 24.04** utilizando infraestrutura local (sem Docker).

---

## 1. Preparação do Sistema

Abra o terminal e execute os seguintes comandos:

```bash
# 1. Atualizar lista de pacotes e sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar dependências básicas
sudo apt install -y git curl wget ca-certificates gnupg
```

---

## 2. Instalação da Infraestrutura Local

O Netwall agora roda diretamente no sistema host para melhor performance e integração.

```bash
# Execute o script de setup automatizado na raiz do projeto:
chmod +x setup_local_infra.sh
./setup_local_infra.sh
```

Este script irá:
1. Instalar e configurar o **PostgreSQL**.
2. Instalar o **InfluxDB 2** (configurando organização `netmonitor` e bucket `metrics`).
3. Instalar o **Redis**.
4. Abrir as portas necessárias no firewall (opcional).

---

## 3. Instalação do Node.js (via NVM)

Recomendamos usar o NVM para gerenciar o Node.js.

```bash
# 1. Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# 3. Instalar versão LTS
nvm install --lts
nvm use --lts
```

---

## 4. Setup do Projeto Netwall

```bash
# 1. Clonar o repositório
# git clone <URL_DO_REPOSITORIO> netwall
cd netwall

# 2. Instalar Dependências
npm install

# 3. Configurar Variáveis de Ambiente
# Verifique o arquivo apps/server/.env e garanta que as credenciais coincidem com o setup local.

# 4. Sincronizar Banco de Dados
cd apps/server
npx prisma db push
```

---

## 5. Rodando a Aplicação

Para iniciar o Frontend, Backend e Agente simultaneamente:

```bash
# Na raiz do projeto:
npm run dev
```

O sistema estará acessível em:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Logs do Poller**: `apps/server/poller_debug.log`

---

## 6. Comandos Úteis

### Verificar Status dos Serviços
```bash
systemctl status postgresql influxdb redis-server
```

### Limpar tudo e reinstalar
```bash
rm -rf node_modules apps/*/node_modules
npm install
```

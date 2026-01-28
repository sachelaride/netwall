# Guia de Instalação do Agente Netwall - Windows

Este guia descreve como instalar e configurar o agente de monitoramento Netwall em uma máquina Windows.

---

## 1. Abrir o PowerShell como Administrador
1. Pressione `Win + X`.
2. Clique em **Windows Terminal (Admin)** ou **Windows PowerShell (Admin)**.

---

## Opção 1: Instalação Automatizada (Recomendado)
Criei um script que faz tudo sozinho (instala Node.js, extrai arquivos, configura IP e instala dependências).

1. Abra o PowerShell como Administrador.
2. Navegue até onde baixou o `agente.zip` e o script `setup_agent.ps1`.
3. Execute o script:
```powershell
.\setup_agent.ps1
```

---

## Opção 2: Instalação Manual
Se preferir fazer passo a passo:

### 1. Instalar o Node.js
```powershell
winget install OpenJS.NodeJS.LTS
```

### 2. Extrair o Agente
Windows 10/11: Clique com o botão direito no `agente.zip` > **Extrair Tudo** > para `C:\agente`.

Ou via PowerShell:
```powershell
Expand-Archive -Path C:\Downloads\agente.zip -DestinationPath C:\agente
```

---

## 4. Instalação e Configuração

### Entrar no diretório
```powershell
cd C:\agente
```

### Criar arquivo de configuração (.env)
Crie um arquivo chamado `.env` na pasta `C:\agente` com o seguinte conteúdo:
```env
SERVER_URL=http://192.168.0.121:3001
```

### Instalar dependências
```powershell
npm install
```

---

## 5. Executar o Agente
Para rodar o agente em modo desenvolvimento (com log no terminal):
```powershell
npm run dev
```

---

## 🧠 Observações Importantes

### Erro de Política de Execução (Execution Policy)
Se o PowerShell bloquear a execução de scripts, rode:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Rodar como Serviço (Recomendado)
Para garantir que o agente inicie sozinho com o Windows, recomendamos o uso do **NSSM** (Non-Sucking Service Manager) para registrar o comando `npm run dev` como um serviço do sistema.

---
**Servidor de Destino**: `http://192.168.0.121:3001`

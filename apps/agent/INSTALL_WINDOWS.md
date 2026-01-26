# Instalação Automatizada do Agente Netwall

O agente agora é totalmente autônomo. Você não precisa instalar Node.js ou configurar arquivos manualmente.

---

## 🚀 Como Instalar (Windows)

1. **Baixe o Executável**: Obtenha o `agent-win.exe`.
2. **Abra o Terminal como Administrador**:
   - Pressione `Win + X` e selecione **Terminal (Administrador)** ou **PowerShell (Administrador)**.
3. **Execute a Instalação**:
   Navegue até a pasta do download e execute:
   ```powershell
   .\agent-win.exe --install --server=http://IP-DO-SEU-SERVIDOR:3001
   ```

### O que este comando faz:
- Cria a pasta `C:\NetwallAgent`.
- Copia o executável para o local definitivo.
- Cria o arquivo `config.json` automaticamente.
- **Registra o Agente como um Serviço do Windows**: Ele iniciará sozinho sempre que o computador ligar.

---

## ⚙️ Configuração Adicional
Se precisar alterar o intervalo de coleta (ex: rodar inventário a cada hora), edite o arquivo `C:\NetwallAgent\config.json`:

```json
{
  "serverUrl": "http://IP:3001",
  "agentId": "NOME",
  "inventoryInterval": 3600000
}
```

## 🐧 Como Instalar (Linux)
Execute como root:
```bash
chmod +x agent-linux
./agent-linux --install --server=http://IP-DO-SERVIDOR:3001
```
Isso criará um serviço no `systemd` chamado `netwall-agent`.

---
**Dica**: Para verificar se o serviço está rodando no Windows, use o Gerenciador de Tarefas > Serviços e procure por `NetwallAgent`.








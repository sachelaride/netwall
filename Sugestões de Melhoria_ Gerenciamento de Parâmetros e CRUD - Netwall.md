# Sugestões de Melhoria: Gerenciamento de Parâmetros e CRUD - Netwall

Com base na análise do repositório **Netwall**, identifiquei oportunidades para transformar a configuração atual (parcialmente "hardcoded" ou dispersa) em um sistema de gerenciamento robusto com CRUD completo.

## 1. Arquitetura de Gerenciamento de Parâmetros

Atualmente, o sistema possui configurações distribuídas entre variáveis de ambiente e o banco de dados (Prisma). A melhoria proposta consiste em centralizar todos os parâmetros operacionais em uma estrutura de **Configuração Dinâmica**.

### Proposta de Modelo de Dados (Prisma)
Adicionar um modelo genérico para parâmetros que permita criar, ler, atualizar e excluir (CRUD) configurações sem reiniciar o servidor.

```prisma
model SystemParameter {
  id          String   @id @default(uuid())
  key         String   @unique // Ex: "snmp_default_community", "scan_interval_ms"
  value       String
  description String?
  category    String   @default("GENERAL") // Ex: "SNMP", "SCAN", "AGENT"
  type        ParamType @default(STRING)
  updatedAt   DateTime @updatedAt
}

enum ParamType {
  STRING
  NUMBER
  BOOLEAN
  JSON
}
```

## 2. Implementação do CRUD Completo (tRPC)

Para gerenciar esses parâmetros, propomos a criação de um `settingsRouter.ts` no backend.

### Operações CRUD:
| Operação | Descrição | Endpoint Sugerido |
| :--- | :--- | :--- |
| **Create** | Adicionar novo parâmetro customizado | `settings.createParameter` |
| **Read** | Listar todos ou buscar por categoria | `settings.getParameters` |
| **Update** | Alterar valor de um parâmetro existente | `settings.updateParameter` |
| **Delete** | Remover parâmetro (apenas para customizados) | `settings.deleteParameter` |

## 3. Melhorias no Gerenciamento de Dispositivos e SNMP

Atualmente, as comunidades SNMP e interfaces monitoradas estão em tabelas separadas ou tratadas de forma simplificada.

### Sugestões de Melhoria:
1.  **CRUD de Comunidades SNMP:** Criar uma entidade `SnmpCredential` vinculada aos dispositivos, permitindo gerenciar diferentes versões (v1, v2c, v3) e credenciais (Auth/Priv para v3).
2.  **Parâmetros de Escaneamento:** Transformar os parâmetros do `networkScanner.ts` em entradas no banco de dados, permitindo que o usuário defina via UI:
    *   Faixas de IP (Subnets).
    *   Exclusões de IP.
    *   Velocidade do Scan (Timing do Nmap).
    *   Agendamento (Cron syntax).

## 4. Interface de Usuário (Frontend)

Implementar uma nova seção de **Configurações do Sistema** no dashboard:
*   **Tabela de Parâmetros:** Com busca e filtros por categoria.
*   **Editor de Parâmetros:** Modal para edição rápida de valores com validação baseada no tipo (`ParamType`).
*   **Logs de Auditoria:** Registrar quem alterou qual parâmetro para garantir segurança.

## 5. Próximos Passos Recomendados

1.  **Migração de Dados:** Mover configurações estáticas de arquivos `.ts` para a tabela `SystemParameter`.
2.  **Middleware de Configuração:** Criar um serviço no backend que carrega esses parâmetros em cache (Redis ou memória) para evitar consultas excessivas ao banco de dados durante operações de monitoramento de alta frequência.
3.  **Validação com Zod:** Garantir que cada parâmetro siga um esquema rigoroso antes de ser salvo, evitando que valores inválidos quebrem o sistema de coleta.

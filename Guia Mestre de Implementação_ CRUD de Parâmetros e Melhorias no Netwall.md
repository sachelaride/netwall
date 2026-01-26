# Guia Mestre de Implementação: CRUD de Parâmetros e Melhorias no Netwall

Este documento consolida as sugestões de melhoria para o repositório **Netwall**, focando na implementação de um sistema de **Gerenciamento de Parâmetros com CRUD completo** e define um plano de acompanhamento para a evolução do projeto.

## 1. Sugestão de Melhoria Central: Configuração Dinâmica com CRUD

A principal melhoria proposta é a centralização de todas as configurações operacionais (como comunidades SNMP, intervalos de scan, e limites de alerta) em um modelo de dados dinâmico, permitindo que sejam gerenciadas via interface web com operações **CRUD (Create, Read, Update, Delete)**.

### 1.1. Proposta de Modelo de Dados (Prisma)

O modelo `SystemParameter` deve ser adicionado ao `prisma/schema.prisma` para armazenar configurações de forma flexível e tipada.

\`\`\`prisma
model SystemParameter {
  id          String    @id @default(uuid())
  key         String    @unique // Ex: "snmp_default_community", "scan_interval_ms"
  value       String
  description String?
  category    String    @default("GENERAL") // Ex: "SNMP", "SCAN", "AGENT"
  type        ParamType @default(STRING)
  updatedAt   DateTime  @updatedAt
}

enum ParamType {
  STRING
  NUMBER
  BOOLEAN
  JSON
}
\`\`\`

### 1.2. Implementação do Backend (tRPC)

Crie um novo router, por exemplo, `settingsRouter.ts`, para expor os endpoints CRUD necessários.

| Operação | Endpoint Sugerido | Descrição |
| :--- | :--- | :--- |
| **Create** | `settings.createParameter` | Adiciona um novo parâmetro ao sistema. |
| **Read** | `settings.getParameters` | Lista todos os parâmetros, com filtros opcionais por `category`. |
| **Update** | `settings.updateParameter` | Altera o `value` de um parâmetro existente, usando a `key` como identificador. |
| **Delete** | `settings.deleteParameter` | Remove um parâmetro (apenas para customizados, protegendo chaves críticas). |

### 1.3. Middleware de Configuração

Para garantir performance, o sistema não deve consultar o banco de dados a cada operação.

1.  **Cache:** Implemente um serviço de cache (em memória ou Redis) que carregue todos os parâmetros na inicialização do servidor.
2.  **Atualização:** Sempre que um parâmetro for alterado via `settings.updateParameter`, o cache deve ser invalidado e recarregado.
3.  **Uso:** Todas as lógicas de negócio (ex: `snmpRouter.ts`, `scanRouter.ts`) devem consumir as configurações a partir deste cache.

## 2. Melhorias Específicas de Gerenciamento

A implementação do CRUD de parâmetros deve ser aplicada para gerenciar as seguintes áreas, que atualmente estão fixas ou simplificadas:

| Área | Melhoria Proposta | Implementação |
| :--- | :--- | :--- |
| **Credenciais SNMP** | Gerenciamento de múltiplas comunidades e versões (v1, v2c, v3) por dispositivo. | Criar uma entidade `SnmpCredential` (ou usar `SystemParameter` com `category: 'SNMP_CREDENTIALS'`) e vincular ao `Device` ou `MonitoredDevice`. |
| **Escaneamento de Rede** | Configuração dinâmica de faixas de IP, exclusões e agendamento de scans. | Usar `SystemParameter` para armazenar listas de subnets a serem escaneadas e a frequência (ex: `scan_subnets`, `scan_schedule_cron`). |
| **Limites de Alerta** | Configuração de thresholds (limites) para CPU, RAM, Latência, etc., por tipo de dispositivo. | Criar um modelo `AlertThreshold` ou usar `SystemParameter` com `type: JSON` para armazenar um objeto de limites por `DeviceType`. |

## 3. Passos de Acompanhamento e Roadmap de Evolução

Para garantir que o projeto evolua de forma coesa e escalável, siga o roadmap de alto nível já identificado no repositório, complementado pelas sugestões de acompanhamento:

### Fase 1: Base de Configuração (Foco Imediato)

| Passo | Objetivo |
| :--- | :--- |
| **1.1** | Implementar o modelo `SystemParameter` no Prisma. |
| **1.2** | Criar o `settingsRouter.ts` com as operações CRUD básicas. |
| **1.3** | Desenvolver o Middleware de Cache de Configurações. |
| **1.4** | Migrar a primeira configuração crítica (ex: `snmp_default_community`) do código para o banco de dados. |

### Fase 2: Integração e UI (Foco em Usabilidade)

| Passo | Objetivo |
| :--- | :--- |
| **2.1** | Criar a interface de usuário (Frontend) para o CRUD de parâmetros. |
| **2.2** | Integrar o `snmpRouter.ts` para consumir as credenciais SNMP do novo sistema de parâmetros. |
| **2.3** | Implementar o CRUD de faixas de IP para o escaneamento de rede. |
| **2.4** | Iniciar a implementação do **Inventário de Ativos (OCS-like)**, conforme detalhado no roadmap do repositório. |

### Fase 3: Escalabilidade e Robustez (Foco em Produção)

| Passo | Objetivo |
| :--- | :--- |
| **3.1** | Implementar o **Módulo de Auditoria** para registrar todas as alterações nos parâmetros críticos. |
| **3.2** | Implementar o conceito de **Administração Multi-Rede (Locais/Clientes)**, conforme roadmap. |
| **3.3** | Desenvolver o sistema de **Ações Remotas no Agente** (pré-requisito para deploy de software). |
| **3.4** | Otimizar o Agente para **Inventário Delta**, enviando apenas mudanças de hardware/software. |

## 4. Sugestões de Acompanhamento Contínuo

Para manter a qualidade e a evolução do projeto, sugiro as seguintes práticas de acompanhamento:

1.  **Testes de Integração para Configurações:** Crie testes automatizados que garantam que a alteração de um parâmetro via CRUD realmente afeta o comportamento do sistema (ex: mudar a comunidade SNMP e verificar se a coleta ainda funciona).
2.  **Documentação da API (tRPC):** Mantenha a documentação do tRPC atualizada, especialmente para os novos endpoints de gerenciamento de configurações.
3.  **Monitoramento de Performance do Cache:** Monitore o tempo de carregamento e a taxa de acerto do cache de configurações para garantir que o middleware está otimizando o acesso ao banco de dados.
4.  **Feedback do Usuário:** A interface de gerenciamento de parâmetros deve ser intuitiva. Colete feedback de usuários administradores para refinar a usabilidade do CRUD.

Este guia serve como um plano de ação claro para aprimorar o Netwall, transformando-o em uma plataforma de monitoramento mais flexível e poderosa.

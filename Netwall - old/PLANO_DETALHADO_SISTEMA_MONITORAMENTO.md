# Plano Detalhado: Sistema de Monitoramento de Ativos e Rede
## NetMonitor Pro - Arquitetura Completa

---

## 1. VISÃO GERAL DO SISTEMA

O **NetMonitor Pro** é uma plataforma integrada de monitoramento de infraestrutura e rede que combina coleta automática de métricas, análise de tráfego, scanning de rede e visualização em tempo real. O sistema é projetado para escalar horizontalmente, suportando desde pequenas redes até infraestruturas empresariais com milhares de dispositivos.

### Objetivo Principal

Fornecer visibilidade completa sobre a saúde, performance e segurança da infraestrutura de TI através de dashboards intuitivos, alertas inteligentes e análises profundas de rede.

### Princípios de Design

1. **Escalabilidade**: Arquitetura distribuída com coleta descentralizada e armazenamento otimizado
2. **Confiabilidade**: Redundância em componentes críticos, recuperação automática de falhas
3. **Usabilidade**: Interface intuitiva com visualizações claras e ações diretas
4. **Extensibilidade**: Suporte a plugins, integrações e customizações
5. **Performance**: Latência mínima na coleta, processamento e visualização de dados

---

## 2. ARQUITETURA GERAL DO SISTEMA

### 2.1 Camadas Arquiteturais

```
┌─────────────────────────────────────────────────────────┐
│          CAMADA DE APRESENTAÇÃO (Frontend)              │
│  Dashboards | Gráficos | Topologia | Alertas | Relatórios│
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│          CAMADA DE API (Backend/tRPC)                   │
│  Procedures | Autenticação | Autorização | Validação   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│       CAMADA DE LÓGICA DE NEGÓCIO                       │
│  Processamento | Correlação | Alertas | Análise         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│       CAMADA DE DADOS E ARMAZENAMENTO                   │
│  TSDB | Cache | Fila de Mensagens | Blob Storage       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│       CAMADA DE COLETA E INTEGRAÇÃO                     │
│  Agentes | Scanners | Capturadores | Integrações       │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Componentes Principais

| Componente | Responsabilidade | Tecnologia Sugerida |
|-----------|-----------------|-------------------|
| **Frontend** | Interface web, dashboards, gráficos | React 19 + Tailwind 4 |
| **Backend API** | Endpoints tRPC, lógica de negócio | Express + tRPC |
| **Banco de Dados Principal** | Metadados, configurações, usuários | MySQL/TiDB |
| **Time Series DB** | Armazenamento de métricas | InfluxDB ou TimescaleDB |
| **Cache** | Dados quentes, sessões | Redis |
| **Message Queue** | Fila de eventos e alertas | RabbitMQ ou Kafka |
| **Agentes de Coleta** | Coleta de métricas nos hosts | Node.js ou Python |
| **Scanner de Rede** | Nmap integrado, descoberta | Nmap + wrapper Node.js |
| **Capturador de Pacotes** | Tcpdump integrado, análise | Tcpdump + parser Node.js |
| **Blob Storage** | Exportações, relatórios, capturas | S3 ou similar |

---

## 3. FUNCIONALIDADE 1: DASHBOARD PRINCIPAL

### 3.1 Objetivo
Fornecer visão consolidada e em tempo real do status geral da infraestrutura, permitindo identificação rápida de problemas críticos.

### 3.2 Componentes do Dashboard

#### 3.2.1 Seção de Status Geral
- **Card de Saúde da Rede**: Percentual de dispositivos online/offline, tendência
- **Card de Alertas Ativos**: Contagem por severidade (crítico, alto, médio, baixo)
- **Card de Performance Média**: CPU, memória, disco agregados
- **Card de Tráfego de Rede**: Largura de banda utilizada vs. disponível

#### 3.2.2 Gráficos em Tempo Real
- **Série temporal de métricas críticas**: CPU, memória, latência (últimas 24h)
- **Mapa de calor de alertas**: Distribuição temporal de eventos críticos
- **Gauge de disponibilidade**: Uptime percentual da semana/mês

#### 3.2.3 Lista de Alertas Ativos
- Tabela com alertas ordenados por severidade e tempo
- Filtros por tipo, dispositivo, severidade
- Ações rápidas: reconhecer, silenciar, investigar

#### 3.2.4 Top Devices
- Dispositivos com maior consumo de CPU
- Dispositivos com maior consumo de memória
- Dispositivos com maior tráfego de rede
- Dispositivos com mais alertas

### 3.3 Atualização em Tempo Real
- WebSocket ou Server-Sent Events (SSE) para push de dados
- Intervalo de atualização: 5-10 segundos para métricas críticas
- Compressão de dados para reduzir banda

### 3.4 Persistência e Cache
- Cache de 1 hora em Redis para dados agregados
- Invalidação automática ao receber novas métricas
- Fallback para dados históricos se backend indisponível

---

## 4. FUNCIONALIDADE 2: MONITORAMENTO DE DISPOSITIVOS

### 4.1 Objetivo
Coletar automaticamente métricas de performance e saúde de todos os dispositivos monitorados.

### 4.2 Arquitetura de Coleta

#### 4.2.1 Agentes de Coleta
Executados em cada host monitorado, responsáveis por:
- Coleta periódica de métricas (intervalo configurável: 30s, 1m, 5m)
- Compressão e envio para servidor central
- Retry automático com backoff exponencial
- Cache local em caso de desconexão

#### 4.2.2 Métricas Coletadas

| Métrica | Descrição | Frequência | Unidade |
|---------|-----------|-----------|--------|
| **CPU** | Uso de processador (%) | 1 min | % |
| **Memória** | RAM utilizada/total | 1 min | MB, % |
| **Disco** | Espaço utilizado por partição | 5 min | GB, % |
| **Latência** | Ping para gateway/DNS | 1 min | ms |
| **Uptime** | Tempo desde último boot | 5 min | segundos |
| **Tráfego de Rede** | Bytes in/out por interface | 1 min | Mbps |
| **Conexões TCP** | Número de conexões ativas | 1 min | count |
| **Processos** | Número de processos ativos | 5 min | count |
| **Temperatura** | Temperatura de CPU (se disponível) | 1 min | °C |
| **Disco I/O** | Leitura/escrita por segundo | 1 min | IOPS |

#### 4.2.3 Descoberta Automática de Dispositivos
- Integração com Nmap para descoberta inicial
- Scan automático em intervalos configuráveis (diário, semanal)
- Detecção de novos dispositivos e remoção de offline
- Fingerprinting de SO e serviços

### 4.3 Armazenamento de Métricas

#### 4.3.1 Banco de Dados de Séries Temporais
- **Modelo de dados**: (timestamp, device_id, metric_name, value, tags)
- **Retenção**: 
  - 1 minuto: 7 dias (granularidade máxima)
  - 5 minutos: 30 dias (agregação)
  - 1 hora: 1 ano (agregação)
  - 1 dia: 5 anos (agregação)
- **Compressão**: Delta encoding + XOR para floats
- **Particionamento**: Por dia e por dispositivo

#### 4.3.2 Índices
- Índice primário: (device_id, metric_name, timestamp)
- Índice secundário: (timestamp, device_id) para queries por tempo
- Índice em tags para filtros rápidos

### 4.4 Processamento de Dados

#### 4.4.1 Pipeline de Processamento
1. **Recebimento**: Validação e deduplicação
2. **Enriquecimento**: Adição de metadados (localização, grupo, etc.)
3. **Agregação**: Cálculo de médias, máximos, mínimos
4. **Detecção de Anomalias**: Comparação com baseline
5. **Armazenamento**: Persistência em TSDB
6. **Cache**: Atualização de cache quente

#### 4.4.2 Cálculos Derivados
- **Média móvel**: Suavização de picos
- **Taxa de mudança**: Detecção de tendências
- **Desvio padrão**: Identificação de variações
- **Percentis**: P50, P95, P99 para análise

### 4.5 Configuração de Monitoramento

#### 4.5.1 Perfis de Monitoramento
- **Servidor**: CPU, memória, disco, rede, processos críticos
- **Workstation**: CPU, memória, disco, rede
- **Impressora**: Status, contagem de páginas, erros
- **Switch/Router**: Tráfego, latência, erros, pacotes perdidos
- **Firewall**: Conexões, tráfego, bloqueios, CPU

#### 4.5.2 Customização
- Intervalo de coleta por dispositivo
- Métricas específicas por tipo de dispositivo
- Thresholds de alerta customizáveis
- Exclusão de métricas desnecessárias

---

## 5. FUNCIONALIDADE 3: SCANNING DE REDE COM NMAP

### 5.1 Objetivo
Descobrir automaticamente dispositivos na rede, identificar portas abertas, serviços e sistemas operacionais.

### 5.2 Tipos de Scan

#### 5.2.1 Scan de Descoberta (Host Discovery)
- **Técnicas**: ICMP echo, ARP, TCP SYN, UDP
- **Frequência**: Semanal ou sob demanda
- **Resultado**: Lista de hosts ativos com MAC address

#### 5.2.2 Scan de Portas
- **Tipos**: TCP SYN, TCP Connect, UDP
- **Portas**: Top 1000, custom ranges, ou all ports
- **Resultado**: Portas abertas, fechadas, filtradas

#### 5.2.3 Detecção de Serviços
- **Probes**: Nmap service probes database
- **Versão**: Identificação de versão de software
- **Resultado**: Serviço, versão, produto

#### 5.2.4 Detecção de SO
- **Técnicas**: TCP/IP fingerprinting
- **Acurácia**: Percentual de confiança
- **Resultado**: SO, versão, família

### 5.3 Configuração de Scans

#### 5.3.1 Perfis de Scan
- **Rápido**: Top 100 portas, sem detecção de versão
- **Padrão**: Top 1000 portas, detecção de versão
- **Completo**: Todas as portas, detecção de SO, scripts
- **Agressivo**: Timing agressivo, múltiplas técnicas

#### 5.3.2 Agendamento
- **Scan inicial**: Ao adicionar nova rede
- **Scan periódico**: Diário, semanal, mensal
- **Scan sob demanda**: Manual via interface
- **Scan incremental**: Apenas mudanças desde último scan

### 5.4 Armazenamento de Resultados

#### 5.4.1 Dados Capturados
- Host IP/MAC
- Hostname (se resolvível)
- Portas abertas com serviços
- Versão de SO
- Timestamp do scan
- Histórico de mudanças

#### 5.4.2 Banco de Dados
- Tabela: `network_assets` (IP, MAC, hostname, SO, tipo)
- Tabela: `network_services` (asset_id, port, protocol, service, version)
- Tabela: `scan_history` (scan_id, timestamp, asset_id, status)

### 5.5 Integração com Monitoramento

#### 5.5.1 Descoberta Automática
- Novos hosts descobertos são automaticamente adicionados ao monitoramento
- Agente é instalado/configurado automaticamente se possível
- Alertas para novos dispositivos na rede

#### 5.5.2 Validação
- Verificação de mudanças de porta/serviço (possível comprometimento)
- Alertas para novos serviços descobertos
- Alertas para serviços que desapareceram

---

## 6. FUNCIONALIDADE 4: CAPTURA E ANÁLISE DE PACOTES

### 6.1 Objetivo
Capturar tráfego de rede em tempo real e analisar padrões, protocolos e anomalias.

### 6.2 Captura de Pacotes

#### 6.2.1 Integração com Tcpdump
- **Captura**: Em interfaces específicas ou todas
- **Filtros BPF**: Expressões Berkeley Packet Filter
- **Formato**: PCAP (libpcap)
- **Armazenamento**: Rotação de arquivos por tamanho/tempo

#### 6.2.2 Filtros Personalizáveis
- **Por protocolo**: TCP, UDP, ICMP, DNS, HTTP, HTTPS, etc.
- **Por host**: IP origem/destino, subnet
- **Por porta**: Porta origem/destino, range
- **Por tamanho**: Pacotes grandes, pequenos
- **Combinados**: Expressões complexas (e.g., `tcp port 443 and src 192.168.1.0/24`)

#### 6.2.3 Sessões de Captura
- **Duração**: Tempo fixo ou contínuo
- **Limite de tamanho**: Máximo de MB a capturar
- **Parada automática**: Por tamanho ou tempo
- **Histórico**: Últimas 10 capturas armazenadas

### 6.3 Análise de Pacotes

#### 6.3.1 Análise em Tempo Real
- **Estatísticas de protocolos**: Contagem por tipo
- **Top talkers**: IPs com maior tráfego
- **Conexões ativas**: Pares origem-destino
- **Taxa de pacotes**: Pacotes por segundo
- **Taxa de erros**: Pacotes perdidos, malformados

#### 6.3.2 Análise Histórica
- **Comparação temporal**: Tráfego hoje vs. ontem
- **Padrões**: Horários de pico, padrões normais
- **Tendências**: Crescimento de tráfego
- **Anomalias**: Desvios do padrão normal

### 6.4 Exportação de Resultados

#### 6.4.1 Formatos
- **PCAP**: Para análise em Wireshark
- **CSV**: Estatísticas em planilha
- **JSON**: Dados estruturados
- **PDF**: Relatório formatado

#### 6.4.2 Armazenamento
- **S3 Bucket**: Armazenamento de longo prazo
- **Retenção**: Configurável (7 dias, 30 dias, 1 ano)
- **Compressão**: Gzip para economizar espaço
- **Acesso**: Download direto ou link compartilhável

### 6.5 Correlação com Alertas

#### 6.5.1 Triggers Automáticos
- Captura automática ao detectar anomalia
- Captura automática ao receber alerta crítico
- Captura automática ao detectar tentativa de acesso não autorizado

#### 6.5.2 Análise Forense
- Reconstrução de fluxo de dados
- Identificação de padrões de ataque
- Extração de payloads (com cuidado)

---

## 7. FUNCIONALIDADE 5: GRÁFICOS INTERATIVOS

### 7.1 Objetivo
Visualizar dados históricos de performance com interatividade, permitindo análise profunda e comparações.

### 7.2 Tipos de Gráficos

#### 7.2.1 Série Temporal (Time Series)
- **Eixo X**: Tempo (últimas 24h, 7d, 30d, 1a)
- **Eixo Y**: Valor da métrica
- **Múltiplas séries**: Comparação de dispositivos
- **Zoom e Pan**: Navegação temporal
- **Anotações**: Eventos e alertas marcados

#### 7.2.2 Comparação Temporal
- **Hoje vs. Ontem**: Mesma hora em dias diferentes
- **Semana vs. Semana**: Comparação de semanas
- **Mês vs. Mês**: Comparação de meses
- **Percentual de mudança**: Visualização de crescimento

#### 7.2.3 Distribuição (Histograma)
- **Distribuição de valores**: Frequência de ocorrência
- **Percentis**: P50, P95, P99 destacados
- **Min/Max/Média**: Estatísticas básicas

#### 7.2.4 Correlação
- **Scatter plot**: Relação entre duas métricas
- **Heatmap**: Correlação entre múltiplas métricas
- **Matriz de correlação**: Todas as métricas

#### 7.2.5 Gauge e Status
- **Gauge**: Valor atual com limite de alerta
- **Status indicator**: Cores (verde, amarelo, vermelho)
- **Trend arrow**: Seta indicando tendência

### 7.3 Interatividade

#### 7.3.1 Drill-Down
- Clicar em ponto para ver detalhes
- Expandir período de tempo
- Filtrar por dispositivo/métrica

#### 7.3.2 Seleção de Período
- Preset: 1h, 24h, 7d, 30d, 1a
- Custom: Data/hora inicial e final
- Zoom: Arrastar para selecionar período

#### 7.3.3 Seleção de Métricas
- Checkbox para mostrar/ocultar séries
- Legenda clicável
- Cores customizáveis

#### 7.3.4 Exportação
- PNG/SVG: Imagem do gráfico
- CSV: Dados brutos
- PDF: Relatório formatado

### 7.4 Performance

#### 7.4.1 Agregação Automática
- Período < 24h: Dados por minuto
- Período 24h-7d: Dados por 5 minutos
- Período > 7d: Dados por hora
- Período > 30d: Dados por dia

#### 7.4.2 Caching
- Cache de gráficos renderizados (1h)
- Cache de dados agregados (5 min)
- Invalidação ao receber novos dados

#### 7.4.3 Renderização
- Biblioteca: Recharts ou Chart.js
- Canvas para melhor performance
- Lazy loading de dados

---

## 8. FUNCIONALIDADE 6: SISTEMA DE ALERTAS

### 8.1 Objetivo
Notificar proativamente sobre problemas, permitindo resposta rápida e escalação automática.

### 8.2 Tipos de Alertas

#### 8.2.1 Baseados em Threshold
- **Estático**: CPU > 80%
- **Dinâmico**: Desvio > 2 desvios padrão
- **Duplo threshold**: Alerta quando sobe, recupera quando desce
- **Duração**: Alerta só após N minutos acima do threshold

#### 8.2.2 Baseados em Anomalia
- **Detecção estatística**: Comparação com baseline
- **Machine Learning**: Modelos de previsão
- **Comportamental**: Desvio de padrão normal
- **Sazonal**: Ajuste para padrões sazonais

#### 8.2.3 Baseados em Correlação
- **Múltiplas métricas**: Alerta quando combinação ocorre
- **Dependências**: Alerta em cascata
- **Relacionamentos**: Alerta se dispositivo A falha e B não responde

#### 8.2.4 Baseados em Eventos
- **Log patterns**: Regex em logs
- **Mudanças de estado**: Dispositivo offline
- **Novos eventos**: Novo serviço descoberto

### 8.3 Configuração de Alertas

#### 8.3.1 Regras de Alerta
- **Nome**: Identificação clara
- **Condição**: Expressão lógica
- **Severidade**: Crítico, Alto, Médio, Baixo, Informativo
- **Habilitado**: Ativar/desativar
- **Silenciado**: Período de silêncio

#### 8.3.2 Thresholds Personalizáveis
- **Por dispositivo**: Diferentes limites para servidores vs. workstations
- **Por horário**: Thresholds diferentes em horário comercial
- **Por período**: Thresholds sazonais
- **Histórico**: Ajuste automático baseado em histórico

### 8.4 Escalação de Alertas

#### 8.4.1 Políticas de Escalação
- **Nível 1**: Notificação no dashboard
- **Nível 2**: Email após 5 minutos
- **Nível 3**: SMS após 15 minutos
- **Nível 4**: Ligação após 30 minutos
- **Nível 5**: Escalação para gerente

#### 8.4.2 Grupos de Contato
- **Por função**: Administrador, Operador, Gerente
- **Por horário**: On-call schedule
- **Por severidade**: Diferentes contatos para diferentes severidades
- **Rotação**: Distribuição de alertas entre equipe

### 8.5 Notificações

#### 8.5.1 Canais
- **Dashboard**: Notificação visual em tempo real
- **Email**: Detalhes completos do alerta
- **SMS**: Notificação crítica
- **Webhook**: Integração com sistemas externos
- **Slack/Teams**: Notificação em canal corporativo

#### 8.5.2 Conteúdo da Notificação
- **Título**: Descrição breve
- **Severidade**: Ícone e cor
- **Dispositivo**: Nome e IP
- **Métrica**: Nome e valor atual
- **Threshold**: Limite que foi excedido
- **Tempo**: Quando ocorreu
- **Ação**: Link para investigar

#### 8.5.3 Deduplicação
- **Janela de deduplicação**: 5 minutos
- **Agrupamento**: Alertas similares agrupados
- **Supressão**: Não notificar se alerta anterior não resolvido

### 8.6 Gerenciamento de Alertas

#### 8.6.1 Ações no Dashboard
- **Reconhecer**: Marcar como visto
- **Silenciar**: Desabilitar por período
- **Resolver**: Marcar como resolvido
- **Escalar**: Enviar para nível superior
- **Comentar**: Adicionar notas

#### 8.6.2 Histórico
- **Log de alertas**: Todos os alertas com timestamps
- **Duração**: Tempo desde início até resolução
- **Ações tomadas**: Quem reconheceu, silenciou, etc.
- **Análise**: Alertas mais frequentes, falsos positivos

---

## 9. FUNCIONALIDADE 7: GERENCIAMENTO DE ATIVOS

### 9.1 Objetivo
Manter inventário completo de todos os dispositivos, permitindo busca, categorização e rastreamento de mudanças.

### 9.2 Cadastro de Ativos

#### 9.2.1 Informações Básicas
- **Nome**: Identificação única
- **IP/MAC**: Endereços de rede
- **Tipo**: Servidor, workstation, impressora, switch, firewall, etc.
- **Localização**: Prédio, sala, rack
- **Proprietário**: Departamento, responsável
- **Status**: Ativo, inativo, descontinuado

#### 9.2.2 Informações Técnicas
- **SO**: Sistema operacional e versão
- **Processador**: CPU, núcleos, velocidade
- **Memória**: RAM total
- **Armazenamento**: Disco total, tipo (SSD/HDD)
- **Rede**: Interfaces, velocidade, MAC address
- **Serviços**: Softwares instalados, versões

#### 9.2.3 Informações de Negócio
- **Criticidade**: Crítico, alto, médio, baixo
- **Custo**: Valor do ativo
- **Data de compra**: Quando foi adquirido
- **Garantia**: Data de expiração
- **Contrato**: Informações de suporte/manutenção
- **SLA**: Disponibilidade esperada

### 9.3 Categorização

#### 9.3.1 Grupos
- **Hierárquico**: Datacenter > Rack > Servidor
- **Funcional**: Produção, Desenvolvimento, Teste
- **Geográfico**: Prédio, Andar, Sala
- **Departamento**: TI, RH, Vendas, etc.

#### 9.3.2 Tags
- **Customizáveis**: Qualquer tag definida pelo usuário
- **Multi-valor**: Um ativo pode ter múltiplas tags
- **Busca**: Filtro por tags
- **Relatórios**: Agrupamento por tags

### 9.4 Busca Avançada

#### 9.4.1 Critérios de Busca
- **Texto**: Nome, IP, hostname
- **Tipo**: Filtro por tipo de dispositivo
- **Status**: Ativo, inativo, etc.
- **Localização**: Prédio, sala
- **Tags**: Uma ou múltiplas tags
- **Intervalo**: Criado entre datas, modificado recentemente

#### 9.4.2 Salvar Buscas
- **Buscas frequentes**: Salvar como favorito
- **Alertas**: Criar alerta quando resultado muda
- **Relatórios**: Gerar relatório automático

### 9.5 Histórico de Mudanças

#### 9.5.1 Auditoria
- **Quem**: Usuário que fez a mudança
- **Quando**: Timestamp da mudança
- **O quê**: Campo que foi alterado
- **De/Para**: Valor anterior e novo
- **Por quê**: Motivo da mudança (opcional)

#### 9.5.2 Rastreamento de Mudanças
- **SO**: Quando SO foi atualizado
- **Versão de Software**: Quando versão mudou
- **Localização**: Quando dispositivo foi movido
- **Status**: Quando ficou offline/online

### 9.6 Importação/Exportação

#### 9.6.1 Importação
- **CSV**: Importar lista de ativos
- **Excel**: Planilha com informações
- **API**: Integração com CMDB externo
- **Nmap**: Importar resultados de scan

#### 9.6.2 Exportação
- **CSV**: Lista completa de ativos
- **Excel**: Com formatação e gráficos
- **PDF**: Relatório imprimível
- **JSON**: Dados estruturados

---

## 10. FUNCIONALIDADE 8: VISUALIZAÇÃO DE TOPOLOGIA DE REDE

### 10.1 Objetivo
Visualizar a estrutura física e lógica da rede, mostrando conexões, dependências e status em tempo real.

### 10.2 Tipos de Topologia

#### 10.2.1 Topologia Física
- **Dispositivos**: Ícones representando cada dispositivo
- **Conexões**: Linhas mostrando conexões de rede
- **Localização**: Posicionamento baseado em localização real
- **Status**: Cor indicando online/offline/alerta

#### 10.2.2 Topologia Lógica
- **Subnets**: Agrupamento por rede
- **VLANs**: Separação por VLAN
- **Dependências**: Relacionamentos entre serviços
- **Fluxo de dados**: Direção do tráfego

#### 10.2.3 Topologia de Dependências
- **Serviços**: Nós representando serviços
- **Relacionamentos**: Arestas mostrando dependências
- **Impacto**: Visualização de impacto de falha
- **Cascata**: Efeito em cascata de falhas

### 10.3 Interatividade

#### 10.3.1 Navegação
- **Zoom**: Aproximar/afastar
- **Pan**: Arrastar para navegar
- **Filtro**: Mostrar/ocultar tipos de dispositivos
- **Busca**: Destacar dispositivo específico

#### 10.3.2 Seleção
- **Clique**: Selecionar dispositivo
- **Detalhes**: Mostrar informações ao lado
- **Histórico**: Visualizar histórico de métricas
- **Ações**: Drill-down para dashboard do dispositivo

#### 10.3.3 Animação
- **Tráfego**: Animação mostrando fluxo de dados
- **Pulso**: Indicador visual de atividade
- **Transição**: Suave ao mudar estado

### 10.4 Algoritmos de Layout

#### 10.4.1 Opções de Layout
- **Hierárquico**: Camadas (core, distribution, access)
- **Força-dirigido**: Nós se repelem, arestas se atraem
- **Circular**: Nós em círculo
- **Radial**: Centro com camadas concêntricas
- **Customizado**: Posicionamento manual

#### 10.4.2 Persistência
- **Salvar layout**: Posições dos nós são salvas
- **Restaurar**: Ao recarregar, layout é restaurado
- **Reset**: Opção de recalcular layout

### 10.5 Dados Exibidos

#### 10.5.1 Ícones e Cores
- **Tipo de dispositivo**: Ícone específico (servidor, switch, etc.)
- **Status**: Cor (verde=online, vermelho=offline, amarelo=alerta)
- **Criticidade**: Tamanho do ícone ou borda
- **Carga**: Intensidade da cor

#### 10.5.2 Labels
- **Nome**: Identificação do dispositivo
- **IP**: Endereço IP
- **Métrica**: Valor atual (CPU, latência, etc.)
- **Alerta**: Ícone de alerta se houver

#### 10.5.3 Tooltips
- **Hover**: Mostrar informações ao passar mouse
- **Conteúdo**: Nome, IP, status, última métrica
- **Ação**: Botão para abrir detalhes

---

## 11. FUNCIONALIDADE 9: ANÁLISE DE TRÁFEGO DE REDE

### 11.1 Objetivo
Analisar padrões de tráfego, identificar consumidores de banda e detectar anomalias.

### 11.2 Estatísticas de Protocolos

#### 11.2.1 Distribuição por Protocolo
- **TCP**: Porcentagem de tráfego TCP
- **UDP**: Porcentagem de tráfego UDP
- **ICMP**: Porcentagem de ICMP
- **Outros**: Outros protocolos
- **Gráfico**: Pizza ou barra mostrando distribuição

#### 11.2.2 Aplicações
- **HTTP/HTTPS**: Tráfego web
- **DNS**: Consultas DNS
- **SSH**: Acesso remoto
- **FTP**: Transferência de arquivos
- **Email**: SMTP, POP3, IMAP
- **VPN**: Tráfego criptografado
- **Streaming**: Vídeo, áudio
- **Outros**: Aplicações customizadas

### 11.3 Top Talkers

#### 11.3.1 Por IP
- **Origem**: IPs que mais enviam dados
- **Destino**: IPs que mais recebem dados
- **Bidirecional**: Pares com maior tráfego
- **Período**: Últimas 24h, 7d, 30d

#### 11.3.2 Por Porta
- **Origem**: Portas que mais enviam
- **Destino**: Portas que mais recebem
- **Serviço**: Serviço associado à porta
- **Protocolo**: TCP ou UDP

#### 11.3.3 Visualização
- **Tabela**: Ranking com valores
- **Gráfico**: Barra horizontal
- **Mapa de calor**: Matriz origem x destino

### 11.4 Detecção de Anomalias

#### 11.4.1 Técnicas
- **Baseline**: Comparação com padrão normal
- **Desvio padrão**: Alertar se > 2σ
- **Tendência**: Crescimento anormal
- **Sazonal**: Ajuste para padrões sazonais

#### 11.4.2 Tipos de Anomalias
- **Tráfego anormal**: Volume muito alto/baixo
- **Padrão anormal**: Protocolo incomum em horário incomum
- **Novo fluxo**: Comunicação nunca vista antes
- **Possível ataque**: Padrão de varredura de porta

#### 11.4.3 Alertas
- **Threshold**: Limite de tráfego
- **Duração**: Mínimo de tempo antes de alertar
- **Severidade**: Baseada em tipo de anomalia
- **Ação**: Captura automática de pacotes

### 11.5 Relatórios de Tráfego

#### 11.5.1 Conteúdo
- **Resumo**: Estatísticas gerais
- **Top talkers**: Ranking de IPs/portas
- **Protocolos**: Distribuição por protocolo
- **Tendências**: Crescimento/redução
- **Anomalias**: Eventos anormais detectados

#### 11.5.2 Período
- **Diário**: Relatório do dia anterior
- **Semanal**: Resumo da semana
- **Mensal**: Análise do mês
- **Customizado**: Período específico

#### 11.5.3 Formato
- **Email**: Enviado automaticamente
- **PDF**: Relatório formatado
- **HTML**: Visualização interativa
- **CSV**: Dados brutos

---

## 12. FUNCIONALIDADE 10: FERRAMENTAS AVANÇADAS PARA ADMINS

### 12.1 Auto-Remediação (Self-healing)

#### 12.1.1 Conceito
Executar ações automáticas em resposta a alertas específicos para tentar resolver problemas sem intervenção humana.

#### 12.1.2 Ações Disponíveis
- **Reiniciar seviço**: `systemctl restart nginx`
- **Limpar disco**: `sudo apt clean && sudo apt autoremove`
- **Reiniciar servidor**: `reboot` (com aprovação)
- **Bloquear IP**: Adicionar regra no firewall
- **Webhook**: Chamar API externa

#### 12.1.3 Segurança
- **Aprovação**: Exigir aprovação manual para ações críticas
- **Limite**: Máximo de execuções por hora
- **Audit Log**: Registro detalhado de todas as ações automáticas
- **Sandboxing**: Execução em ambiente controlado

### 12.2 Mobile App / PWA

#### 12.2.1 Objetivo
Permitir que administradores monitorem e reajam a incidentes de qualquer lugar.

#### 12.2.2 Funcionalidades
- **Push Notifications**: Alertas críticos em tempo real
- **Dashboard Resumido**: Visão rápida da saúde
- **Ações Rápidas**: Reconhecer alertas, reiniciar serviços
- **Biometria**: Login seguro com FaceID/TouchID
- **Modo Offline**: Cache de dados recentes

### 12.3 Backup de Configurações de Rede

#### 12.3.1 Suporte a Dispositivos
- Switches (Cisco, HP, Juniper)
- Roteadores
- Firewalls

#### 12.3.2 Funcionalidades
- **Backup Agendado**: Diário, semanal
- **Detecção de Mudanças**: Diff entre backups
- **Alerta de Mudança**: Notificar se config mudou
- **Restore**: Repositório de versões anteriores
- **Compliance**: Verificar se config atende padrões

### 12.4 Integração com Ticketing (ITSM)

#### 12.4.1 Ferramentas
- Jira, ServiceNow, Zendesk, GLPI

#### 12.4.2 Fluxo
- **Criação Automática**: Alerta crítico -> Ticket
- **Atualização**: Novos detalhes adicionados ao ticket
- **Fechamento**: Alerta resolvido -> Ticket fechado
- **Sincronização**: Comentários syncados bidirecionalmente

---

## 13. FUNCIONALIDADE 11: SISTEMA DE RELATÓRIOS

### 13.1 Objetivo
Gerar relatórios automáticos e customizáveis para análise de performance, disponibilidade e conformidade.

### 13.2 Tipos de Relatórios

#### 13.2.1 Relatório de Performance
- **Período**: Dia, semana, mês, trimestre, ano
- **Métricas**: CPU, memória, disco, rede
- **Estatísticas**: Média, máximo, mínimo, P95
- **Gráficos**: Série temporal, distribuição
- **Comparação**: Período atual vs. período anterior

#### 13.2.2 Relatório de Disponibilidade
- **Uptime**: Percentual de tempo online
- **Downtime**: Períodos de indisponibilidade
- **MTBF**: Tempo médio entre falhas
- **MTTR**: Tempo médio para recuperação
- **SLA**: Conformidade com SLA

#### 13.2.3 Relatório de Capacidade
- **Utilização**: Percentual de utilização
- **Tendência**: Crescimento ao longo do tempo
- **Projeção**: Quando atingirá capacidade máxima
- **Recomendação**: Quando fazer upgrade
- **Custo**: Impacto financeiro

#### 13.2.4 Relatório de Segurança
- **Vulnerabilidades**: Portas abertas incomuns
- **Mudanças**: Novos serviços descobertos
- **Anomalias**: Tráfego anormal
- **Alertas**: Eventos de segurança
- **Conformidade**: Checklist de segurança

#### 13.2.5 Relatório de Incidentes
- **Resumo**: Número de incidentes
- **Severidade**: Distribuição por severidade
- **Tempo de resposta**: Tempo até primeira resposta
- **Tempo de resolução**: Tempo até resolução
- **Causas**: Análise de causa raiz

### 13.3 Customização de Relatórios

#### 13.3.1 Seleção de Dados
- **Dispositivos**: Selecionar quais incluir
- **Métricas**: Escolher quais métricas
- **Período**: Data inicial e final
- **Filtros**: Aplicar filtros adicionais

#### 13.3.2 Formatação
- **Tema**: Cores, logo, branding
- **Seções**: Incluir/excluir seções
- **Gráficos**: Tipo de gráfico para cada métrica
- **Tabelas**: Detalhes ou resumo

#### 13.3.3 Distribuição
- **Agendamento**: Diário, semanal, mensal
- **Destinatários**: Email, Slack, etc.
- **Formato**: PDF, HTML, Excel
- **Timezone**: Fuso horário para datas

### 13.4 Templates de Relatórios

#### 13.4.1 Pré-definidos
- **Executive Summary**: Visão geral para gerentes
- **Technical Report**: Detalhes técnicos para TI
- **SLA Report**: Conformidade com SLA
- **Capacity Planning**: Planejamento de capacidade
- **Security Report**: Análise de segurança

#### 13.4.2 Customizados
- **Salvar como template**: Reutilizar configuração
- **Clonar**: Duplicar template existente
- **Compartilhar**: Compartilhar com outros usuários

### 13.5 Geração e Distribuição

#### 13.5.1 Geração
- **Manual**: Gerar sob demanda
- **Agendada**: Automática em horário específico
- **Sob demanda**: Via API
- **Histórico**: Manter últimos 12 meses

#### 13.5.2 Armazenamento
- **S3**: Armazenamento de longo prazo
- **Retenção**: Configurável (1 ano padrão)
- **Compressão**: Gzip para economizar espaço
- **Acesso**: Download ou link compartilhável

#### 13.5.3 Notificação
- **Email**: Enviar relatório por email
- **Link**: Incluir link para download
- **Resumo**: Incluir resumo no email
- **Anexo**: Anexar PDF (se pequeno)

---

## 14. MODELO DE DADOS

### 14.1 Banco de Dados Principal (MySQL/TiDB)

#### 14.1.1 Tabelas Principais

```sql
-- Usuários e Autenticação
users (id, openId, name, email, role, createdAt, updatedAt)

-- Ativos de Rede
network_assets (
  id, name, ip, mac, hostname, asset_type, 
  os, os_version, status, location, owner,
  criticality, last_seen, discovered_at, updated_at
)

-- Serviços Descobertos
network_services (
  id, asset_id, port, protocol, service_name,
  service_version, discovered_at, last_seen
)

-- Grupos de Ativos
asset_groups (
  id, name, description, parent_id, type,
  created_at, updated_at
)

-- Membros de Grupos
asset_group_members (
  id, group_id, asset_id
)

-- Tags
tags (id, name, color, created_at)

-- Associação de Tags
asset_tags (id, asset_id, tag_id)

-- Regras de Alerta
alert_rules (
  id, name, description, condition, severity,
  enabled, silenced_until, created_by, created_at, updated_at
)

-- Alertas Gerados
alerts (
  id, rule_id, asset_id, metric_name, value,
  threshold, severity, status, acknowledged_by,
  acknowledged_at, resolved_at, created_at
)

-- Políticas de Escalação
escalation_policies (
  id, name, description, created_at, updated_at
)

-- Níveis de Escalação
escalation_levels (
  id, policy_id, level, delay_minutes, contact_method,
  recipient_group, created_at
)

-- Histórico de Scans
scan_history (
  id, scan_type, started_at, completed_at, 
  status, results_count, created_at
)

-- Configuração de Monitoramento
monitoring_config (
  id, asset_id, metric_name, enabled, interval,
  retention_days, alert_threshold, created_at, updated_at
)

-- Sessões de Captura de Pacotes
packet_captures (
  id, name, interface, filter, started_at, 
  ended_at, packet_count, file_size, s3_key,
  status, created_by, created_at
)

-- Relatórios Agendados
scheduled_reports (
  id, name, template_type, devices, metrics,
  period, schedule, recipients, format,
  enabled, created_by, created_at, updated_at
)

-- Histórico de Relatórios
report_history (
  id, scheduled_report_id, generated_at, 
  file_size, s3_key, status, created_at
)

-- Auditoria de Mudanças
audit_log (
  id, user_id, entity_type, entity_id, action,
  old_value, new_value, created_at
)
```

### 14.2 Time Series Database (InfluxDB ou TimescaleDB)

#### 14.2.1 Estrutura de Métricas

```
Measurement: system_metrics
Tags: device_id, metric_name, location, asset_group
Fields: value (float), unit (string)
Timestamp: Unix timestamp

Exemplo:
device_id=server-01, metric_name=cpu_usage, location=dc1, asset_group=production
value=45.2, unit=percent
timestamp=1705689600000
```

#### 14.2.2 Políticas de Retenção
- 1 minuto: 7 dias
- 5 minutos: 30 dias (agregação)
- 1 hora: 1 ano (agregação)
- 1 dia: 5 anos (agregação)

### 14.3 Cache (Redis)

#### 14.3.1 Estrutura
- `device:{id}:metrics`: Últimas métricas de um dispositivo
- `alerts:active`: Alertas ativos no momento
- `dashboard:summary`: Resumo do dashboard
- `scan:results:{id}`: Resultados de scan
- `session:{user_id}`: Dados de sessão

---

## 15. FLUXO DE DADOS

### 15.1 Coleta de Métricas

```
Agente no Host
    ↓
Coleta de métricas (CPU, memória, disco, etc.)
    ↓
Compressão e validação
    ↓
Envio para Servidor Central (POST /api/metrics)
    ↓
Validação e deduplicação
    ↓
Enriquecimento (metadados)
    ↓
Armazenamento em TSDB
    ↓
Atualização de cache quente
    ↓
Processamento de alertas
    ↓
Notificação se necessário
```

### 15.2 Geração de Alertas

```
Nova métrica recebida
    ↓
Comparação com regras de alerta
    ↓
Avaliação de condição
    ↓
Se condição verdadeira:
    ├→ Criar alerta
    ├→ Determinar severidade
    ├→ Verificar deduplicação
    ├→ Aplicar escalação
    └→ Enviar notificação
```

### 15.3 Scanning de Rede

```
Agendamento de scan
    ↓
Execução de Nmap
    ↓
Parsing de resultados
    ↓
Comparação com scan anterior
    ↓
Identificação de mudanças
    ↓
Armazenamento em banco de dados
    ↓
Criação de alertas para mudanças
    ↓
Adição automática de novos hosts ao monitoramento
```

### 15.4 Captura de Pacotes

```
Trigger (manual ou automático)
    ↓
Iniciar tcpdump com filtro
    ↓
Capturar pacotes em arquivo PCAP
    ↓
Análise em tempo real
    ├→ Estatísticas de protocolo
    ├→ Top talkers
    └→ Detecção de anomalias
    ↓
Ao finalizar:
    ├→ Compressão
    ├→ Upload para S3
    └→ Armazenamento de metadados
```

---

## 16. COMPONENTES DE INFRAESTRUTURA

### 16.1 Servidores

#### 16.1.1 Servidor Principal
- **CPU**: 8+ cores
- **RAM**: 32+ GB
- **Armazenamento**: 500+ GB SSD
- **Rede**: 1 Gbps+
- **SO**: Linux (Ubuntu 22.04+)

#### 16.1.2 Servidor de Banco de Dados
- **CPU**: 8+ cores
- **RAM**: 64+ GB
- **Armazenamento**: 2+ TB SSD
- **Replicação**: Standby para HA

#### 16.1.3 Servidor de TSDB
- **CPU**: 16+ cores
- **RAM**: 128+ GB
- **Armazenamento**: 10+ TB SSD
- **Compressão**: Agressiva para economizar espaço

### 16.2 Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 3000 | Interface web |
| Backend API | 3001 | API tRPC |
| TSDB | 8086 | InfluxDB |
| Redis | 6379 | Cache |
| MySQL | 3306 | Banco principal |
| RabbitMQ | 5672 | Fila de mensagens |

### 16.3 Agentes

#### 16.3.1 Agente de Coleta
- Instalado em cada host monitorado
- Coleta periódica de métricas
- Suporta Windows, Linux, macOS
- Configuração remota

#### 16.3.2 Agente de Scanning
- Executa Nmap periodicamente
- Descoberta de novos hosts
- Detecção de mudanças
- Notificação de anomalias

---

## 17. SEGURANÇA

### 17.1 Autenticação
- OAuth 2.0 via Manus
- Sessões com JWT
- Refresh tokens com expiração

### 17.2 Autorização
- RBAC: Admin, Operator, Viewer
- Permissões granulares por dispositivo/grupo
- Auditoria de todas as ações

### 17.3 Comunicação
- HTTPS/TLS para todas as conexões
- Certificados autoassinados ou Let's Encrypt
- Validação de certificados

### 17.4 Dados
- Criptografia em repouso (opcional)
- Criptografia em trânsito (obrigatório)
- Backup criptografado
- Retenção de dados conforme política

---

## 18. ESCALABILIDADE

### 18.1 Horizontal Scaling
- **Agentes**: Múltiplos agentes por host
- **Coletores**: Múltiplos servidores de coleta
- **Banco de dados**: Replicação e sharding
- **TSDB**: Clustering e replicação

### 18.2 Vertical Scaling
- Aumentar CPU/RAM conforme necessário
- Upgrade de armazenamento
- Otimização de índices

### 18.3 Limites
- **Dispositivos**: 100.000+
- **Métricas por dispositivo**: 1.000+
- **Taxa de coleta**: 1 milhão de métricas/minuto
- **Usuários simultâneos**: 1.000+

---

## 19. ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Fundação (Semanas 1-4)
- [ ] Setup de infraestrutura
- [ ] Banco de dados e TSDB
- [ ] API backend básica
- [ ] Autenticação e autorização
- [ ] Dashboard principal (versão 1)

### Fase 2: Coleta de Dados (Semanas 5-8)
- [ ] Agente de coleta
- [ ] Coleta de métricas básicas
- [ ] Armazenamento em TSDB
- [ ] Gráficos de série temporal
- [ ] Cache de dados quentes

### Fase 3: Alertas (Semanas 9-12)
- [ ] Regras de alerta
- [ ] Sistema de notificações
- [ ] Escalação de alertas
- [ ] Dashboard de alertas
- [ ] Histórico de alertas

### Fase 4: Scanning de Rede (Semanas 13-16)
- [ ] Integração com Nmap
- [ ] Descoberta automática
- [ ] Detecção de mudanças
- [ ] Gerenciamento de ativos
- [ ] Histórico de scans

### Fase 5: Funcionalidades Avançadas para Admins (Semanas 17-20)
- [ ] Mobile App / PWA
- [ ] Backup de Configurações
- [ ] Auto-remediação
- [ ] Integração com Tickets
- [ ] RBAC Avançado

### Fase 6: Análise de Tráfego (Semanas 21-24)
- [ ] Integração com tcpdump
- [ ] Captura de pacotes
- [ ] Análise em tempo real
- [ ] Detecção de anomalias
- [ ] Exportação de resultados

### Fase 7: Topologia de Rede (Semanas 25-28)
- [ ] Visualização de topologia
- [ ] Mapa interativo
- [ ] Detecção de dependências
- [ ] Animação de tráfego
- [ ] Drill-down de informações

### Fase 8: Relatórios (Semanas 29-32)
- [ ] Templates de relatórios
- [ ] Geração automática
- [ ] Agendamento
- [ ] Distribuição por email
- [ ] Histórico de relatórios

### Fase 9: Otimizações e Polimento (Semanas 33-36)
- [ ] Performance tuning
- [ ] Testes de carga
- [ ] Documentação
- [ ] Treinamento
- [ ] Deployment em produção

---

## 20. MÉTRICAS DE SUCESSO

### 20.1 Performance
- Latência de coleta: < 5 segundos
- Latência de dashboard: < 2 segundos
- Uptime: > 99.5%
- Taxa de erro: < 0.1%

### 20.2 Funcionalidade
- Cobertura de dispositivos: > 95%
- Acurácia de alertas: > 95%
- Tempo de detecção: < 5 minutos
- Taxa de falsos positivos: < 5%

### 20.3 Usabilidade
- Tempo de setup: < 1 hora
- Tempo para encontrar informação: < 2 minutos
- Satisfação do usuário: > 4/5
- Taxa de adoção: > 80%

---

## 21. PRÓXIMOS PASSOS

1. **Validação**: Apresentar plano ao stakeholder para feedback
2. **Refinamento**: Ajustar baseado em feedback
3. **Prototipagem**: Criar protótipos de UI/UX
4. **Especificação Técnica**: Detalhar componentes específicos
5. **Implementação**: Começar desenvolvimento conforme fases
6. **Testes**: Testes de funcionalidade, performance, segurança
7. **Deployment**: Colocar em produção com monitoramento
8. **Manutenção**: Suporte contínuo e melhorias

---

**Documento preparado em**: 19 de janeiro de 2026
**Versão**: 1.0
**Status**: Plano Detalhado Completo

# Consolidação de Documentação e Roadmaps - Netwall

Este arquivo contém a consolidação de todos os arquivos Markdown (.md) e Roadmaps encontrados no repositório.

## Sumário

1. [COMPARACAO_ZABBIX_PRTG.md](#comparacao_zabbix_prtg-md)
2. [Inventario.md](#inventario-md)
3. [PLANO_DETALHADO_SISTEMA_MONITORAMENTO.md](#plano_detalhado_sistema_monitoramento-md)
4. [Recomendações para Implementação do NetMonitor Pro.md](#recomendações para implementação do netmonitor pro-md)
5. [apps/agent/INSTALL_WINDOWS.md](#apps-agent-install_windows-md)
6. [docs/GUACAMOLE_INSTALL.md](#docs-guacamole_install-md)
7. [docs/INSTALL.md](#docs-install-md)
8. [docs/MONITORING.md](#docs-monitoring-md)

---

<a name="comparacao_zabbix_prtg-md"></a>
## Arquivo: COMPARACAO_ZABBIX_PRTG.md

# Comparação Detalhada: Zabbix vs PRTG
## Funcionalidades de Monitoramento de Rede conforme Plano NetMonitor Pro

---

## 1. VISÃO GERAL COMPARATIVA

| Aspecto | Zabbix | PRTG |
|---------|--------|------|
| **Modelo de Licença** | Open Source (Gratuito) | Proprietário (Pago) |
| **Modelo de Coleta** | Agentes + SNMP + Agentless | Sensores (baseado em probes) |
| **Escalabilidade** | Excelente (proxies ilimitados) | Boa (probes remotas) |
| **Curva de Aprendizado** | Íngreme | Moderada |
| **Suporte Comercial** | Disponível (pago) | Incluído |
| **Comunidade** | Muito ativa | Ativa |
| **Customização** | Muito flexível | Moderadamente flexível |

---

## 2. FUNCIONALIDADE 1: DASHBOARD PRINCIPAL

### 2.1 Zabbix

#### Pontos Fortes
- **Dashboards widget-based**: Múltiplas páginas com widgets customizáveis
- **Drag-and-drop**: Posicionamento livre de widgets
- **Filtros avançados**: Filtrar dados por múltiplos critérios
- **Permissões granulares**: Controle de acesso por widget
- **Refresh automático**: Configurável por dashboard
- **Widgets disponíveis**: Gráficos, mapas, problemas, SLA, geo-maps
- **Clonagem**: Duplicar dashboards existentes
- **Público/Privado**: Compartilhamento de dashboards

#### Limitações
- Interface pode parecer datada
- Requer conhecimento técnico para customizações avançadas
- Performance pode degradar com muitos widgets em tempo real

### 2.2 PRTG

#### Pontos Fortes
- **Interface moderna**: Design mais intuitivo e visual
- **Mapas em tempo real**: Visualização de status com animações
- **Designer de mapas**: Ferramenta visual para criar mapas customizados
- **Apps mobile**: Aplicativos nativos para iOS/Android
- **Desktop app**: Aplicação desktop para gerenciamento
- **Dashboards responsivos**: Adapta-se a diferentes tamanhos de tela
- **Múltiplas interfaces**: Web, desktop, mobile

#### Limitações
- Menos flexibilidade em customizações avançadas
- Custo de licença pode ser alto para grandes ambientes
- Menos widgets disponíveis que Zabbix

### 2.3 Comparação com Plano NetMonitor Pro

| Requisito do Plano | Zabbix | PRTG | NetMonitor Pro |
|-------------------|--------|------|-----------------|
| Visão geral em tempo real | ✅ Excelente | ✅ Excelente | ✅ Implementar ambos |
| Status de alertas | ✅ Completo | ✅ Completo | ✅ Implementar |
| Métricas críticas | ✅ Sim | ✅ Sim | ✅ Implementar |
| Atualização em tempo real | ✅ WebSocket | ✅ Polling | ✅ WebSocket/SSE |
| Customização visual | ✅ Muito | ⚠️ Moderada | ✅ Total controle |

---

## 3. FUNCIONALIDADE 2: MONITORAMENTO DE DISPOSITIVOS

### 3.1 Zabbix

#### Pontos Fortes
- **Agente Zabbix**: Coleta ativa de métricas com baixo overhead
- **Métricas suportadas**: CPU, memória, disco, rede, processos, temperatura
- **Intervalo configurável**: Por item, por host, por template
- **Histórico completo**: Armazenamento de dados históricos
- **Agregação automática**: Cálculo de médias, máximos, mínimos
- **Preprocessing**: Transformação de dados antes do armazenamento
- **Templates**: Reutilização de configurações
- **Auto-discovery**: Descoberta automática de itens em hosts

#### Limitações
- Agente requer instalação em cada host
- Overhead de rede pode ser alto com muitos hosts
- Configuração inicial complexa

### 3.2 PRTG

#### Pontos Fortes
- **Sensores pré-configurados**: 200+ tipos de sensores prontos para uso
- **Sem agente**: Monitoramento agentless (SNMP, WMI, etc.)
- **Fácil setup**: Descoberta automática de sensores
- **Sensores customizados**: Criar sensores personalizados
- **Escalabilidade**: Suporte para múltiplos probes
- **Recomendações AI**: Sugestões automáticas de sensores
- **Monitoramento de aplicações**: Suporte para aplicações específicas

#### Limitações
- Menos controle granular sobre intervalos
- Menos flexibilidade em transformações de dados
- Custo por sensor em algumas edições

### 3.3 Comparação com Plano NetMonitor Pro

| Métrica | Zabbix | PRTG | NetMonitor Pro |
|---------|--------|------|-----------------|
| CPU | ✅ Sim | ✅ Sim | ✅ Implementar |
| Memória | ✅ Sim | ✅ Sim | ✅ Implementar |
| Disco | ✅ Sim | ✅ Sim | ✅ Implementar |
| Latência | ✅ Sim (ICMP) | ✅ Sim | ✅ Implementar |
| Uptime | ✅ Sim | ✅ Sim | ✅ Implementar |
| Tráfego de rede | ✅ Sim | ✅ Sim | ✅ Implementar |
| Conexões TCP | ✅ Sim | ✅ Sim | ✅ Implementar |
| Processos | ✅ Sim | ✅ Sim | ✅ Implementar |
| Temperatura | ✅ Sim | ✅ Sim | ✅ Implementar |
| Disco I/O | ✅ Sim | ✅ Sim | ✅ Implementar |

---

## 4. FUNCIONALIDADE 3: SCANNING DE REDE COM NMAP

### 4.1 Zabbix

#### Pontos Fortes
- **Network discovery**: Descoberta automática de hosts
- **Técnicas de descoberta**: ICMP, ARP, TCP, UDP
- **Agente auto-registration**: Agentes se registram automaticamente
- **Regras de descoberta**: Flexíveis e customizáveis
- **Ações automáticas**: Criar hosts automaticamente após descoberta
- **Histórico de descoberta**: Rastreamento de mudanças

#### Limitações
- Não usa Nmap nativamente (usa próprio mecanismo)
- Menos detalhado em detecção de serviços
- Não faz fingerprinting de SO tão robusto quanto Nmap

### 4.2 PRTG

#### Pontos Fortes
- **Network discovery**: Descoberta automática com IP ranges
- **Auto-sensing**: Detecta automaticamente tipos de sensores
- **IP scanner**: Ferramenta integrada para scanning
- **Detecção de dispositivos**: Identifica tipos de dispositivos
- **Agrupamento automático**: Agrupa dispositivos por tipo
- **Atualização periódica**: Redescoberta automática

#### Limitações
- Não usa Nmap (usa próprio scanner)
- Menos detalhado em fingerprinting de SO
- Menos controle sobre parâmetros de scan

### 4.3 Integração com Nmap

#### Zabbix + Nmap
- Possível via scripts customizados
- Nmap pode ser executado como item externo
- Resultados podem ser importados
- Menos integrado que PRTG

#### PRTG + Nmap
- Não há integração nativa
- Possível via scripts customizados
- Requer desenvolvimento adicional
- Menos prático que Zabbix

#### NetMonitor Pro
- **Integração nativa com Nmap**: Wrapper Node.js para executar Nmap
- **Parsing automático**: Análise de resultados em JSON
- **Armazenamento estruturado**: Dados em banco de dados
- **Alertas de mudanças**: Notificação de novas portas/serviços
- **Histórico completo**: Rastreamento de todas as mudanças

### 4.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Descoberta de hosts | ✅ Sim | ✅ Sim | ✅ Nmap nativo |
| Detecção de portas | ⚠️ Limitada | ⚠️ Limitada | ✅ Nmap completo |
| Detecção de serviços | ⚠️ Limitada | ⚠️ Limitada | ✅ Nmap completo |
| Fingerprinting de SO | ❌ Não | ❌ Não | ✅ Nmap completo |
| Scan periódico | ✅ Sim | ✅ Sim | ✅ Configurável |
| Histórico de mudanças | ✅ Sim | ✅ Sim | ✅ Completo |
| Alertas de mudanças | ✅ Sim | ✅ Sim | ✅ Automático |

---

## 5. FUNCIONALIDADE 4: CAPTURA E ANÁLISE DE PACOTES

### 5.1 Zabbix

#### Pontos Fortes
- Não é o foco principal
- Pode integrar com ferramentas externas
- Suporta coleta de dados de SNMP (que inclui estatísticas de tráfego)

#### Limitações
- **Sem captura nativa de pacotes**: Não tem tcpdump integrado
- Não faz análise de tráfego em tempo real
- Requer integração com ferramentas externas

### 5.2 PRTG

#### Pontos Fortes
- **Packet Sniffer Sensor**: Captura de pacotes integrada
- **Análise de tráfego**: Estatísticas de protocolo em tempo real
- **Filtros BPF**: Suporte a filtros Berkeley Packet Filter
- **Top talkers**: Identificação de maiores consumidores de banda
- **Histórico**: Armazenamento de dados de tráfego
- **Integração com SPAN**: Suporte a Switched Port Analyzer

#### Limitações
- Menos flexível que tcpdump puro
- Análise limitada a protocolos pré-definidos
- Não faz análise forense profunda

### 5.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Tcpdump nativo**: Captura completa com filtros personalizáveis
- **Análise em tempo real**: Processamento de pacotes conforme capturados
- **Filtros avançados**: Expressões BPF complexas
- **Exportação PCAP**: Análise em Wireshark
- **Triggers automáticos**: Captura ao detectar anomalia
- **Análise forense**: Reconstrução de fluxos de dados

### 5.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Captura de pacotes | ❌ Não | ✅ Sim | ✅ Tcpdump nativo |
| Filtros BPF | ❌ Não | ✅ Sim | ✅ Completo |
| Análise em tempo real | ❌ Não | ✅ Sim | ✅ Avançada |
| Exportação PCAP | ❌ Não | ⚠️ Limitada | ✅ Completo |
| Triggers automáticos | ❌ Não | ⚠️ Limitado | ✅ Sim |
| Análise forense | ❌ Não | ⚠️ Limitada | ✅ Completo |

---

## 6. FUNCIONALIDADE 5: GRÁFICOS INTERATIVOS

### 6.1 Zabbix

#### Pontos Fortes
- **Gráficos customizáveis**: Múltiplas opções de visualização
- **Série temporal**: Suporte completo com zoom e pan
- **Agregação automática**: Redução de dados para períodos longos
- **Comparação temporal**: Comparar períodos diferentes
- **Exportação**: PNG, CSV, PDF
- **Histogramas**: Distribuição de valores
- **Gráficos de stack**: Visualização de múltiplas séries
- **Correlação**: Visualizar relação entre métricas

#### Limitações
- Interface menos moderna
- Performance pode sofrer com muitos dados
- Customização requer conhecimento técnico

### 6.2 PRTG

#### Pontos Fortes
- **Gráficos modernos**: Interface visual mais atraente
- **Múltiplos tipos**: Linha, barra, pizza, gauge
- **Drill-down**: Clicar para ver detalhes
- **Responsivo**: Adapta-se a diferentes tamanhos
- **Exportação**: PNG, PDF, CSV
- **Comparação**: Período atual vs. período anterior
- **Tendências**: Visualização de crescimento

#### Limitações
- Menos tipos de gráficos que Zabbix
- Menos customização em detalhes
- Análise correlativa limitada

### 6.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Recharts/Chart.js**: Biblioteca moderna e responsiva
- **Interatividade avançada**: Hover, click, zoom suave
- **Agregação inteligente**: Redução automática baseada no período
- **Múltiplos tipos**: Série temporal, distribuição, scatter, heatmap, gauge
- **Comparação temporal**: Hoje vs. ontem, semana vs. semana
- **Drill-down profundo**: Clicar em ponto para ver detalhes
- **Exportação completa**: PNG, SVG, CSV, PDF
- **Performance**: Cache de gráficos renderizados

### 6.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Série temporal | ✅ Sim | ✅ Sim | ✅ Avançada |
| Comparação temporal | ✅ Sim | ✅ Sim | ✅ Múltiplas opções |
| Distribuição | ✅ Sim | ✅ Sim | ✅ Completa |
| Correlação | ✅ Sim | ⚠️ Limitada | ✅ Completa |
| Gauge/Status | ✅ Sim | ✅ Sim | ✅ Sim |
| Drill-down | ✅ Sim | ✅ Sim | ✅ Profundo |
| Exportação | ✅ Sim | ✅ Sim | ✅ Completa |
| Performance | ⚠️ Moderada | ✅ Boa | ✅ Excelente |

---

## 7. FUNCIONALIDADE 6: SISTEMA DE ALERTAS

### 7.1 Zabbix

#### Pontos Fortes
- **Triggers flexíveis**: Expressões complexas com funções
- **Múltiplas severidades**: Crítico, Alto, Médio, Baixo, Informativo
- **Correlação de problemas**: Root cause analysis
- **Escalação**: Políticas de escalação customizáveis
- **Múltiplos canais**: Email, SMS, Webhooks, Slack, Teams, etc.
- **Mensagens customizadas**: Macros para personalização
- **Suppressão**: Suprimir alertas por período
- **Auto-remediation**: Executar ações automáticas
- **Detecção de anomalias**: Machine learning integrado
- **Trend prediction**: Previsão de tendências

#### Limitações
- Configuração inicial complexa
- Muitas opções podem ser confusas
- Requer conhecimento técnico

### 7.2 PRTG

#### Pontos Fortes
- **Sensores com thresholds**: Fácil de configurar
- **Notificações**: Email, SMS, push, HTTP
- **Escalação**: Suporte a múltiplos níveis
- **Silenciamento**: Pausar notificações por período
- **Ações**: Executar scripts ao alertar
- **Múltiplos canais**: Integração com sistemas externos
- **Detecção de anomalias**: AI-driven baselines
- **Interface simples**: Menos opções, mais direto

#### Limitações
- Menos flexível em expressões complexas
- Menos opções de customização
- Correlação limitada

### 7.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Regras baseadas em expressões**: Lógica complexa
- **Múltiplos tipos de alertas**: Threshold, anomalia, correlação, eventos
- **Escalação automática**: Múltiplos níveis com delays
- **Grupos de contato**: Organização por função/horário
- **Deduplicação**: Evitar spam de alertas
- **Histórico completo**: Rastreamento de todos os alertas
- **Análise de padrões**: Identificar alertas falsos positivos
- **Integração com captura**: Capturar pacotes ao alertar

### 7.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Threshold estático | ✅ Sim | ✅ Sim | ✅ Sim |
| Threshold dinâmico | ✅ Sim | ✅ Sim (AI) | ✅ Sim |
| Anomalia | ✅ Sim | ✅ Sim (AI) | ✅ Sim |
| Correlação | ✅ Sim | ⚠️ Limitada | ✅ Completa |
| Severidades | ✅ 5 níveis | ✅ Customizável | ✅ 5 níveis |
| Escalação | ✅ Sim | ✅ Sim | ✅ Avançada |
| Canais | ✅ Muitos | ✅ Vários | ✅ Extensível |
| Deduplicação | ✅ Sim | ⚠️ Limitada | ✅ Completa |
| Histórico | ✅ Sim | ✅ Sim | ✅ Completo |

---

## 8. FUNCIONALIDADE 7: GERENCIAMENTO DE ATIVOS

### 8.1 Zabbix

#### Pontos Fortes
- **Inventário**: Informações de hardware/software
- **Templates**: Reutilização de configurações
- **Grupos de hosts**: Organização hierárquica
- **Macros**: Customização por host/grupo
- **Tags**: Categorização flexível
- **Histórico**: Rastreamento de mudanças
- **API**: Acesso programático aos dados

#### Limitações
- Interface de inventário pode ser complexa
- Menos campos pré-definidos
- Requer customização para casos específicos

### 8.2 PRTG

#### Pontos Fortes
- **Dispositivos**: Cadastro simples de dispositivos
- **Sensores**: Organização por sensores
- **Grupos**: Agrupamento hierárquico
- **Tags**: Categorização
- **Propriedades customizadas**: Campos adicionais
- **Histórico**: Rastreamento de mudanças
- **API**: Acesso aos dados

#### Limitações
- Menos flexível em customizações
- Menos campos pré-definidos
- Menos opções de categorização

### 8.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Informações completas**: Básicas, técnicas, negócio
- **Categorização flexível**: Grupos, tags, múltiplas dimensões
- **Busca avançada**: Múltiplos critérios
- **Histórico de mudanças**: Auditoria completa
- **Importação/exportação**: CSV, Excel, JSON, Nmap
- **Rastreamento de criticidade**: Por ativo
- **SLA por ativo**: Conformidade individual

### 8.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Informações básicas | ✅ Sim | ✅ Sim | ✅ Completas |
| Informações técnicas | ✅ Sim | ✅ Sim | ✅ Completas |
| Informações negócio | ⚠️ Limitadas | ⚠️ Limitadas | ✅ Completas |
| Grupos | ✅ Sim | ✅ Sim | ✅ Hierárquicos |
| Tags | ✅ Sim | ✅ Sim | ✅ Múltiplas |
| Busca avançada | ✅ Sim | ⚠️ Moderada | ✅ Completa |
| Histórico | ✅ Sim | ✅ Sim | ✅ Auditoria |
| Importação | ✅ Sim | ✅ Sim | ✅ Múltiplos formatos |
| Exportação | ✅ Sim | ✅ Sim | ✅ Múltiplos formatos |

---

## 9. FUNCIONALIDADE 8: VISUALIZAÇÃO DE TOPOLOGIA DE REDE

### 9.1 Zabbix

#### Pontos Fortes
- **Network maps**: Mapas de rede customizáveis
- **Ícones**: Múltiplos ícones para diferentes tipos
- **Status visual**: Cores indicando status
- **Relacionamentos**: Mostrar dependências
- **Drill-down**: Clicar para ver detalhes
- **Hierarquia**: Mapas em árvore
- **Exportação**: Imagem do mapa

#### Limitações
- Interface de criação pode ser complexa
- Menos animações
- Performance com muitos dispositivos
- Menos opções de layout

### 9.2 PRTG

#### Pontos Fortes
- **Network maps**: Mapas automáticos e customizáveis
- **Map designer**: Ferramenta visual para criar mapas
- **Status em tempo real**: Atualização contínua
- **Ícones**: Múltiplos ícones disponíveis
- **Cores**: Indicação visual de status
- **Drill-down**: Clicar para ver detalhes
- **Responsivo**: Adapta-se a diferentes tamanhos
- **Múltiplos layouts**: Diferentes formas de organização

#### Limitações
- Menos controle em customizações avançadas
- Menos opções de animação
- Performance com muitos dispositivos

### 9.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Múltiplos tipos de topologia**: Física, lógica, dependências
- **Algoritmos de layout**: Hierárquico, força-dirigido, circular, radial
- **Animação de tráfego**: Visualizar fluxo de dados
- **Interatividade avançada**: Zoom, pan, filtro, busca
- **Status em tempo real**: WebSocket para atualização
- **Drill-down profundo**: Múltiplos níveis
- **Exportação**: SVG, PNG, PDF
- **Persistência**: Salvar posições dos nós

### 9.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Topologia física | ✅ Sim | ✅ Sim | ✅ Sim |
| Topologia lógica | ⚠️ Limitada | ⚠️ Limitada | ✅ Completa |
| Topologia de dependências | ⚠️ Limitada | ⚠️ Limitada | ✅ Completa |
| Algoritmos de layout | ⚠️ Limitados | ⚠️ Limitados | ✅ Múltiplos |
| Animação | ⚠️ Limitada | ⚠️ Limitada | ✅ Avançada |
| Status em tempo real | ✅ Sim | ✅ Sim | ✅ WebSocket |
| Drill-down | ✅ Sim | ✅ Sim | ✅ Profundo |
| Exportação | ✅ Sim | ✅ Sim | ✅ Múltiplos formatos |

---

## 10. FUNCIONALIDADE 9: ANÁLISE DE TRÁFEGO DE REDE

### 10.1 Zabbix

#### Pontos Fortes
- **SNMP traffic**: Coleta de tráfego via SNMP
- **Gráficos de tráfego**: Visualização de largura de banda
- **Histórico**: Dados históricos disponíveis
- **Alertas**: Alertar sobre tráfego anormal

#### Limitações
- **Sem análise de protocolos**: Não analisa protocolos específicos
- Sem análise de top talkers
- Sem detecção de anomalias de tráfego
- Requer integração com ferramentas externas

### 10.2 PRTG

#### Pontos Fortes
- **Packet Sniffer**: Análise de tráfego em tempo real
- **Estatísticas de protocolo**: Distribuição por protocolo
- **Top talkers**: Identificação de maiores consumidores
- **Histórico**: Dados históricos
- **Alertas**: Alertar sobre anomalias
- **NetFlow**: Suporte a NetFlow/sFlow
- **Análise de banda**: Detalhada por protocolo/aplicação

#### Limitações
- Menos detalhado que ferramentas especializadas
- Análise limitada a protocolos pré-definidos
- Menos opções de filtro

### 10.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Tcpdump integrado**: Captura completa de pacotes
- **Análise em tempo real**: Processamento conforme capturado
- **Estatísticas de protocolo**: Completas e detalhadas
- **Top talkers**: Por IP, por porta, por serviço
- **Detecção de anomalias**: Padrões anormais
- **Análise sazonal**: Ajuste para padrões sazonais
- **Histórico**: Dados para análise temporal
- **Exportação**: CSV, JSON, PDF

### 10.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Estatísticas de protocolo | ⚠️ Limitadas | ✅ Sim | ✅ Completas |
| Top talkers | ❌ Não | ✅ Sim | ✅ Sim |
| Detecção de anomalias | ⚠️ Limitada | ✅ Sim | ✅ Avançada |
| Análise sazonal | ❌ Não | ❌ Não | ✅ Sim |
| Histórico | ✅ Sim | ✅ Sim | ✅ Completo |
| Exportação | ✅ Sim | ✅ Sim | ✅ Múltiplos formatos |
| Relatórios | ✅ Sim | ✅ Sim | ✅ Customizáveis |

---

## 11. FUNCIONALIDADE 10: SISTEMA DE RELATÓRIOS

### 11.1 Zabbix

#### Pontos Fortes
- **Relatórios customizáveis**: Múltiplas opções
- **Agendamento**: Geração automática
- **Múltiplos formatos**: PDF, HTML, CSV
- **Distribuição**: Email automático
- **Templates**: Reutilização de configurações
- **Histórico**: Manter relatórios anteriores
- **Permissões**: Controle de acesso

#### Limitações
- Interface de criação complexa
- Menos templates pré-definidos
- Menos opções de formatação

### 11.2 PRTG

#### Pontos Fortes
- **Relatórios customizáveis**: Múltiplas opções
- **Templates**: Vários templates pré-definidos
- **Agendamento**: Geração automática
- **Múltiplos formatos**: PDF, HTML, CSV
- **Distribuição**: Email automático
- **Histórico**: Manter relatórios anteriores
- **Permissões**: Controle de acesso

#### Limitações
- Menos flexível em customizações
- Menos opções de formatação
- Menos tipos de relatórios

### 11.3 NetMonitor Pro

#### Vantagens sobre ambos
- **Múltiplos tipos**: Performance, disponibilidade, capacidade, segurança, incidentes
- **Templates pré-definidos**: Executive, Technical, SLA, Capacity Planning, Security
- **Customização completa**: Seções, gráficos, tabelas
- **Agendamento flexível**: Diário, semanal, mensal, customizado
- **Múltiplos formatos**: PDF, HTML, Excel, CSV
- **Distribuição**: Email, Slack, webhook
- **Histórico**: Últimos 12 meses
- **Branding**: Logo e cores customizáveis

### 11.4 Comparação com Plano NetMonitor Pro

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| Tipos de relatórios | ✅ Vários | ✅ Vários | ✅ Múltiplos |
| Templates | ⚠️ Alguns | ✅ Vários | ✅ Muitos |
| Customização | ✅ Sim | ⚠️ Moderada | ✅ Completa |
| Agendamento | ✅ Sim | ✅ Sim | ✅ Flexível |
| Múltiplos formatos | ✅ Sim | ✅ Sim | ✅ Completos |
| Distribuição | ✅ Email | ✅ Email | ✅ Múltiplos canais |
| Histórico | ✅ Sim | ✅ Sim | ✅ 12 meses |
| Branding | ⚠️ Limitado | ⚠️ Limitado | ✅ Completo |

---

## 12. RESUMO COMPARATIVO GERAL

### 12.1 Matriz de Funcionalidades

| Funcionalidade | Zabbix | PRTG | NetMonitor Pro |
|---------------|--------|------|-----------------|
| 1. Dashboard Principal | ✅✅ | ✅✅ | ✅✅✅ |
| 2. Monitoramento de Dispositivos | ✅✅✅ | ✅✅✅ | ✅✅✅ |
| 3. Scanning de Rede | ✅✅ | ✅✅ | ✅✅✅ |
| 4. Captura de Pacotes | ❌ | ✅✅ | ✅✅✅ |
| 5. Gráficos Interativos | ✅✅ | ✅✅ | ✅✅✅ |
| 6. Sistema de Alertas | ✅✅✅ | ✅✅ | ✅✅✅ |
| 7. Gerenciamento de Ativos | ✅✅ | ✅✅ | ✅✅✅ |
| 8. Topologia de Rede | ✅✅ | ✅✅ | ✅✅✅ |
| 9. Análise de Tráfego | ✅ | ✅✅ | ✅✅✅ |
| 10. Sistema de Relatórios | ✅✅ | ✅✅ | ✅✅✅ |

**Legenda**: ❌ Não tem | ⚠️ Limitado | ✅ Tem | ✅✅ Bom | ✅✅✅ Excelente

### 12.2 Análise de Vantagens

#### Zabbix
- **Melhor em**: Monitoramento de dispositivos, alertas complexos, customização
- **Vantagem**: Open source, sem custos de licença
- **Desvantagem**: Interface datada, curva de aprendizado alta

#### PRTG
- **Melhor em**: Facilidade de uso, interface moderna, captura de pacotes
- **Vantagem**: Suporte comercial, interface intuitiva
- **Desvantagem**: Custo de licença, menos customização

#### NetMonitor Pro
- **Melhor em**: Integração com Nmap, captura de pacotes, análise de tráfego, topologia
- **Vantagem**: Customização total, integração nativa de ferramentas, interface moderna
- **Desvantagem**: Requer desenvolvimento, não é solução pronta

### 12.3 Recomendações de Uso

#### Quando usar Zabbix
- Ambiente com orçamento limitado
- Necessidade de alta customização
- Equipe técnica experiente
- Monitoramento complexo de aplicações

#### Quando usar PRTG
- Ambiente com orçamento disponível
- Necessidade de facilidade de uso
- Suporte comercial importante
- Foco em monitoramento de rede

#### Quando usar NetMonitor Pro
- Necessidade de integração com Nmap
- Análise profunda de tráfego importante
- Topologia de rede complexa
- Customização total necessária
- Equipe de desenvolvimento disponível

---

## 13. CONCLUSÃO

O **NetMonitor Pro** foi projetado para combinar o melhor de ambos os mundos:

- **Flexibilidade do Zabbix**: Customização total, alertas complexos, múltiplas opções
- **Facilidade do PRTG**: Interface moderna, descoberta automática, sensores pré-configurados
- **Integração nativa**: Nmap, tcpdump, análise de tráfego
- **Análise avançada**: Topologia, correlação, anomalias
- **Escalabilidade**: Arquitetura distribuída, TSDB otimizado

O sistema é ideal para organizações que precisam de uma solução de monitoramento profissional, customizável e com análise profunda de rede, sem ficar preso às limitações de soluções pré-construídas.

---

**Documento preparado em**: 19 de janeiro de 2026
**Versão**: 1.0
**Status**: Comparação Completa


---

<a name="inventario-md"></a>
## Arquivo: Inventario.md

Roadmap de Melhorias para o Netwall: Integração OCS-like e
Administração Avançada 
O presente roadmap detalha as etapas necessárias para estender as funcionalidades do sistema Netwall, incorporando recursos de
inventário de ativos (semelhantes ao OCS Inventory), gerenciamento avançado de SNMP, escaneamento de redes configurável e
melhorias na administração para ambientes multi-rede. 
1. Análise da Arquitetura Atual 
O Netwall possui uma arquitetura moderna baseada em monorepo, utilizando TypeScript, Express/tRPC no backend e React/Tailwind
no frontend. O sistema já utiliza componentes chave que facilitam a integração das novas funcionalidades:Componente Tecnologia Função Atual Oportunidade de MelhoriaAgente (apps/agent) Node.js/TypeScript
 Coleta métricas de performance
 Estender para coleta de Inventário
(systeminformation) (CPU, RAM, Disco, Rede). de Hardware e Software.Servidor (apps/server) Express/tRPC, InfluxDB, MySQL
 Recebe métricas, armazena, e
 Adicionar rotas para Inventário,
TiDB fornece API para o frontend. aprimorar SNMP e Gerenciamento
de Redes.Serviço SNMP Node.js/TypeScript (net-snmp) Implementação básica de
 Tornar configurável (comunidades,
sondagem SNMP. versões) e estender para
Inventário de Dispositivos de
Rede.Banco de Dados MySQL/TiDB (Metadados), InfluxDB
 Armazenamento de configurações e
Necessidade de expansão do
(Séries Temporais) métricas. esquema para dados de inventário. 
2. Fase 1: Integração de Inventário de Ativos (OCS-like) 
O objetivo desta fase é equipar o agente Netwall com a capacidade de coletar um inventário detalhado de hardware e software, de
forma semelhante ao OCS Inventory.Etapa Descrição Componentes Afetados1.1. Expansão do Modelo de Dados Criar novas tabelas no banco de dados
 prisma/schema.prisma (Server)principal (MySQL/TiDB) para armazenar
informações de inventário: Hardware (CPU,
Placa-mãe, Serial, RAM, Placa de Vídeo) e
Software (Lista de programas instalados,
versões).1.2. Extensão do Agente Modificar o apps/agent/src
 apps/agent/src/collector.ts (Agent)collector.ts para utilizar o
systeminformation e/ou comandos
nativos do sistema operacional para coletar
o inventário completo de hardware e
software. O inventário deve ser enviado ao
servidor em intervalos menos frequentes
que as métricas de performance.1.3. Implementação da Rota de Inventário Criar um novo endpoint tRPC no servidor
 apps/server/src/routers
para receber o payload de inventário do
 inventoryRouter.ts (Server)agente. A lógica deve processar os dados e
atualizar as tabelas Hardware e Software
no banco de dados.1.4. Visualização do Inventário Desenvolver novas páginas na interface web
 apps/web (Frontend)para listar os ativos, visualizar o inventário
detalhado de hardware por dispositivo e
consultar a lista de software instalado na
rede. 
3. Fase 2: Gerenciamento Avançado de Rede e SNMP 
Esta fase visa aprimorar o gerenciamento de dispositivos de rede e o escaneamento, tornando-o mais flexível e poderoso.Etapa Descrição Componentes Afetados2.1. Gerenciamento de ComunidadesSNMP hardcoded) para uma tabela de
 schema.prismaconfiguração no banco de dados. Criar uma
interface de administração na web para
adicionar, editar e remover comunidades
(v1, v2c, v3).2.2. Gerenciamento de Escaneamento de
 Criar uma nova funcionalidade na web para
 apps/server/src/services
Redes definir e gerenciar as faixas de IP (subnets) a
networkScanner.ts, apps/webserem escaneadas. O servidor deve agendar
e executar o escaneamento (via Nmap e
SNMP) nessas faixas.2.3. Inventário SNMP Detalhado Estender o apps/server/src/services
 apps/server/src/services/snmp.tssnmp.ts para coletar mais informações de
inventário (Modelo, Fabricante, Serial, Status
de Portas) de dispositivos de rede (switches,
roteadores, impressoras) via SNMP,
armazenando-as nas tabelas de Hardware.2.4. Ações Remotas no Agente (Pré
 Implementar um mecanismo seguro (via
 apps/agent/src/remote.ts, apps
requisito para Deploy) tRPC ou WebSocket) para o servidor enviar
 servercomandos de ação remota ao agente (ex:
reiniciar serviço, executar script). Isso é
fundamental para futuras
funcionalidades de deploy de software,
como no OCS.
4. Fase 3: Administração Multi-Rede e Escalabilidade 
A fase final foca em melhorias de administração e arquitetura para suportar múltiplos ambientes de rede de forma eficiente.Etapa Descrição Componentes Afetados3.1. Suporte a Múltiplos Locais/Clientes Implementar um modelo de dados que
 prisma/schema.prisma, apps/server,
permita associar dispositivos e
 apps/webconfigurações (como faixas de
escaneamento e comunidades SNMP) a
diferentes Locais ou Clientes. Isso permite
a administração de redes isoladas ou
geograficamente distribuídas.3.2. Gerenciamento de Alertas e
 Estender o sistema de alertas para que as
 apps/server/src/services
Notificações por Local regras e notificações possam ser
 alerting.ts, apps/webconfiguradas e filtradas por Local/Cliente,
garantindo que os administradores corretos
recebam os alertas relevantes.3.3. Otimização do Agente para
 Implementar um mecanismo de delta
 apps/agent/src/collector.tsInventário inventory no agente, onde apenas as
mudanças de hardware/software são
enviadas ao servidor após o primeiro
inventário completo, reduzindo o tráfego de
rede.3.4. Documentação e API de Integração Criar documentação clara sobre o novo
 Documentação (Docs)modelo de dados e a API (tRPC) para que o
sistema possa ser integrado com outras
ferramentas de TI (ex: CMDBs, sistemas de
tickets). 
Resumo do RoadmapFeature Solicitada Implementação no Netwall Fase de ImplementaçãoInventário de Dispositivo (OCS-like) Extensão do Agente e novo Modelo de Dados. Fase 1Gerenciamento SNMP Configuração de Comunidades e Inventário Detalhado de Rede. Fase 2Redes a ser Escaneadas Gerenciamento de Faixas de IP para Escaneamento Agendado. Fase 2Administração Multi-Rede Implementação do conceito de Locais/Clientes. Fase 3Controle do Dispositivo (Deploy) Ações Remotas Mover asno comunidades Agente (Pré-requisito). SNMP (atualmente
 apps/server, Fase apps/web, 2 prisma
Este roadmap fornece uma estrutura lógica e incremental para a evolução do Netwall, garantindo que as novas funcionalidades sejam
construídas sobre a arquitetura existente de forma coesa e escalável


Roadmap de Melhorias para o Netwall: Inventário OCS-like,
Gestão de Ativos e Administração Avançada 
O presente roadmap foi refinado para incorporar as funcionalidades essenciais de Gestão de Ativos (Asset Management) e
Relatórios Detalhados presentes em sistemas como o OCS Inventory, além das melhorias de rede e administração multi-rede. 
1. Análise da Arquitetura Atual 
O Netwall utiliza Node.js/TypeScript, Express/tRPC, InfluxDB e MySQL/TiDB. A arquitetura é modular, o que facilita a extensão do Agente
e do Servidor para as novas funcionalidades.Componente Tecnologia Função Atual Oportunidade de MelhoriaAgente (apps/agent) Node.js/TypeScript
 Coleta métricas de performance
 Estender para coleta de Inventário
(systeminformation) (CPU, RAM, Disco, Rede). Detalhado (Hardware, Software,
Periféricos).Servidor (apps/server) Express/tRPC, InfluxDB, MySQL
 Recebe métricas, armazena, e
 Adicionar rotas para Inventário,
TiDB fornece API para o frontend. aprimorar SNMP e Gerenciamento
de Redes.Banco de Dados MySQL/TiDB (Metadados), InfluxDB
 Armazenamento de configurações e
Expansão do esquema para dados
(Séries Temporais) métricas. de inventário, organização lógica
(Setor/Departamento). 
2. Fase 1: Inventário Detalhado de Ativos (Hardware, Software e Periféricos) 
O foco é estender a coleta do agente para um inventário completo de ativos, fundamental para os relatórios.Etapa Descrição Componentes Afetados1.1. Expansão do Modelo de Dados de
 Criar/expandir tabelas no banco de dados
 prisma/schema.prisma (Server)Inventário principal (MySQL/TiDB) para armazenar:
Hardware (CPU, Placa-mãe, Serial, RAM,
Placa de Vídeo, Discos), Software (Lista de
programas instalados, versões, datas de
instalação) e Periféricos (Monitores,
Impressoras locais, Dispositivos USB).1.2. Extensão do Agente para Inventário
 Modificar o apps/agent/src
 apps/agent/src/collector.ts (Agent)Completo collector.ts para coletar o inventário
completo, incluindo a detecção de
periféricos. Implementar um mecanismo de
delta inventory para enviar apenas as
mudanças após o primeiro inventário
completo.1.3. Implementação da Rota de Inventário Criar um novo endpoint tRPC no servidor
 apps/server/src/routers
para receber o payload de inventário
 inventoryRouter.ts (Server)detalhado do agente, processar e atualizar
as tabelas de Hardware, Software e
Periféricos.1.4. Visualização do Inventário Desenvolver páginas na interface web para
 apps/web (Frontend)listar os ativos, visualizar o inventário
detalhado por dispositivo e consultar a lista
de software instalado na rede.
3. Fase 2: Gestão Organizacional e Administrativa 
Esta fase introduz a capacidade de organizar os ativos logicamente e aprimora o controle remoto.Etapa Descrição Componentes Afetados2.1. Modelo de Dados para Organização
 Criar tabelas para Setores e
 prisma/schema.prisma (Server)Lógica Departamentos. Implementar a lógica para
associar cada ativo (dispositivo) a um Setor e
um Departamento.2.2. Interface de Gestão Organizacional2.3. Ações Remotas no Agente (Controle
do Dispositivo)2.4. Gerenciamento de Comunidades
SNMPDepartamentos, e para atribuir ativos a
essas categorias.Implementar um mecanismo seguro (via
 apps/agent/src/remote.ts, apps
tRPC ou WebSocket) para o servidor enviar
 servercomandos de ação remota ao agente (ex:
reiniciar serviço, executar script, deploy de
software). Isso é o pré-requisito para o
controle do dispositivo.Mover as comunidades SNMP (atualmente
 apps/server, apps/web, prisma
hardcoded) para uma tabela de
 schema.prismaconfiguração e criar uma interface de
administração para gerenciá-las (v1, v2c, v3).4. Fase 3: Escaneamento de Rede e Inventário SNMP Avançado 
Foco em tornar o escaneamento de rede mais configurável e em obter inventário de dispositivos de rede.Etapa Descrição Componentes Afetados3.1. Gerenciamento de Faixas de IP Criar uma funcionalidade na web para
 apps/server/src/services
definir e gerenciar as faixas de IP (subnets) a
networkScanner.ts, apps/webserem escaneadas. O escaneamento deve
ser agendado e executado nessas faixas.3.2. Inventário SNMP Detalhado de Rede Estender o apps/server/src/services
 apps/server/src/services/snmp.tssnmp.ts para coletar informações de
inventário (Modelo, Fabricante, Serial, Status
de Portas) de dispositivos de rede (switches,
roteadores, impressoras) via SNMP,
armazenando-as nas tabelas de Hardware.3.3. Administração Multi-Rede (Locais
 Implementar um modelo de dados que
 prisma/schema.prisma, apps/server,
Clientes) permita associar dispositivos, faixas de
 apps/webescaneamento e configurações a diferentes
Locais ou Clientes, permitindo a
administração de redes isoladas.5. Fase 4: Relatórios e Análise de Dados 
Esta fase é dedicada à criação dos relatórios solicitados, utilizando os dados de inventário e organização coletados.Etapa Descrição Componentes Afetados4.1. Relatório de Software Instalado Criar um relatório que liste todo o software
 apps/server (Lógica de Relatório), apps
instalado na rede, com contagem de
 web (Interface)instalações e filtros por versão, Setor e
Departamento.4.2. Relatório de Inventário por Setor
 Desenvolver relatórios que permitam
 apps/server (Lógica de Relatório), apps
Departamento visualizar o inventário de hardware e
 web (Interface)periféricos agrupados por Setor e
Departamento.4.3. Relatório de Inventário por Rede IP Criar um relatório que liste os ativos
 apps/server (Lógica de Relatório), apps
(dispositivos) com base em suas faixas de IP
 web (Interface)(subnets), utilizando os dados do
escaneamento de rede.4.4. Exportação de Relatórios Adicionar funcionalidade para exportar os
 apps/server (Lógica de Exportação)relatórios (Software, Inventário, Rede) em
formatos comuns como CSV e PDF.Resumo do Roadmap AtualizadoFeature Solicitada Implementação no Netwall Fase de ImplementaçãoInventário Detalhado (Hardware, Periféricos) Extensão do Agente e novo Modelo de Dados. Fase 1Relatório de Software Instalado Lógica de Relatório e Interface. Fase 4Desenvolver a interface de administração
 apps/web (Frontend)Setor, Departamento Modelo de Dados e Interface de Gestão Organizacional. Fase 2para criar, editar e gerenciar Setores e
Gerenciamento SNMP


Redes a ser EscaneadasAdministração Multi-RedeControle do Dispositivo (Deploy)Relatório por Rede IPRede.Gerenciamento de Faixas de IP para Escaneamento
Agendado.Implementação do conceito de Locais/Clientes.Ações Remotas no Agente (Pré-requisito).Lógica de Relatório e Interface.Fase 3FaseFaseFase324
Este roadmap fornece uma estrutura lógica e incremental para a evolução do Netwall, garantindo que as novas funcionalidades sejam
construídas sobre a arquitetura existente de forma coesa e escalável, e que o sistema atinja um nível de gestão de ativos comparável
ao OCS Inventory


Estratégia de Integração de Inventário OCS-like via WebSocket
no Netwall 
A integração do inventário detalhado (hardware, software, periféricos) do OCS Inventory na arquitetura do Netwall, mantendo a
comunicação via WebSocket, exige otimização do tráfego de dados. O inventário é um payload grande e esporádico, diferente das
métricas de performance que são pequenas e frequentes. 
1. Definição da Estratégia de Payload e Compressão 
Para garantir a eficiência e a escalabilidade, a transmissão do inventário via WebSocket deve seguir um protocolo otimizado: 
1.1. Formato do Payload 
O agente deve coletar os dados e formatá-los em um objeto JSON estruturado.Campo Tipo Descrição Exemplo de Conteúdotype string Tipo de inventário: full ou delta. "full"timestamp Date Data e hora da coleta. 2026-01-26T14:30:00Zhardware object Dados estáticos do hardware (CPU, Motherboard,
 { cpu: "Intel i7-12700K", serial:
Serial). "XYZ123" }software Array<object> Lista de software instalado. [{ name: "Firefox", version: "120.0.1"
}, ...]peripherals Array<object> Lista de periféricos conectados. [{ type: "Monitor", model: "Dell U2415"
}, ...] 
1.2. Compressão e Transmissão Assíncrona 
O WebSocket é ideal para dados pequenos e em tempo real, mas pode ser sobrecarregado por um inventário completo. 
Compressão no Agente: O agente deve comprimir o payload JSON usando um algoritmo eficiente como Gzip ou Brotli antes de
enviar. 
Tecnologia: Utilizar bibliotecas nativas do Node.js/TypeScript (ex: zlib) para compressão.
Transmissão Assíncrona: O agente não deve enviar o inventário como uma mensagem de WebSocket padrão, mas sim como
um evento dedicado (ex: inventory_update) com a flag de binário ativada para o payload comprimido.
Descompressão no Servidor: O servidor recebe o evento, descompacta o payload e o encaminha para o serviço de
processamento de inventário. 
2. Arquitetura de Sincronização de Inventário (Full vs. Delta) 
Para minimizar o tráfego de rede após a primeira coleta, o Netwall deve adotar a estratégia de inventário Full e Delta. 
2.1. Lógica do Agente (apps/agent/src/collector.ts)Tipo de Inventário Condição de Envio Ação do AgenteFull Inventory Primeira execução do agente ou forçado pelo servidor
 Coleta todos os dados de hardware, software e
(via forceInventory). periféricos.Delta Inventory Execução agendada (ex: a cada 24h) e comparação com
 Coleta apenas as mudanças (software instalado
o inventário localmente armazenado. removido, periféricos conectados/desconectados) e
envia um payload menor.
2.2. Lógica do Servidor (apps/server/src/services/inventoryService.ts) 
O servidor deve ter um serviço dedicado para processar o inventário, garantindo que a operação de banco de dados não bloqueie o
loop de eventos do servidor.Tipo de Inventário Recebido Ação do ServidorFull Inventory Upsert (Insert/Update) completo de todos os dados de hardware e periféricos. Substituição da lista de
software.Delta Inventory Aplica apenas as mudanças recebidas (ex: DELETE software X, INSERT software Y). 
3. Mapeamento de Dados e Integração com o Banco de Dados (MySQL/TiDB) 
O serviço de inventário no servidor (inventoryService.ts) será responsável por mapear o payload JSON recebido para o esquema
do Prisma (MySQL/TiDB).3.1. Estrutura de Dados no Prisma 
O esquema deve ser expandido para incluir as seguintes entidades, com chaves estrangeiras para o dispositivo (Asset ID): 
Asset: Informações básicas do dispositivo (Hostname, IP, Setor, Departamento).
Hardware: Dados estáticos (CPU, RAM total, Serial).
Software: Lista de programas instalados (Nome, Versão, Data de Instalação).
Peripheral: Dispositivos conectados (Tipo, Modelo, Fabricante). 
3.2. Processamento de Dados (Upsert) 
A chave para a integração eficiente é o uso de operações Upsert (Update or Insert) no banco de dados. 
Hardware: O registro de hardware de um dispositivo é único. O servidor deve usar o ID do dispositivo para fazer um UPDATE se o
registro existir, ou um INSERT se for novo.
Software/Periféricos: Para o inventário completo, o servidor deve primeiro deletar todos os registros de software/periféricos
existentes para aquele dispositivo e, em seguida, inserir a nova lista. Para o inventário delta, apenas as operações de INSERT ou
DELETE específicas são executadas. 
Essa estratégia garante que o Netwall possa lidar com grandes volumes de dados de inventário de forma segura e eficiente, utilizando
o canal WebSocket para comunicação assíncrona e otimizada





Roadmap de Implementação Detalhado: Netwall - Inventário
OCS-like e Gestão Avançada 
Este roadmap consolida todas as funcionalidades discutidas (Inventário Detalhado, Ações Remotas, Gerenciamento SNMP,
Administração Multi-Rede e Relatórios Avançados) em um cronograma estruturado por Marcos (Milestones), com estimativas de
esforço em dias de trabalho (dias/h). 
A estimativa de esforço considera o desenvolvimento, testes unitários e integração na arquitetura existente (TypeScript, tRPC, React,
MySQL/TiDB). 
Resumo do Esforço TotalFase Marcos Esforço Estimado (dias/h)Fase 1 Base de Inventário e Comunicação 15 diasFase 2 Gestão Organizacional e Ações Remotas 12 diasFase 3 Gerenciamento de Rede e SNMP Avançado 10 diasFase 4 Relatórios e Análise de Dados 13 diasTotal 50 dias 
 Fase 1: Base de Inventário e Comunicação (15 dias) 
Objetivo: Estabelecer a coleta de inventário detalhado e o canal de comunicação otimizado.ID Tarefa Esforço (dias/h)M1.1 Expansão do Modelo de Dados (Prisma/MySQL
 3 diasTiDB): Criação das tabelas Hardware, Software,
Peripheral e atualização do Asset (dispositivo).M1.2 Extensão do Agente (Coleta): Implementação da
 5 diascoleta de hardware, software e periféricos no
apps/agent/src/collector.ts (utilizando
systeminformation e comandos nativos).M1.3 Comunicação Otimizada (WebSocket):
 4 diasImplementação da compressão (Gzip/Brotli) e
lógica de transmissão assíncrona de inventário no
agente e servidor.M1.4 Rota de Inventário (Servidor): Criação do
 3 diasendpoint tRPC para receber o payload de
inventário e implementação da lógica de Upsert
no banco de dados.Marco de Conclusão: Inventário completo de
hardware, software e periféricos é coletado e
armazenado no banco de dados.Dependências--M1.2M1.1, M1.3
Fase 2: Gestão Organizacional e Ações Remotas (12 dias) 
Objetivo: Adicionar a organização lógica dos ativos e a capacidade de controle remoto (pré-requisito para deploy).ID Tarefa Esforço (dias/h) DependênciasM2.1 Modelo de Dados Organizacional: Criação das
 2 dias M1.1tabelas Sector e Department e associação ao
Asset.M2.2 Interface de Gestão Organizacional (CRUD):
 4 dias M2.1Desenvolvimento das telas para gerenciar Setores
e Departamentos, e interface para atribuição de
ativos.M2.3 Ações Remotas (Agente): Implementação das
 4 dias M1.3funções executeScript, manageService e
systemControl no apps/agent/src
remote.ts via WebSocket.M2.4Implementação da autenticação e autorização de
comandos remotos (ex: assinatura/token) no
servidor e agente.Marco de Conclusão: Ativos podem ser
organizados por Setor/Departamento e o servidor
pode executar comandos remotos seguros no
agente.
Fase 3: Gerenciamento de Rede e SNMP Avançado (10 dias) 
Objetivo: Aprimorar o escaneamento de rede e o inventário de dispositivos de rede via SNMP.ID Tarefa Esforço (dias/h) DependênciasM3.1 Gerenciamento de Comunidades SNMP: Criação
 3 dias M1.1da tabela de configuração e interface de
administração para gerenciar comunidades (v1,
v2c, v3).M3.2 Gerenciamento de Faixas de IP: Interface para
 3 dias M3.1definir e agendar o escaneamento de subnets (via
Nmap e SNMP).M3.3 Inventário SNMP Detalhado de Rede: Extensão
 4 dias M1.4, M3.1do apps/server/src/services/snmp.ts para
coletar informações de inventário (Modelo, Serial,
Portas) de dispositivos de rede.Marco de Conclusão: O sistema pode escanear
redes configuráveis, gerenciar credenciais SNMP e
coletar inventário de dispositivos de rede. 
Fase 4: Relatórios e Análise de Dados (13 dias) 
Objetivo: Implementar os relatórios avançados solicitados, utilizando os dados de inventário e organização.ID Tarefa Esforço (dias/h) DependênciasM4.1 Relatório de Software Instalado: Lógica de
 4 dias M1.4, M2.2consulta e interface para listar software, com
filtros por versão, Setor e Departamento.M4.2 Relatório de Inventário por Organização:
 3 dias M1.4, M2.2Lógica e interface para visualizar hardware e
periféricos agrupados por Setor e Departamento.M4.3 Relatório de Inventário por Rede IP: Lógica de
 3 dias M1.4, M3.2consulta e interface para listar ativos com base
em suas faixas de IP (subnets).M4.4 Exportação de Relatórios: Funcionalidade para
 3 dias M4.1, M4.2, M4.3exportar os relatórios (M4.1, M4.2, M4.3) para
formatos CSV e PDF.Marco de Conclusão: Todos os relatórios
avançados estão implementados e funcionais. 
Próximos Passos (Pós-Roadmap) 
Após a conclusão das 4 Fases, o Netwall terá as capacidades de gestão de ativos comparáveis ao OCS Inventory. Os próximos passos
lógicos seriam: 
Módulo de Deploy de Software: Utilizar a base de Ações Remotas (M2.3) para criar uma interface completa de gestão de
pacotes e agendamento de deploy.
Administração Multi-Rede (Completa): Implementar a segregação de dados e configurações por Local/Cliente (conforme
discutido na Fase 3), permitindo que diferentes administradores gerenciem diferentes redes isoladamente.
Integração com Help Desk/CMDB: Criação de APIs para integração com sistemas de tickets (ex: GLPI, Jira) e bases de dados de
configuração (CMDB). 
Este roadmap fornece uma visão clara e incremental para a evolução do Netwall

Segurança e Autorização de Comandos:
 2 dias M2.3




Detalhamento das Ações Remotas (Fase 2) e Comparativo com OCS Inventory

A Fase 2: Gestão Organizacional e Ações Remotas do roadmap do Netwall é crucial para a transição de um sistema de monitoramento para uma plataforma de Gestão de Ativos (Asset Management) com capacidade de controle.

1. Ações Remotas Implementadas na Fase 2

As ações remotas são implementadas no agente (apps/agent/src/remote.ts) e acionadas pelo servidor via WebSocket, garantindo comunicação segura (WSS) e em tempo real.

Ação Remota
Descrição
Exemplo de Uso Prático
executeScript
Executa um script (Bash, PowerShell, Python) enviado pelo servidor no dispositivo cliente. Retorna o código de saída e o log de execução.
Deploy de Software: Instalar ou desinstalar um aplicativo de forma silenciosa. Correção Rápida: Executar um comando de limpeza de cache ou correção de registro.
manageService
Controla o estado de um serviço do sistema operacional (iniciar, parar, reiniciar).
Manutenção: Reiniciar o serviço de spooler de impressão ou um serviço de aplicação após uma atualização.
systemControl
Executa comandos de controle do sistema (reiniciar, desligar).
Gerenciamento de Energia: Agendar o desligamento de máquinas fora do horário de trabalho.
forceInventory
Força o agente a coletar e enviar um inventário completo imediatamente.
Auditoria Pós-Mudança: Verificar se o inventário foi atualizado corretamente após um deploy de software.




2. Comparativo com Funcionalidades de Controle do OCS Inventory

O OCS Inventory oferece controle remoto através de dois mecanismos principais: Deployment de Pacotes e Ações Remotas (Plugins). O Netwall, ao implementar as ações da Fase 2, estabelece a base para replicar e, em alguns aspectos, aprimorar essas funcionalidades.

Funcionalidade OCS Inventory
Equivalente no Netwall (Fase 2)
Vantagem do Netwall
Deployment de Pacotes
executeScript
Flexibilidade: O OCS usa pacotes pré-definidos; o Netwall permite a execução de qualquer script (Bash, PowerShell, etc.), oferecendo maior flexibilidade para automação complexa.
Inventário Forçado
forceInventory
Tempo Real: O Netwall utiliza WebSocket, permitindo que o comando seja executado e o inventário seja enviado imediatamente, em vez de depender do próximo ciclo de comunicação HTTP do agente.
Controle de Energia
systemControl
Integração: Implementado diretamente no agente Node.js/TypeScript, sem a necessidade de plugins externos, garantindo uma base de código mais coesa.
Acesso Remoto (VNC/RDP)
Não Implementado na Fase 2
Foco: A Fase 2 foca em controle programático (automação). O acesso remoto (visual) é uma funcionalidade de acesso que pode ser integrada posteriormente (ex: via Guacamole, já presente no repositório).




3. Detalhamento Técnico e Segurança

A segurança é o ponto mais crítico para as ações remotas.

3.1. Implementação do executeScript

O agente deve encapsular a execução do script para garantir que o processo não trave o agente e que o resultado seja capturado.

Exemplo de Estrutura de Comando (Payload JSON via WebSocket):

JSON


{
  "action": "executeScript",
  "deviceId": "asset-12345",
  "payload": {
    "script": "sudo apt update && sudo apt install -y htop",
    "shell": "bash",
    "timeout": 300
  },
  "signature": "JWT_OU_ASSINATURA_CRIPTOGRAFICA" 
}



Lógica de Execução no Agente:

1.
Receber o comando e validar a signature.

2.
Executar o script em um processo filho (child_process.exec ou similar no Node.js).

3.
Capturar stdout, stderr e o exitCode.

4.
Enviar o resultado de volta ao servidor via WebSocket.

3.2. Segurança e Auditoria

Todas as ações remotas devem ser auditáveis:

•
Assinatura de Comando: O servidor deve assinar o comando com um token seguro (JWT ou similar) que o agente valida para garantir que o comando não foi adulterado e veio de uma fonte confiável.

•
Registro de Auditoria: O servidor deve registrar:

•
Usuário que iniciou a ação.

•
Dispositivo alvo.

•
Comando enviado.

•
Status de execução (Sucesso/Falha) e log de retorno.



Ao focar no executeScript como a principal ação remota, o Netwall ganha a flexibilidade necessária para realizar qualquer tarefa de deploy ou manutenção, superando a rigidez de pacotes pré-definidos e estabelecendo a base para um controle de dispositivo completo.



---

<a name="plano_detalhado_sistema_monitoramento-md"></a>
## Arquivo: PLANO_DETALHADO_SISTEMA_MONITORAMENTO.md

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


---

<a name="recomendações para implementação do netmonitor pro-md"></a>
## Arquivo: Recomendações para Implementação do NetMonitor Pro.md

# Recomendações para Implementação do NetMonitor Pro

O plano original do **NetMonitor Pro** é uma base sólida e ambiciosa. Para transformá-lo em um sistema completo e pronto para produção, identificamos pontos cruciais que precisam de definição técnica e estratégica.

## 1. Refinamento da Camada de Front-end

Embora o uso de **React 19** e **Tailwind 4** seja moderno, a complexidade de um sistema de monitoramento exige ferramentas robustas de gerenciamento de dados e visualização.

| Categoria | Recomendação Técnica | Justificativa |
| :--- | :--- | :--- |
| **Gerenciamento de Estado** | [TanStack Query](https://tanstack.com/query) | Essencial para lidar com o cache de métricas, invalidação de dados e estados de carregamento de forma eficiente. |
| **Biblioteca de UI** | [Shadcn/UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Garante acessibilidade (WAI-ARIA) e acelera o desenvolvimento com componentes consistentes e customizáveis. |
| **Visualização de Topologia** | [React Flow](https://reactflow.dev/) | Ideal para criar diagramas de rede interativos com suporte nativo a zoom, pan e nós customizados. |
| **Gráficos de Performance** | [Tremor](https://www.tremor.so/) ou [Recharts](https://recharts.org/) | Tremor é excelente para dashboards corporativos rápidos; Recharts oferece maior flexibilidade para séries temporais complexas. |

> **Dica de Implementação:** Para a atualização em tempo real mencionada no plano, utilize **WebSockets** via `socket.io` ou a integração nativa do tRPC para assinaturas (subscriptions), garantindo que os alertas apareçam instantaneamente sem recarregar a página.

## 2. Fortalecimento do Back-end e Segurança

O back-end precisa de mecanismos de controle rigorosos, especialmente na comunicação com os agentes de coleta distribuídos.

1.  **Validação de Dados:** Utilize [Zod](https://zod.dev/) para definir esquemas de validação que serão compartilhados entre o front-end e o back-end através do tRPC. Isso garante segurança de tipos de ponta a ponta.
2.  **Segurança dos Agentes:** Implemente um sistema de **Provisionamento de Agentes**. Cada novo agente deve realizar um "handshake" inicial usando um token de registro único, recebendo em troca um certificado ou chave de API específica para aquele host.
3.  **Processamento Assíncrono:** Para tarefas pesadas como scans de rede e geração de relatórios PDF, utilize o [BullMQ](https://docs.bullmq.io/). Ele gerencia filas de tarefas no Redis com suporte a retentativas e priorização, evitando que a API principal fique travada.

## 3. Estratégia de Dados e Persistência

O volume de dados de um sistema de monitoramento cresce exponencialmente. A escolha das ferramentas de migração e backup é vital.

*   **ORM e Migrações:** Recomendamos o [Drizzle ORM](https://orm.drizzle.team/). Ele é extremamente leve, possui performance superior ao Prisma e gera migrações SQL puras, o que facilita o gerenciamento do banco de dados MySQL/TiDB.
*   **Otimização de TSDB:** Para o InfluxDB, defina **Continuous Queries** para realizar a agregação automática de dados (downsampling) conforme descrito no plano (ex: transformar dados de 1 min em médias de 5 min após 7 dias).

## 4. Infraestrutura e Ciclo de Vida (DevOps)

Para a fase inicial, a recomendação é utilizar um **servidor único robusto** (conforme sugerido na arquitetura), mas preparado para conteinerização futura.

| Componente | Ferramenta Sugerida | Papel no Sistema |
| :--- | :--- | :--- |
| **Infraestrutura** | Local (Ubuntu 24.04) | Permite acesso direto aos recursos do sistema e simplifica o gerenciamento sem camadas de virtualização. |
| **Proxy Reverso** | Nginx ou Caddy | Gerenciamento de certificados SSL (Let's Encrypt) e terminação HTTPS. |
| **Logs Centralizados** | Winston ou Pino | Bibliotecas de logging para Node.js que permitem exportar logs para análise posterior. |
| **CI/CD** | GitHub Actions | Automação de testes unitários e deploy contínuo para o servidor de homologação/produção. |

## 5. O que falta para o "Sistema Completo"

Para que o sistema seja considerado "completo" comercialmente e tecnicamente, sugerimos adicionar:

*   **Documentação da API:** Mesmo usando tRPC, uma documentação técnica (via Swagger/OpenAPI se houver endpoints REST) é necessária para integrações externas.
*   **Módulo de Auditoria:** Um log de auditoria imutável que registre quem alterou configurações críticas ou silenciou alertas importantes.
*   **Plano de Disaster Recovery:** Procedimentos claros de como restaurar o sistema em caso de falha total do servidor principal, incluindo o backup do TSDB.

Ao seguir estas recomendações, o **NetMonitor Pro** deixará de ser apenas um plano detalhado e se tornará uma plataforma de monitoramento resiliente, escalável e profissional.





---

<a name="apps-agent-install_windows-md"></a>
## Arquivo: apps/agent/INSTALL_WINDOWS.md

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









---

<a name="docs-guacamole_install-md"></a>
## Arquivo: docs/GUACAMOLE_INSTALL.md

# Guacamole Server Manual Installation Guide

This guide details the steps to manually install Apache Guacamole (guacd + webapp) on a Linux server (Debian/Ubuntu) without Docker.

## 1. Install Dependencies

Install the required build tools and libraries for compiling `guacamole-server`:

```bash
sudo apt update
sudo apt install -y make gcc libcairo2-dev libjpeg-turbo8-dev libpng-dev \
libtool-bin libossp-uuid-dev libvncserver-dev freerdp2-dev libssh2-1-dev \
libtelnet-dev libwebsockets-dev libpango1.0-dev libpulse-dev libvorbis-dev \
libwebp-dev libssl-dev tomcat9 tomcat9-admin tomcat9-common tomcat9-user \
postgresql postgresql-contrib
```

## 2. Compile and Install guacamole-server (guacd)

The `guacd` daemon acts as a proxy between the web application and remote desktop protocols (RDP, VNC).

1.  **Download Source**:
    ```bash
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/source/guacamole-server-1.5.5.tar.gz?action=download -O guacamole-server-1.5.5.tar.gz
    tar -xzf guacamole-server-1.5.5.tar.gz
    cd guacamole-server-1.5.5
    ```

2.  **Configure and Build**:
    ```bash
    ./configure --with-init-dir=/etc/init.d
    make
    sudo make install
    sudo ldconfig
    ```

3.  **Start Service**:
    ```bash
    sudo systemctl enable guacd
    sudo systemctl start guacd
    ```

## 3. Configure PostgreSQL Database

Guacamole needs a database to store connections and user data.

1.  **Create Database and User**:
    ```bash
    sudo -u postgres psql
    ```
    ```sql
    CREATE DATABASE guacamole_db;
    CREATE USER guacamole_user WITH PASSWORD 'guacamole_password';
    GRANT ALL PRIVILEGES ON DATABASE guacamole_db TO guacamole_user;
    \q
    ```

2.  **Initialize Schema**:
    Download the schema scripts from the Guacamole client (requires extracting the JDBC auth jar).
    *For simplicity, you can usually find the schema in the `guacamole-auth-jdbc` package download.*

    ```bash
    # Download JDBC auth extension
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/binary/guacamole-auth-jdbc-1.5.5.tar.gz?action=download -O guacamole-auth-jdbc-1.5.5.tar.gz
    tar -xzf guacamole-auth-jdbc-1.5.5.tar.gz
    
    # Run schema scripts
    cat guacamole-auth-jdbc-1.5.5/postgresql/schema/*.sql | sudo -u postgres psql -d guacamole_db
    ```

## 4. Install Guacamole Client (Webapp)

1.  **Deploy WAR**:
    ```bash
    wget https://apache.org/dyn/closer.lua/guacamole/1.5.5/binary/guacamole-1.5.5.war?action=download -O guacamole.war
    sudo mv guacamole.war /var/lib/tomcat9/webapps/
    ```

2.  **Install Extensions and Drivers**:
    
    Create configuration directories:
    ```bash
    sudo mkdir -p /etc/guacamole/{extensions,lib}
    ```

    Copy JDBC Auth extension:
    ```bash
    sudo cp guacamole-auth-jdbc-1.5.5/postgresql/guacamole-auth-jdbc-postgresql-1.5.5.jar /etc/guacamole/extensions/
    ```

    Download PostgreSQL JDBC Driver:
    ```bash
    wget https://jdbc.postgresql.org/download/postgresql-42.7.2.jar
    sudo mv postgresql-42.7.2.jar /etc/guacamole/lib/
    ```

## 5. Configure Guacamole

Create `/etc/guacamole/guacamole.properties`:

```bash
sudo nano /etc/guacamole/guacamole.properties
```

Add the following content:

```properties
# Hostname and Port of guacd
guacd-hostname: localhost
guacd-port: 4822

# PostgreSQL Configuration
postgresql-hostname: localhost
postgresql-port: 5432
postgresql-database: guacamole_db
postgresql-username: guacamole_user
postgresql-password: guacamole_password

# Optional: Auto-create users if they don't exist (useful for API integration)
postgresql-auto-create-accounts: true
```

Link configuration for Tomcat:
```bash
sudo ln -s /etc/guacamole /usr/share/tomcat9/.guacamole
```

## 6. Restart Services

```bash
sudo systemctl restart tomcat9
sudo systemctl restart guacd
```

## 7. Verify Installation

Access `http://<your-server-ip>:8080/guacamole`.
Default login: `guacadmin` / `guacadmin`.

> [!IMPORTANT]
> Change the default password immediately after logging in!


---

<a name="docs-install-md"></a>
## Arquivo: docs/INSTALL.md

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


---

<a name="docs-monitoring-md"></a>
## Arquivo: docs/MONITORING.md

# Aba de Monitoramento de Gráficos em Devices Selecionados

Esta aba permite que o usuário visualize gráficos detalhados de métricas coletadas para dispositivos selecionados na interface do Netwall.

## Funcionalidades Principais

- **Seleção de Dispositivos**: O usuário pode selecionar um ou mais dispositivos a partir da lista de dispositivos monitorados.
- **Visualização de Métricas**: Para cada dispositivo selecionado, são exibidos gráficos interativos de métricas como:
  - Utilização de CPU
  - Utilização de Memória
  - Tráfego de Rede (entrada/saída)
  - Latência e perda de pacotes
- **Intervalos de Tempo**: O usuário pode escolher intervalos de tempo predefinidos (últimos 5 min, 1 h, 24 h) ou definir um intervalo customizado.
- **Exportação**: É possível exportar os gráficos como imagens PNG ou CSV dos dados subjacentes.

## Como Acessar

1. No painel principal, clique na aba **"Devices"**.
2. Selecione um ou mais dispositivos marcando as caixas de seleção ao lado de cada nome.
3. Clique no botão **"Visualizar Gráficos"** que aparecerá na barra superior.
4. A aba **"Monitoramento"** será exibida com os gráficos correspondentes.

## Tecnologias Utilizadas

- **Frontend**: React com Chart.js para renderização dos gráficos.
- **Backend**: tRPC endpoints que consultam o InfluxDB para obter séries temporais.
- **Banco de Dados**: InfluxDB para armazenamento de métricas de alta frequência.

## Considerações de Performance

- Os dados são carregados de forma assíncrona e paginados para evitar sobrecarga de memória.
- Cache de consultas recentes é mantido por 2 minutos para melhorar a responsividade.

## Futuras Melhorias

- Suporte a visualizações de múltiplas métricas em um único gráfico.
- Integração com alertas configuráveis diretamente na aba de monitoramento.

---

*Este documento faz parte da documentação oficial do Netwall e deve ser mantido atualizado conforme novas métricas e funcionalidades são adicionadas.*


---


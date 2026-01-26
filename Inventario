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


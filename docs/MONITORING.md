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

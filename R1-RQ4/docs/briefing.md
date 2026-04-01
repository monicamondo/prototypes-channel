# Documentação Técnica: RQ004 - Implementação de Resultados Chave (KRs)

## 1. Contexto do Projeto
O objetivo desta demanda é a implementação da funcionalidade de Key Results (KRs) vinculados aos Objetivos Estratégicos no Produto CHANNEL. Os KRs servem como uma alternativa leve aos Indicadores (KPIs), permitindo definições quantitativas de progresso com medições periódicas e cálculo automático de status de saúde.

## 2. Requisitos Funcionais (RF)

### Acesso e Localização
* **Acesso 01:** Opção "Gerenciar KRs" dentro do menu "Mais Opções" (...) do Objetivo no Plano Estratégico.
* **Acesso 02:** Via ícone de visualização (lupa) na listagem de Objetivos.
* **Acesso 03:** Via novo ícone dedicado para cadastro de KRs.

### RF001 - Cadastro de Key Result
O sistema deve suportar dois tipos de KRs por Objetivo:

#### KR Quantitativo (Padrão)
* **Nome:** Identificação única no objetivo.
* **Unidade de Medida:** Ex: %, R$, Unidades.
* **Polaridade:** Maior é melhor / Menor é melhor / Igual à meta.
* **Baseline:** Valor inicial de partida.
* **Meta:** Valor alvo a ser atingido.
* **Peso:** Importância relativa (padrão 1) para cálculo da média ponderada.

#### KR Qualitativo
* **Nome:** Identificação do KR.
* **Situação Atual/Desejada:** Campos textuais descritivos.
* **Status de Atingimento:** Seleção entre "Alcançado" ou "Não alcançado".
* **Progresso:** 0% para não alcançado e 100% para alcançado.

#### Importação
* Deve permitir a criação de KRs em lote via carga de arquivo Excel na tela de Objetivos Estratégicos.

### RF002 - Registro de Medições
* Interface para inserir novas medições com: Data (permite retroativa), Valor numérico e Comentário opcional.
* O gráfico de evolução deve ser atualizado cronologicamente após cada registro.

### RF003/RF004 - Visualização e Painel Lateral
* Cada KR deve possuir um painel lateral (drawer) persistente.
* **Conteúdo do Painel:** Gráfico de linha (Evolução), Lista de histórico de medições (editável) e metadados do KR.

### RF005 - Arquivamento
* KRs arquivados saem da visão operacional e não contam para o progresso do Objetivo.
* Exibição visual: texto tachado e opacidade reduzida. Deve permitir o desarquivamento.

---

## 3. Regras de Negócio (RN)

### RN001 - Fórmulas de Cálculo de Progresso
* **Maior é melhor:** `(Valor Atual - Baseline) / (Meta - Baseline)`
* **Menor é melhor:** `(Baseline - Valor Atual) / (Baseline - Meta)`
* **Igual à Meta:** `1 - (|Valor Atual - Meta| / max(|Baseline - Meta|, ε))`

### RN003 - Regra de Exclusão vs Arquivamento
* **Exclusão:** Só permitida se o KR NÃO possuir medições registradas.
* **Arquivamento:** Obrigatório se o KR já possuir histórico.
* **Mensagem de Erro:** "Este KR não pode ser excluído, pois possui medições registradas. Para manter o histórico, utilize a opção de arquivamento."

### RN004 - Status de Saúde (Cores)
As faixas de progresso para sinalização visual são:
* **Vermelho:** de -1000% até 70%
* **Amarelo:** de 70% até 95%
* **Verde:** de 95% até 1000%

### RN005 - Consolidação do Objetivo
O progresso total do Objetivo Estratégico será a **média ponderada** entre todos os KRs e Indicadores vinculados, respeitando seus respectivos pesos.

### RN006 - Alerta de Inatividade
* Inserir ícone de alerta `(!)` em KRs sem medições há mais de 30 dias.
* Visível na lista de objetivos e na lista de KRs.

---

## 4. Premissas de Interface (UI/UX)
* **Edição Inline:** O cadastro/edição deve ser preferencialmente via painel lateral para evitar refresh de página.
* **Estados Visuais:** KRs com alerta devem ter destaque; KRs arquivados devem ter distinção visual clara (tachado).
* **Configuração de Pesos:** Disponibilizar tela única para gerenciar os pesos de KRs e Indicadores simultaneamente.
# PRODUTO CHANNEL
## RQ004 - Criar o conceito de resultados chave

### 1. Contexto
A implementação refere-se à funcionalidade de Key Results (KRs) diretamente vinculados aos Objetivos Estratégicos.
Trata-se de uma alternativa leve aos Indicadores (KPIs), permitindo que gestores definam metas quantitativas com ponto de partida (baseline), valor alvo (target) e registros de medição periódicos.
O sistema calculará automaticamente o progresso percentual e o status de saúde (cores) com base na polaridade definida, exibindo essas métricas de forma compacta no Canvas.

### 2. Requisitos Funcionais

**Local da funcionalidade:**
* Criar a opção (no "mais opções") do Objetivo no Plano Estratégico → Gerenciar KRs;
* Ou avaliar a possibilidade de acesso via ícone de visualização (lupa) na listagem de Objetivos;
* Ou criar um novo ícone para levar para uma nova tela de cadastro de KRs.

**RF001 - Cadastro de Key Result**
O sistema deve permitir a criação de múltiplos KRs para cada Objetivo Estratégico, podendo ser classificados em dois tipos:

**=> KR Quantitativo (padrão)**
Deverá conter os seguintes campos:
* Nome do KR
* Unidade de Medida
* Polaridade (Maior é melhor / Menor é melhor / Igual à meta)
* Baseline (valor inicial)
* Meta (valor alvo)
* Unidade (Valor da última medição)
* Histórico de medições
* Peso (padrão 1)

**=> KR Qualitativo**
Para casos onde não há medição numérica, o KR deverá conter:
* Nome do KR
* Situação Atual (campo textual)
* Situação Desejada (campo textual)
* Status de atingimento (Alcançado / Não alcançado)
* Peso (padrão 1)

**Regras do KR Qualitativo:**
* Não possui polaridade.
* Não possui baseline e meta numéricos.
* Não possui medições periódicas.
* O progresso será: 0% → Não alcançado ou 100% → Alcançado.

**Importação de KRs:**
* Criação de KRs por meio de importação via carga Excel (essa funcionalidade deverá estar na tela de Objetivos Estratégicos - Caminho: Menu do Plano Estratégico > Objetivos).

**RF002 - Registro de Medições**
O sistema deve disponibilizar interface para registro de medições periódicas dos KRs.
Cada registro deve conter:
* Data da medição
* Valor numérico medido
* Comentário

**RF003 - Cálculo Automático de Progresso**
O sistema deve calcular o percentual de atingimento com base na última medição vs. Baseline e Meta.

**RF004 - Painel Lateral de Detalhamento**
Para cada KR, o sistema deve exibir um painel lateral persistente contendo:
* Histórico de medições (editável)
* Gráfico de evolução (linha)
* Informações do KR (metadados)

**RF005 - Gestão de Estados (Arquivamento)**
O sistema deve permitir arquivar KRs, removendo-os da visão operacional sem perda de histórico.
KRs arquivados:
* Não participam dos cálculos do objetivo.
* Permanecem disponíveis para auditoria e consulta.
* Deve existir a funcionalidade de desarquivar.
* Opção para visualizar apenas os KRs arquivados no sistema.
* KRs arquivados deverão ser exibidos visualmente diferenciados (ex.: texto tachado) na listagem.

---

### 3. Regras de Negócio

#### Relacionadas ao Cadastro e Progresso (RF001 e RF003)

**RN001 - Fórmula de Progresso por Polaridade**
* **Maior é melhor:** Progresso = (Valor Atual - Baseline) / (Meta - Baseline)
* **Menor é melhor:** Progresso = (Baseline - Valor Atual) / (Baseline - Meta)
* **Igual à Meta:** Progresso = 1 - [ (Valor Atual - Meta) / max(Baseline - Meta, e) ] *(Nota técnica: tratar conforme fórmula matemática original do sistema).*

**RN002 - Unicidade de Nome**
O nome do KR deve ser único dentro do mesmo Objetivo Estratégico, porém pode se repetir em objetivos diferentes.

#### Relacionadas à Exclusão e Arquivamento (RF005)

**RN003 - Regra de Exclusão**
Um KR só poderá ser excluído permanentemente se não possuir medições registradas.
Caso existam medições:
* O KR não poderá ser excluído.
* Deverá ser arquivado.
* **Mensagem ao tentar excluir:** "Este KR não pode ser excluído, pois possui medições registradas. Para manter o histórico, utilize a opção de arquivamento."

#### Relacionadas à Visualização no Canvas (RF006)

**RN004 - Status de Saúde (Sinalização por Cor)**
O status dos KRs deve seguir os seguintes limiares: Verde (>= 95%), Amarelo (70% a 95%) e Vermelho (< 70%).
Fica definido que será implementado um esquema de cores padrão para Key Results (KRs), configurado na opção "Esquema de cores" do Plano Estratégico.
Ao criar um novo Plano Estratégico ou realizar a clonagem de um plano existente, o sistema deverá aplicar automaticamente esse esquema de cores padrão.
As faixas de progresso consideradas serão:
* De -1000% até 70% (Vermelho)
* De 70% até 95% (Amarelo)
* De 95% até 1000% (Verde)
O esquema de cores padrão não poderá ser excluído, sendo permitido apenas alterar as cores existentes ou adicionar novas faixas, conforme necessidade.

**RN005 - Consolidação no Objetivo**
O progresso do Objetivo Estratégico será calculado com base na consolidação dos Key Results (KRs) e Indicadores vinculados.
Os KRs terão peso padrão igual a 1, permitindo sua participação no cálculo de forma equivalente aos indicadores.
Dessa forma, o cálculo do progresso do Objetivo deverá considerar uma média ponderada, contemplando tanto KRs quanto Indicadores, respeitando os pesos atribuídos a cada elemento.
*Obs:* Disponibilizar uma tela única de configuração de pesos, onde será possível definir e ajustar os pesos de KRs e Indicadores vinculados ao Objetivo.

**RN006 - Alerta de Inatividade**
Inserir alerta (aviso) nos KRs que possuírem mais de 30 dias sem medições. Esse alerta será visível após 30 dias de acordo com a data de término, revisão ou ciclo.
*Obs:* Esse alerta será visível na lista de objetivos e na lista de KRs (ícone de alerta).

---

### 4. Premissas
* O KR é um elemento puramente quantitativo; não suporta fórmulas compostas ou busca de dados externa nesta versão (lançamento manual).
* A interface de cadastro deve ser inline ou via painel lateral para evitar recarregamento de página.
* O sistema deve tratar divisões por zero (ex: Meta igual ao Baseline) definindo progresso como 100% se o valor atual for igual à meta.

---

### 5. Estórias do Usuário (User Stories)

* **Como Gestor**, quero cadastrar um resultado-chave com meta de faturamento, para que eu possa acompanhar o progresso financeiro sem configurar um indicador complexo no módulo de BI.
  * *Critérios de Aceite:* Deve permitir definir baseline e meta decimal; O sistema deve mostrar o progresso assim que a primeira medição for salva.

* **Como Analista**, quero registrar uma medição retroativa em um KR, para que o histórico de desempenho do trimestre seja corrigido.
  * *Critérios de Aceite:* O sistema deve permitir escolher a data/período da medição; O gráfico de linha deve ser atualizado cronologicamente.

* **Como Usuário do Canvas**, quero ver quais KRs estão "atrasados" (sem medição recente), para que eu possa cobrar os responsáveis.
  * *Critérios de Aceite:* O sistema deve exibir um alerta visual se a data da última medição ultrapassar a periodicidade definida (> 30 dias para periodicidade mensal).

---

### 6. Diretrizes de Interface – Key Results (KRs)

**6.1. Acesso aos KRs (Entrada da funcionalidade)**
* **Local:** Tela de Objetivos Estratégicos (Plano Estratégico).
* Inserir opção no menu "Mais opções" (...) do Objetivo: "Gerenciar KRs";
* Ou avaliar a possibilidade de acesso via ícone de visualização (lupa) na listagem de Objetivos;
* Ou criar um ícone para levar para uma nova tela de cadastro de KRs.
* **Comportamento:** Ao clicar, abre painel lateral (drawer) ou nova tela dedicada.

**6.2. Tela de Listagem de KRs (por Objetivo)**
* **Pode ser:** Painel lateral ou tela dedicada.
* **Elementos da tela (cada KR deve ser exibido como linha contendo):**
  * Nome do KR
  * Progresso (%)
  * Status (cor: vermelho/amarelo/verde)
  * Última medição (valor + data)
  * Ícone de alerta (RN006 -> 30 dias sem medição)
* **Ações (...):** Editar / Arquivar / Excluir
* **Comportamentos visuais:** KRs arquivados com texto tachado e opacidade reduzida; Alerta com ícone destacado.

**6.3. Cadastro / Edição de KR**
* **Formato:** Painel lateral ou tela dedicada.
* **Campos:**
  * Nome do KR
  * Unidade de medida
  * Polaridade (select: Maior é melhor / Menor é melhor / Igual à meta)
  * Baseline
  * Meta
  * Tipo (Qualitativo / Quantitativo)

**6.4. Painel de Detalhamento do KR**
* **Ação:** Ao clicar no KR.
* **Estrutura - Cabeçalho:** Nome do KR / Progresso (%) / Status (cor).
* **Estrutura - Conteúdo:**
  1. Gráfico de evolução em linha (Eixo X: tempo / Eixo Y: valor).
  2. Histórico de medições em lista (Data / Valor / Comentário).
  3. Informações do KR (Baseline / Meta / Polaridade).

**6.5. Registro de Medição (RF002)**
* **Botão:** "+ Nova medição" ou "+ Registrar".
* **Formato:** Modal ou painel.
* **Campos:** Data / Valor / Comentário.
* **Regras:** Permitir data retroativa; Atualizar gráfico automaticamente.

**6.6. Representação Visual de Status (RN004)**
* **Aplicar cores padrão:**
  * Vermelho: -1000% a 70%
  * Amarelo: 70% a 95%
  * Verde: 95% a 1000%
* **Onde aparece:** Lista de KRs e Canvas (futuramente).

**6.7. Estados e Ações (Arquivamento – RF005)**
* **Ações disponíveis:** Arquivar / Desarquivar / Excluir (com regra RN003).
* **Mensagem de erro na exclusão indevida:** "Este KR não pode ser excluído, pois possui medições registradas. Para manter o histórico, utilize a opção de arquivamento."

**6.8. Aviso de Inatividade (RN006)**
* **Exibir quando:** 30 dias sem medição.
* **Onde mostrar:** Lista de Objetivos e Lista de KRs.
* **Visual:** Ícone [!] com o Tooltip "KR sem atualização há mais de 30 dias".

**6.9. Tela de Configuração de Pesos (RN005)**
* **Local:** Nova tela (definir o local exato e fluxo de tela).
* **Estrutura (Lista única com):**
  * Nome (KR e Indicadores)
  * Tipo (KR/Indicador)
  * Peso (editável)
* **Regras:** KRs iniciam com peso 1; O sistema aplicará a regra de média ponderada.
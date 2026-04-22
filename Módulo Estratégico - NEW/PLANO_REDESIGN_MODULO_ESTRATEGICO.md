# Plano de Redesign — Módulo Estratégico Channel para Prefeituras
**Versão:** 1.1 · Abril 2026  
**Referência técnica:** Release 2 - Nova Tela de Plano Estratégico (BSC Canvas)  
**Framework:** Angular + PrimeNG + lib de canvas (a definir)  
**Escopo de acesso:** cada município acessa exclusivamente seus próprios dados

---

## 1. Veredicto: PrimeNG atende?

**Sim para ~85% do módulo. Gap crítico apenas no BSC Canvas.**

| Área do módulo | PrimeNG? | Componente |
|---|---|---|
| BSC Canvas com setas | ❌ **Não** | Lib especializada obrigatória |
| Tabelas, listas de KRs, relatórios | ✅ | `p-table`, `p-treeTable` |
| Gráficos de desempenho | ✅ | `p-chart` |
| Kanban (planos de ação) | ✅ | CDK DragDrop + `p-card` |
| Cards de dashboard | ✅ | `p-card`, `p-knob` |
| Painel lateral de detalhe (drawer) | ✅ | `p-drawer` |
| Dialogs e formulários | ✅ | `p-dialog`, `p-inputText` |
| Wizard onboarding PRONAGOV | ✅ | `p-steps` |
| Hierarquia PPA (árvore) | ✅ | `p-tree`, `p-treeTable` |
| Radar de maturidade PRONAGOV | ✅ | `p-chart` tipo radar |

### O gap: BSC Canvas com setas de causa-efeito

O protótipo exige cards arrastáveis entre bandas de perspectiva com **setas cruzando perspectivas**. `p-organizationChart` não entrega isso.

### Decisão de biblioteca de canvas

A avaliação técnica (`Avaliacao_Libs_Canvas_CanvasBSC.docx`) recomenda por cenário:

| Cenário | Biblioteca |
|---|---|
| Orçamento aprovado (>U$5k/dev) | **GoJS + `@gojs/angular`** — zero risco técnico, foco em negócio |
| Sem budget para licença | **Angular CDK + SVG manual** — bezier simples é viável sem custo |
| Time aceita arquitetura híbrida | **React Flow (micro-frontend)** — melhor UX; canvas isolado em React |

> **Pergunta que desbloqueia a decisão:** as setas precisam de roteamento automático (desviar de cards) ou bezier simples como no protótipo é suficiente?  
> O protótipo usa bezier simples. Se aceito → **CDK + SVG resolve sem licença.**

---

## 2. O que o PO quer — análise do protótipo + documentação técnica

A documentação técnica ("Release 2 - Nova Tela de Plano Estratégico") e o protótipo Stratagem são a mesma especificação. O escopo é **um único plano estratégico por município**.

### Estrutura de dados
```
Plano Estratégico  (por município)
  ├── Missão / Visão / Valores  (header expandível, editável)
  ├── Ciclos  (= "Revisões" no sistema legado — Anual / Semestral / Trimestral / Mensal)
  └── Perspectivas  (nome, cor, ordem, layout configuráveis)
       └── Objetivo Estratégico  (card arrastável no canvas)
            ├── Código  (ex: SOC-01, FIN-02)
            ├── Responsável
            ├── % Progresso  (calculado automaticamente dos KRs)
            ├── KRs  (Resultados-Chave: Baseline → Meta → Atual + direção)
            ├── Iniciativas
            │    ├── Atividades Estratégicas  (agrupadores formais)
            │    └── Ações Ad-hoc  (vinculadas a Planos de Ação)
            └── Riscos  (tipo, P × I, criticidade calculada, mitigação, status)
```

> **Atenção de backend:** o que o novo módulo chama de **"Ciclos"** corresponde a **"Revisões"** no sistema legado. Garantir compatibilidade na migração.

### Telas mapeadas (protótipo + doc técnica)

| Tela | Descrição |
|---|---|
| **Canvas principal** | Grade com bandas de perspectiva, cards drag-drop, setas causa-efeito dashed |
| **Header** | Nome do plano, Missão/Visão/Valores (popover 3 colunas), seletor de ciclo |
| **Gerenciar Ciclos** | Modal: nome, ano, tipo; acesso restrito a Administrador/Gestor Estratégico |
| **Configurar Canvas > Perspectivas** | Nome, paleta de cores, drag para reordenar |
| **Configurar Canvas > Layout** | Presets (empilhado / 2 col / 3 col) + linha/coluna/largura por perspectiva |
| **Novo Objetivo** | Código (auto), nome*, descrição, perspectiva, responsável |
| **Drawer: aba KRs** | Cards com Baseline/Meta/Atual, barra de progresso, direção, `+ Adicionar KR` |
| **Drawer: aba Iniciativas** | Atividades Estratégicas + Ações Ad-hoc |
| **Drawer: aba Riscos** | Tipo, P × I, criticidade calculada, mitigação, responsável, status |
| **Listagem de planos** | Nome, tipo, área, status; filtros; ações (editar, permissões, publicar, clonar, aprovação) |
| **Cadastro do plano** | Tab Informações Gerais + Tab Identidade Estratégica (rich text) |
| **Visão Grid** | Alternativa tabular ao canvas — `p-table` com row expansion por perspectiva |

---

## 3. Adaptação municipal — o que muda em relação ao Channel corporativo

O Channel atual é BSC corporativo puro. Para prefeituras, o BSC precisa conviver com a estrutura legal/orçamentária municipal:

```
Promessas de Campanha
  └── Plano de Governo
       └── PPA (Plano Plurianual — 4 anos, obrigatório por lei)
            └── Eixos Temáticos
                 └── Programas PPA
                      ├── KPIs do Programa  →  vinculados aos KRs do objetivo BSC
                      └── Ações PPA         →  vinculadas às Iniciativas do objetivo BSC

         ↕  Crosswalk de alinhamento

Plano Estratégico BSC  (único por município, único por mandato)
  └── Perspectivas (adaptadas ao contexto municipal)
       └── Objetivos
            ├── KRs (= métricas municipais)
            ├── Iniciativas 5W2H
            └── Riscos (incluindo riscos de compliance LRF)
```

### Perspectivas padrão para prefeituras (pré-carregadas, editáveis)

| Perspectiva | Foco municipal | Equivalente Kaplan-Norton |
|---|---|---|
| Cidadão e Sociedade | Entrega de serviços e satisfação do cidadão | Clientes |
| Processos e Serviços Públicos | Eficiência operacional e transformação digital | Processos Internos |
| Capacidade Institucional | Governança, pessoas, tecnologia | Aprendizado e Crescimento |
| Finanças Públicas (LRF) | Equilíbrio fiscal, receita, despesa | Financeira |

---

## 4. Gap analysis: Channel atual → Municipal

### Adaptar (não reescrever) — ~60%

| Funcionalidade atual | Adaptação |
|---|---|
| CRUD de Plano Estratégico | Adicionar campo Mandato (4 anos) e vínculo Plano de Governo |
| Perspectivas (4 Kaplan-Norton) | Pré-carregar perspectivas municipais; manter configurabilidade total |
| Objetivos com responsável e peso | Adicionar tags ODS (1–17) e vínculo a Programa PPA |
| Ciclos / Revisões | Migrar "Revisões" → "Ciclos" com compatibilidade de backend |
| Gestão de Metas (planejado × realizado) | Manter; base para os KRs |
| Planos de Ação Kanban | Manter; adicionar campos 5W2H no formulário de criação |
| Workflow de aprovação | Manter; adaptar nomenclatura para contexto público |
| Listagem e filtros de planos | Manter estrutura; adaptar campos de filtro |
| Relatórios de acompanhamento | Manter base; adicionar relatório no formato PRONAGOV |

### Construir do zero — ~40%

| Funcionalidade nova | Prioridade |
|---|---|
| **BSC Canvas (nova UI — tela principal)** | 🔴 P0 |
| **KRs por objetivo** (Baseline → Meta → Atual, substituindo Indicadores) | 🔴 P0 |
| **Riscos por objetivo** (embutidos no drawer do objetivo) | 🔴 P0 |
| **Vinculação PPA** (crosswalk Objetivo ↔ Programa PPA) | 🟠 P1 |
| **Plano de Governo** (cadastro de promessas de campanha → objetivos BSC) | 🟠 P1 |
| **Radar PRONAGOV** (IMGG/MGI, IGM/CFA, IGOVM/IRB — auto-avaliação da prefeitura) | 🟠 P1 |
| **Tags ODS** nos objetivos (vínculo aos 17 ODS da ONU) | 🟡 P2 |
| **Template Municipal** (plano pré-configurado para onboarding rápido) | 🟡 P2 |
| **Wizard onboarding PRONAGOV** (5 etapas: Diagnóstico → Setup → Kick-Off → Tração → Continuidade) | 🟡 P2 |

---

## 5. Telas detalhadas

### Tela 1: BSC Canvas — tela principal (nova)

**Header fixo:**
- `p-toolbar`: nome do plano, botão Missão/Visão/Valores (`p-popover`), ícone Ciclos (`p-dialog`), `p-select` ciclo ativo, `+ Objetivo`, `+ Perspectiva`, `Configurar Canvas`, botão refresh

**Canvas (lib especializada — fora do PrimeNG):**
- Bandas horizontais coloridas por perspectiva
- Cards de objetivo: código, nome, barra de progresso colorida, contadores (KRs / Iniciativas / Riscos)
- Tags ODS e programa PPA vinculado no card
- Drag-and-drop de cards entre perspectivas
- Setas dashed direcionais causa-efeito entre objetivos
- Botão flutuante "Adicionar relação" para modo de criação de seta
- Clique em card → abre `p-drawer` lateral

**Configurar Canvas (`p-drawer`):**
- Aba Perspectivas: nome editável, paleta de cores, drag para reordenar, remover
- Aba Layout: presets rápidos + linha/coluna/largura individual por perspectiva (até 3 col × 6 linhas) + preview

---

### Tela 1b: Drawer de detalhe do objetivo

**Componente:** `p-drawer` posição right

- Cabeçalho: código, título (editável inline), descrição, `p-progressBar`, botão Editar completo
- `p-tabView`:
  - **KRs** — card por KR: título, Baseline/Meta/Atual, barra de progresso, direção ("maior é melhor" / "menor é melhor"), `+ Adicionar Resultado-Chave`
  - **Iniciativas** — dois grupos colapsáveis:  
    - Atividades Estratégicas (agrupadores com nome + responsável)  
    - Ações Ad-hoc (cards linked ao Kanban de Planos de Ação)
  - **Riscos** — card por risco: nome, descrição, tipo (7 categorias), P / I, badge de criticidade calculada (Baixo/Moderado/Crítico), mitigação, responsável, `p-select` de status (Identificado → Em Mitigação → Mitigado → Aceito)

---

### Tela 2: Listagem de Planos Estratégicos

**Componente:** `p-table` com filtros  
**Colunas:** Nome, Tipo (Estratégico/Gerencial), Área, Status (publicado/despublicado)  
**Filtros:** nome, tipo, área, status  
**Ações por linha:** Editar, Permissões, Publicar/Despublicar, Clonar, Aprovação (Gerencial), Histórico, Remover  
**Ações em lote:** publicação e permissão em massa

---

### Tela 3: Cadastro / Edição do Plano

**Aba 1 — Informações Gerais:**  
Nome, Tipo, Período, Área, Ciclo, "Usar imagem no mapa estratégico?", Publicado

**Aba 2 — Identidade Estratégica:**  
Missão, Visão, Estratégias, Valores Institucionais (rich text — `p-editor`)

---

### Tela 4: Visão Grid (alternativa ao canvas)

**Trigger:** botão `⊞ grid` visível no header de cada perspectiva  
**Componente:** `p-table` com `p-rowExpansion`  
**Colunas:** Código, Objetivo, Responsável, % Progresso, KRs (qtd), Iniciativas (qtd), Riscos (qtd)  
**Row expandida:** lista de KRs com Baseline/Meta/Atual

---

### Tela 5: Plano de Governo / PPA Crosswalk

**Visão árvore (esquerda):** `p-tree` — Mandato → Eixo → Programa PPA → Ação PPA  
**Visão matriz (direita):** `p-table` — linhas = Eixos/Sub-eixos, colunas = Programas PPA, células = cards 5W2H com KPIs  
**Ação:** vincular Objetivo BSC ao Programa PPA via modal seletor

---

### Tela 6: Gestão de KRs e Medições

**Evolução de:** Gestão de Desempenho do Channel  
**Componentes:**
- `p-table` de KRs: objetivo, KR, Baseline, Meta, Atual, % progresso, tendência, direção
- Clique → histórico de medições em `p-chart` (gráfico de linha temporal)
- Importação de medições: `p-fileUpload` (Excel)

---

### Tela 7: Planos de Ação 5W2H (Kanban evoluído)

**Evolução de:** Planos de Ação Kanban do Channel  
**Visual:** CDK DragDrop + `p-card`  
**Formulário de criação — campos 5W2H:**

| Campo | Pergunta |
|---|---|
| O quê? | Nome da ação |
| Por quê? | Justificativa / objetivo vinculado |
| Onde? | Local / secretaria responsável |
| Quando? | Data início e data fim |
| Quem? | Responsável principal + membros |
| Como? | Descrição detalhada |
| Quanto custa? | Orçamento estimado (R$) |

**Vínculos obrigatórios:** Objetivo BSC + KR + Programa PPA

---

### Tela 8: Radar PRONAGOV (auto-avaliação da prefeitura)

**Para:** secretário gestor, equipe técnica PRONAGOV  
**Escopo:** avaliação interna da própria prefeitura — sem comparativo com outros municípios

**Componentes:**
- `p-chart` tipo radar: eixos = IMGG/MGI (Liderança), IGM/CFA (Estratégia), IGOVM/IRB (Controle)
- Três `p-knob`: pontuação atual × meta por índice
- Histórico de evolução dos índices ao longo do mandato: `p-chart` linha

---

## 6. Modelo de dados — entidades principais

```typescript
// Isolamento por município (multi-tenancy padrão — cada município vê só os seus dados)
Municipio { id, nome, estado, porte, cnpj }

// Contexto político-orçamentário (por município)
Mandato    { id, municipioId, inicio: Date, fim: Date }
PlanoGoverno { id, mandatoId, promessas: Promessa[] }
PPA        { id, mandatoId, eixos: EixoPPA[] }
EixoPPA    { id, nome, programas: ProgramaPPA[] }
ProgramaPPA { id, nome, kpis: KPIPrograma[], acoes: AcaoPPA[] }

// Plano estratégico BSC (por município, por mandato)
PlanoEstrategico { id, municipioId, mandatoId, nome, tipo, missao, visao, valores, publicado }
Ciclo       { id, planoId, nome, ano, tipo: 'anual'|'semestral'|'trimestral'|'mensal' }
             // "Ciclos" = "Revisões" no sistema legado — manter compatibilidade de backend
Perspectiva { id, planoId, nome, cor, ordem, layoutLinha, layoutColuna, layoutLargura }

ObjetivoEstrategico {
  id, planoId, perspectivaId, cicloId
  codigo        // ex: SOC-01
  nome, descricao, responsavel
  tagsODS: number[]       // 1–17
  programasPPA: string[]  // IDs de ProgramaPPA
  progressoCalculado: number  // derivado dos KRs
}

ResultadoChave {  // KR
  id, objetivoId
  titulo, baseline, meta, atual
  unidade, direcao: 'maior_melhor'|'menor_melhor'
  progressoCalculado: number
  medicoes: Medicao[]
}

Iniciativa {
  id, objetivoId, tipo: 'estrategica'|'adhoc'
  // campos 5W2H
  oQue, porQue, onde, dataInicio, dataFim, quem, como, orcamento: number
  status: 'backlog'|'em_andamento'|'concluido'|'cancelado'
  krVinculadoId?: string
  programaPPAId?: string
}

Risco {
  id, objetivoId
  titulo, descricao
  tipo: 'operacional'|'financeiro'|'estrategico'|'regulatorio'|'tecnologico'|'pessoas'
  probabilidade: 'baixa'|'media'|'alta'
  impacto: 'baixo'|'medio'|'alto'
  criticidade: 'baixo'|'moderado'|'critico'  // calculado: P × I
  mitigacao, responsavel
  status: 'identificado'|'em_mitigacao'|'mitigado'|'aceito'
}

RelacaoCausaEfeito { id, origemId, destinoId }  // entre ObjetivoEstrategico
```

---

## 7. Roadmap de desenvolvimento

### Fase 0 — Decisões de arquitetura (Semanas 1–2)
- [ ] Definir lib de canvas: GoJS / CDK+SVG / React Flow
- [ ] Responder: setas precisam de roteamento automático ou bezier simples é suficiente?
- [ ] Confirmar mapeamento "Ciclos" → "Revisões" com backend e impacto na migração
- [ ] Validar modelo de dados com time de produto
- [ ] Setup do módulo Angular: módulo isolado, lazy loading, PrimeNG theme municipal

### Fase 1 — BSC Canvas (Sprints 1–4 · ~8 semanas)

| Sprint | Entrega |
|---|---|
| S1 | Canvas shell: bandas de perspectiva, cards estáticos, toolbar completo |
| S2 | Drag & drop entre perspectivas, criação de objetivo, Configurar Canvas (perspectivas + layout) |
| S3 | Setas de causa-efeito (criar, visualizar, remover relações entre objetivos) |
| S4 | Drawer de detalhe (estrutura com 3 abas), Missão/Visão/Valores editável, Gerenciar Ciclos |

**PrimeNG:** `p-toolbar`, `p-select`, `p-drawer`, `p-tabView`, `p-dialog`, `p-popover`  
**Lib canvas:** GoJS / CDK+SVG / React Flow (decisão da Fase 0)

### Fase 2 — KRs e Gestão de Desempenho (Sprints 5–7 · ~6 semanas)

| Sprint | Entrega |
|---|---|
| S5 | CRUD de KRs (Baseline/Meta/Atual/Direção), cálculo de progresso do objetivo |
| S6 | Histórico de medições por KR, gráfico de evolução, Visão Grid (alternativa ao canvas) |
| S7 | Importação de medições via Excel, listagem de planos com filtros e ações |

**PrimeNG:** `p-chart`, `p-table`, `p-rowExpansion`, `p-inputNumber`, `p-fileUpload`

### Fase 3 — Iniciativas e Riscos (Sprints 8–10 · ~6 semanas)

| Sprint | Entrega |
|---|---|
| S8 | Atividades Estratégicas (agrupadores) + Kanban de Ações Ad-hoc com CDK DragDrop |
| S9 | Formulário 5W2H completo, aprovação de iniciativas (workflow) |
| S10 | Gestão de Riscos por objetivo (CRUD, matriz P×I, criticidade calculada, workflow de status) |

**PrimeNG:** CDK DragDrop + `p-card`, `p-badge`, `p-tag`, `p-accordion`

### Fase 4 — Contexto Municipal / PRONAGOV (Sprints 11–13 · ~6 semanas)

| Sprint | Entrega |
|---|---|
| S11 | Cadastro de Mandato, PPA, Eixos, Programas (árvore hierárquica) |
| S12 | Crosswalk PPA ↔ BSC (vinculação Objetivo/KR → Programa PPA, matriz de alinhamento) |
| S13 | Tags ODS nos objetivos, Radar PRONAGOV (auto-avaliação: IMGG/MGI, IGM/CFA, IGOVM/IRB) |

**PrimeNG:** `p-tree`, `p-treeTable`, `p-chip`, `p-chart` radar

### Fase 5 — Relatórios e Onboarding (Sprints 14–15 · ~4 semanas)

| Sprint | Entrega |
|---|---|
| S14 | Relatórios PRONAGOV, exportação PDF/Excel, Plano de Governo |
| S15 | Wizard de onboarding 5 etapas, template municipal pré-configurado |

**PrimeNG:** `p-steps`, exportação

---

## 8. Resumo executivo

| Dimensão | Decisão |
|---|---|
| PrimeNG suficiente? | Para ~85%, sim. Gap crítico apenas no BSC Canvas. |
| Lib de canvas | **Definir na Fase 0** — depende de resposta sobre roteamento automático |
| Atenção de backend | "Ciclos" = "Revisões" no legado — garantir compatibilidade na migração |
| Vocabulário | BSC + OKR híbrido: "KRs" no lugar de "Indicadores" |
| Perspectivas padrão | Cidadão / Processos / Capacidade Institucional / Finanças Públicas |
| Escopo de acesso | Cada município vê exclusivamente seus próprios dados (isolamento padrão) |
| Quanto reaproveitar do Channel | ~60% (adaptar, não reescrever) |
| Quanto é novo | Canvas, KRs, Riscos por objetivo, vinculação PPA, Radar PRONAGOV |
| Tela principal | BSC Canvas — mudança de paradigma em relação ao Channel atual |
| Estimativa total | ~15 sprints (~7,5 meses, time dedicado: 2 devs + 1 PO + 1 QA) |
| Fora do escopo | Painel comparativo entre municípios (cada prefeitura vê só seus dados) |

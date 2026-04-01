# RQ3 — Dev Implementation Brief
## Modalidade: Gestão Estratégica Municipal

> **Referência completa:** [`RQ3_feature_brief.md`](./RQ3_feature_brief.md)  
> **Release:** R1 · **Requisito:** RQ3  
> **Atualizado em:** 2026-03-26  

---

## 🧭 Contexto para o Dev

Esta demanda **não cria novas telas nem componentes**. O objetivo é configurar a plataforma para uma nova modalidade de licenciamento chamada **Gestão Estratégica Municipal**, que restringe o acesso a módulos e funcionalidades que não fazem parte do escopo desse perfil de cliente.

A lógica central é: **verificar se o tenant/licença é do tipo `Gestão Estratégica Municipal` → aplicar ocultações conforme as regras abaixo**.

---

## 📋 Mapa de Implementação

### 1. Menu "Meu Channel"

**O que fazer:** neste contexto de licença, exibir **somente** os itens abaixo. Ocultar todos os demais.

| Item a manter visível | Ação |
|---|---|
| Planos de Ação | ✅ Manter |
| Indicadores | ✅ Manter |
| Riscos Corporativos | ✅ Manter |
| Reuniões | ✅ Manter |
| Todos os outros itens do menu | ❌ Ocultar |

**Onde verificar no sistema:** Configuração de exibição de itens do menu "Meu Channel" — provavelmente controlada por flags de licença/perfil.

---

### 2. Módulo de Estratégia

**O que fazer:** ocultar submódulos e remover ações específicas dentro do módulo.

#### 2.1 — Submódulos a ocultar
| Submódulo | Ação |
|---|---|
| Portfólios | ❌ Ocultar do nav do módulo |
| Programas | ❌ Ocultar do nav do módulo |

#### 2.2 — Configurações a desativar
| Item | Onde fica | Ação |
|---|---|---|
| "Consultar proposta de projetos" | Configurações do módulo de Estratégia | ❌ Ocultar a opção |

#### 2.3 — Planos Estratégicos → Objetivos
| Item | Onde fica | Ação |
|---|---|---|
| Associação com **Projetos** | Ícone "Mais opções" dentro de um Objetivo | ❌ Remover a opção do menu |
| Associação com **Programas** | Ícone "Mais opções" dentro de um Objetivo | ❌ Remover a opção do menu |
| Painel de associação com **Projetos** | Tela de detalhe do Objetivo Estratégico | ❌ Ocultar a seção/painel |
| Painel de associação com **Programas** | Tela de detalhe do Objetivo Estratégico | ❌ Ocultar a seção/painel |

> ⚠️ **Atenção:** A tela de Objetivos Estratégicos passou por alterações no RQ1/RQ2 (adição de seções de Plano de Ação e Grupo de Ações). As ocultações aqui **referem-se exclusivamente às associações com Projetos e Programas**, que não fazem parte dessa modalidade. As seções de Plano de Ação e Grupo de Ações adicionadas no RQ1/RQ2 **devem ser mantidas**.

---

### 3. Módulo de Desempenho

**O que fazer:** ocultar relatório específico e restringir funcionalidades de cadastro.

#### 3.1 — Relatórios
| Relatório | Ação |
|---|---|
| "Painel de Indicadores de Projetos" | ❌ Ocultar da listagem de relatórios |

#### 3.2 — Cadastro de Indicadores
| Item | Onde fica | Ação |
|---|---|---|
| Funcionalidade **ICP** | Tela de cadastro de Indicador | ❌ Ocultar |
| Campo **"Módulo"** na fórmula do indicador | Configuração de fórmula | Manter apenas a opção **"Área"** — remover todas as outras opções do campo |

---

### 4. Módulo de Projetos e Demandas

**O que fazer:** ocultar o módulo inteiro da navegação e acesso.

| Item | Ação |
|---|---|
| Módulo "Projetos e Demandas" inteiro | ❌ Ocultar completamente (nav, links, acessos diretos) |

---

### 5. Menu de Ajuda ( ? )

**O que fazer:** remover as opções listadas abaixo do menu de ajuda.

| Opção a remover | Ação |
|---|---|
| Tutorial Contratos | ❌ Ocultar |
| Tutorial Gerenciamento Ágil | ❌ Ocultar |
| Tutorial Operações | ❌ Ocultar |
| Tutorial Projetos | ❌ Ocultar |
| Tutorial Portfólios | ❌ Ocultar |
| Tutorial do Colaborador | ❌ Ocultar |
| Tutorial Visão Geral e Navegação | ❌ Ocultar |
| Acesso a Mobile | ❌ Ocultar |
| Usuários Administradores Totais | ❌ Ocultar |

---

### 6. Outras configurações globais

| Item | Ação |
|---|---|
| **Módulo Agile** | ❌ Ocultar funcionalidade (inteiro) |
| **Analytics / BI** | ✅ **Ativar a flag de licença** do módulo "Channel Analytics" para esta modalidade. Trata-se de um serviço contratado (flag de contrato), sem toggle interno no painel admin. Acionar a equipe de licenças da JExperts para ativar no tenant desta modalidade. |

---

## ✅ Critérios de verificação (para QA e auto-validação)

Após implementar, validar com um usuário ou tenant configurado na modalidade **Gestão Estratégica Municipal**:

- [ ] "Meu Channel" exibe **somente**: Planos de Ação, Indicadores, Riscos Corporativos e Reuniões
- [ ] No módulo de Estratégia, **Portfólios** e **Programas** não aparecem na navegação
- [ ] A opção "Consultar proposta de projetos" não aparece nas configurações de Estratégia
- [ ] No objetivo estratégico, o menu "Mais opções" **não contém** as opções de associação com Projetos ou Programas
- [ ] A tela de detalhe do objetivo estratégico **não exibe** os painéis de Projetos e Programas
- [ ] As seções de **Plano de Ação** e **Grupo de Ações** (do RQ1/RQ2) **continuam visíveis** no objetivo
- [ ] O relatório "Painel de Indicadores de Projetos" **não aparece** no módulo de Desempenho
- [ ] No cadastro de indicadores, a funcionalidade **ICP não está acessível**
- [ ] No campo "Módulo" da fórmula do indicador, **somente "Área"** está disponível como opção
- [ ] O módulo **Projetos e Demandas inteiro não está acessível** (nem via nav, nem via URL direta se possível)
- [ ] O menu **( ? )** exibe somente os tutoriais/opções não listados para ocultação
- [ ] O **Módulo Agile não está acessível**
- [ ] O **Channel Analytics está habilitado** e acessível para o tenant configurado nesta modalidade

---

## 🔗 Dependências e pontos de atenção

| Ponto | Detalhe |
|---|---|
| **RQ1/RQ2 já implementado** | As seções de Plano de Ação e Grupo de Ações no Objetivo Estratégico são do release anterior — **não regredir** |
| **Escopo desta modalidade** | As ocultações se aplicam **somente** a tenants/licenças da modalidade Gestão Estratégica Municipal — não afetar outros perfis |
| **Controle por licença vs. perfil** | Confirmar internamente se a flag de modalidade está em nível de tenant, grupo ou usuário — isso impacta onde a condição é verificada |
| **Analytics/BI** | ✅ **Confirmado (doc 18, pp. 60-61):** é uma flag de contrato. O módulo "Channel Analytics" requer ativação pelo time de licenças da JExperts — **não há UI a desenvolver**. Garantir que a flag esteja ativa para tenants desta modalidade. |

---

*Documento gerado como handoff de design → dev. Dúvidas, consultar o feature brief completo ou acionar o designer responsável.*

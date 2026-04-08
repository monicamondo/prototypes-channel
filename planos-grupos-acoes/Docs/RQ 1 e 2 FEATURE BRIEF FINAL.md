# Feature: Associação de Planos de Ação e Grupos de Ações ao Objetivo Estratégico

## 1. Objetivo
Permitir que Planos de Ação sejam vinculados diretamente a Objetivos Estratégicos e introduzir o conceito de Grupo de Ações como forma de organização dessas iniciativas.

## 2. Contexto de negócio
A melhoria visa aumentar a governança do planejamento estratégico, permitindo que ações operacionais contribuam diretamente para os objetivos estratégicos, com melhor organização e visibilidade.

## 3. Estado atual da interface
- Existe tela de Objetivo Estratégico
- Associação atual segue padrão da tela de Iniciativas
- Não existem seções específicas para Plano de Ação ou Grupo de Ações
- Não há visão consolidada de vínculos

(Baseado na reunião) :contentReference[oaicite:0]{index=0}

## 4. Mudança solicitada

Adicionar duas novas seções dentro do Objetivo Estratégico:

### 4.1 Seção: Plano de Ação
- Listagem de planos disponíveis
- Associar / desassociar
- Filtros (nome, status, área, responsável)
- Toggle: "mostrar apenas associados"
- Histórico de vínculo

### 4.2 Seção: Grupo de Ações
- Listagem de grupos
- Criar novo grupo
- Associar / desassociar grupos
- Modal para selecionar planos dentro do grupo
- Estrutura visual igual à tela de Iniciativas

(Baseado no RF001 e RF002) :contentReference[oaicite:1]{index=1}

---

## 5. Regras funcionais

### Vínculo
- Plano pode ser vinculado a múltiplos objetivos (N:N)
- Plano pode estar em múltiplos grupos (em objetivos diferentes)
- NÃO pode:
  - estar direto no objetivo e dentro de grupo do mesmo objetivo

### Histórico
Registrar:
- usuário
- data/hora
- justificativa

### Permissão
- apenas gestores podem criar/editar vínculos

---

## 6. Regras de UX

- Interface deve seguir padrão da tela de Iniciativas
- Estrutura deve ser familiar (baixa curva de aprendizado)
- Ação de associar deve ser simples e direta
- Diferenciar visualmente:
  - associação direta
  - associação via grupo

(Reforçado na reunião) :contentReference[oaicite:2]{index=2}

---

## 7. Restrições

- NÃO alterar layout existente do objetivo
- NÃO criar novos padrões visuais
- reutilizar componentes existentes
- manter consistência com módulo atual

---

## 8. Regras críticas (alertas)

### Duplicidade
Mensagem:
"Este Plano de Ação já está vinculado diretamente a este Objetivo Estratégico e não pode ser incluído em um Grupo de Ações do mesmo objetivo."

:contentReference[oaicite:3]{index=3}

---

## 9. Comportamentos importantes

- Modal para selecionar planos ao criar grupo
- Barra de progresso deve seguir padrão do módulo ágil
- Lista deve permitir filtros + paginação

---

## 10. Critérios de aceite

- Plano aparece corretamente vinculado ao objetivo
- Grupo exibe planos associados
- Não permite duplicidade
- Interface mantém padrão existente
- Usuário entende claramente o que está associado

---

## 11. Dúvidas abertas (da reunião)

- Onde posicionar acesso (menu vs botão direto)
- Frequência de uso (impacta visibilidade da feature)
- Melhor forma de apresentar vínculo entre planos

:contentReference[oaicite:4]{index=4}
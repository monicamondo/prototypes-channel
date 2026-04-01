# Interface Governance

## Contexto
Este projeto representa um sistema legado em produção.
Toda nova funcionalidade deve respeitar a interface atual.

## Regras obrigatórias

1. NÃO alterar layout existente sem solicitação explícita
2. NÃO criar novos componentes fora do design system
3. NÃO alterar espaçamentos base
4. NÃO alterar tipografia
5. NÃO alterar estrutura de grid

## Permissões

O agente pode:
- Inserir novos elementos dentro da estrutura existente
- Reorganizar conteúdo apenas se solicitado
- Sugerir melhorias, mas não aplicar automaticamente

## Fonte de verdade

- Figma Make: representa a UI atual
- PDFs: representam o design system
- Código legado: comportamento real

## Output esperado

Sempre gerar:
- proposta de UI
- justificativa UX
- impacto no fluxo atual
- lista de componentes utilizados
RQ005 — Rastreabilidade entre Planos de Ação


1. Objetivo

Implementação da capacidade de relacionar livremente Planos de Ação entre si, estabelecendo uma conexão semântica e bidirecional.

Essa funcionalidade permite que os usuários identifiquem planos que possuem sinergia, dependências informais ou temas em comum, facilitando a navegação e a visão integrada da operação, sem impor uma hierarquia ou relação de precedência entre os planos.

2. Descrição Geral da Funcionalidade

A funcionalidade de rastreabilidade permite:

Associação Bidirecional N:N
O sistema deve permitir que um Plano de Ação seja vinculado a múltiplos outros planos.

Ao associar o Plano A ao Plano B, o Plano B deverá exibir automaticamente o Plano A como plano correlato, garantindo uma relação bidirecional automática.

Os planos de ação disponíveis para vínculo serão exclusivamente os planos de ação de área.

A funcionalidade de vincular estará disponível somente no módulo de Plano de Ação do Plano Estratégico.

A vinculação entre planos não formarão estruturas hierárquicas ou em árvore. O relacionamento será sempre direto entre origem e destino, sem propagação em cadeia.

Exemplo: ao vincular o Plano A ao Plano B, e o Plano B ao Plano C, o Plano A exibirá apenas o Plano B como correlato, não sendo exibido o Plano C.

Regras de acesso entre Planos vinculados: O vínculo entre planos não altera permissões de acesso. Ou seja: Usuários do Plano A não terão acesso automático ao Plano B; O acesso continuará respeitando as regras atuais (àrea) do sistema.

3. Interface de Gerenciamento de Correlatos
O sistema deverá disponibilizar uma interface para gerenciamento das vinculação contendo:

- Componente de busca de planos de ação
- Selecionar múltiplos planos de ação
- Ações para adicionar ou remover correlações
- A seleção deverá ocorrer por meio de modal.


4. Motor de Busca e Filtragem
O sistema deverá permitir localizar planos candidatos à vinculação através de:
- título do plano
- código do plano
- status
- responsável
- área
- tags
- período


5. Interface Recomendada - Visualização de Planos Vinculados
5.1 Área da Rastreabilidade (dentro dos Detalhes do Plano)

- A visualização poderá ocorrer em formato de:

Cards/Chips  
Lista compacta

- Cada item deverá permitir:
abrir o plano correlato 
remover o vínculo (apenas o Gestor do Plano de ação de origem)


6. Regras de Negócio (RN)
- O sistema deve impedir que um Plano de Ação seja associado a ele mesmo. Não deve ser listado.
- O sistema não deve permitir a criação de mais de um vínculo entre o mesmo par de planos.
Ex: não será permitido ter a correlação da seguinte forma:
A (origem) → B (destino) e  B (origem) → A (destino)
- Planos Finalizados mantêm seus vínculos existentes, mas não podem receber novas correlações a menos que o usuário tenha permissão administrativa.


7. A interface deverá suportar listas extensas de correlatos, utilizando:

- paginação

- carregamento sob demanda


7. Estórias do Usuário (User Stories)
Eu como Gestor de Projeto, quero relacionar meu plano de ação ao plano de outro departamento que trata de um tema similar, para que possamos trocar boas práticas e evitar ações redundantes.

Critérios de Aceite: O vínculo deve ser visível para ambos os gestores; Deve ser possível clicar no plano correlato e ser redirecionado para ele.

Eu como Analista de Operações, quero filtrar os planos por "Área" e "Tags" ao buscar um correlato, para que eu encontre rapidamente o plano específico em uma base com milhares de registros.

Critérios de Aceite: Os filtros devem ser cumulativos; A busca deve retornar resultados em tempo real ou com latência mínima.

Eu como Responsável por um Plano, quero receber um aviso quando alguém correlacionar o plano de outra área ao meu, para que eu tome ciência de que meu trabalho está sendo usado como referência ou possui dependência externa.

Critérios de Aceite: A notificação deve conter o nome do plano correlacionado e quem realizou a ação.

8. Orientações para Design da Interface
Local: Menu do Plano estratégico -> Plano de ação → icone para planos “correlacionados”

Criar um icone na opção de ferramentas para que seja direcionada a nova tela de planos de ação vinculados.

Tela: Correlação entre Planos de Ação

O designer deverá projetar os componentes de interface que permitam visualizar, adicionar e remover correlações entre Planos de Ação.

A proposta de layout deve contemplar os seguintes elementos:

8.1 Visualização de Planos Correlatos
Na tela de detalhamento do Plano de Ação, deve existir uma seção chamada:
- “Planos Correlacionados” ou “Planos Relacionados” ?
- Essa seção deve apresentar:
- Lista de planos correlacionados ao plano atual
- Visualização em formato de:
- cards/chips
- lista compacta
- Cada item deverá apresentar:
- Nome do plano
- Código do plano
- Status do plano
- Gráfico com andamento das ações
- Data limite do plano de ação
- Ação para abrir o plano
- Ação para remover a correlação (para o plano de ação de origem que estiver vinculado)

8.2 A interface deve permitir navegação rápida para o plano correlato.

8.3 Adicionar Planos Correlatos
Deverá existir um botão de ação:

“Adicionar Plano Correlato”

Ao clicar, o sistema deverá abrir um modal de seleção de planos contendo:

campo de busca por texto

filtros para:

- status
- responsável
- área
- tags
- período
- lista de resultados
- opção de associar (imagem 1)
- Mensagem de confirmação para associar
- opção de desassociar (imagem 2)
- Mensagem de confirmação para desassociar  (imagem 3)

A interface deve permitir selecionar um ou mais planos e confirmar a vinculação.


9. Usabilidade e Performance
A interface deve considerar:

- suporte a grande volume de planos
- carregamento paginado ou sob demanda
- indicação visual clara dos planos já correlacionados
-  Ação: mostrar os planos de ação associados/correlacionados 

10. Estados da Interface
O design deve prever os seguintes estados:
- sem planos correlatos (informar mensagem: Não existem plano de ação correlacionados)
- carregando resultados (filtros)
- lista com múltiplos correlatos (mostrar correlacionados)
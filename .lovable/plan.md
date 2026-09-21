# Plano técnico — Jogo "Conquista de Setores" + ajustes estruturais

## Observação importante antes de começar

No código atual **não existem dois jogos de quiz**. A seção "Missões" hoje tem três cards de expedição (MX-12, MX-09, MX-18) com interações simples de toast. O plano presume que "os dois jogos de quiz" se referem a esses cards/experiências existentes: **nada em Missões será alterado ou removido** — o novo jogo entra como uma opção adicional. Se os quizzes existem em outra versão, avise antes da aprovação.

## Respostas às perguntas técnicas

**Rotas e componentes reutilizados (nada será recriado):**
- `/explorar` (ExplorePage) — mapa, regiões e cards de território: preservados.
- `/territorio/$territoryId` (TerritoryPage) — página de detalhes e botão "Adquirir território": preservados.
- `/missoes` (MissionsPage) — cards existentes intactos; o jogo entra como nova seção/card.
- `/minha-base` (BasePage) — adaptada para listar vários territórios.
- `/marketplace` (MarketplacePage) — mesma página, conectada aos dados do jogador.
- `/passaporte` (PassportPage) — rota mantida; apenas sai do menu lateral.
- Estado global: `src/lib/marsia-context.tsx` (useMarsia) — será estendido, não substituído.

**Onde está o fluxo "Adquirir território":**
`src/components/marsia-pages.tsx`, componente `TerritoryPage`: modal de confirmação → etapa de nome → `acquire(name)` do `marsia-context.tsx`, que hoje grava `{ acquired, baseName }` em `sessionStorage` ("marsia-state").

**Como os territórios serão associados ao jogador:**
O `marsia-context.tsx` passará a manter uma lista de territórios do jogador (`ownedTerritories`), cada um com: id, código, nome, região, área, raridade, nível, defesa, produção de moedas, estruturas, escudo e histórico. A função `acquire()` atual passará a criar o primeiro registro completo nessa lista (M-042), mantendo compatibilidade com `acquired`/`baseName` que as telas atuais já usam. Migração de `sessionStorage` para `localStorage` com leitura do formato antigo para não perder o estado de quem já adquiriu.

**Arquivos alterados:**
- `src/lib/marsia-context.tsx` — estendido (territórios, moedas, ações do jogo, persistência em localStorage).
- `src/components/marsia-pages.tsx` — apenas correção de enquadramento do mapa em ExplorePage (ver item 1).
- `src/components/marsia-secondary-pages.tsx` — BasePage adaptada; MissionsPage ganha o card/seção do novo jogo sem tocar nos existentes.
- `src/components/marsia-marketplace.tsx` — anúncios conectados aos territórios/recursos reais do jogador.
- `src/components/marsia-shell.tsx` — remoção do item "Meu Passaporte" do menu lateral.
- Novo: `src/components/marsia-conquest.tsx` — a tela do jogo "Conquista de Setores".
- `src/routes/` — nenhuma rota nova obrigatória; o jogo abre dentro de `/missoes` (ver abaixo).

**Como Minha Base exibirá vários territórios:**
A página ganha um seletor de território (abas/cards no topo). Cada território mostra: nome, região, área, nível, defesa, produção, estruturas, escudo e botões de ação (evoluir, construir, coletar moedas). Com um único território (M-042) o layout atual é preservado; novos territórios aparecem como cards adicionais. Botão "Passaporte do Explorador" (link para `/passaporte`) no cabeçalho da página. O estado vazio atual ("Aguardando coordenadas") é mantido para quem não adquiriu nada.

**Como o Marketplace será conectado:**
- A lista de anúncios combina: anúncios simulados existentes (l1–l6) + anúncios do jogador salvos em localStorage.
- Ao anunciar, o formulário passa a oferecer "Meus territórios" (somente territórios adquiridos) e "Recursos conquistados" (produzidos no jogo) como itens anunciáveis — além da opção livre atual.
- Anúncio de território carrega junto nível, estruturas e evolução no card.
- Status (ativo/vendido/cancelado) persistido em localStorage. Valores e transações continuam simulados, com o aviso legal mantido.

**Como os quizzes/missões existentes permanecem intactos:**
Os três cards de missão, o painel de progresso da temporada e todas as interações atuais ficam byte a byte iguais. O jogo entra como um quarto bloco na página, sem alterar os componentes existentes.

## O jogo "Conquista de Setores"

Dentro de `/missoes`, um novo card em destaque "Conquista de Setores" abre o modo de jogo (painel expandido na própria página ou sub-rota `/missoes/conquista` — recomendo sub-rota para manter Missões leve; a decisão final fica na implementação, sem impacto nas telas atuais).

Regras simuladas (100% frontend, localStorage):
- **Economia**: cada território do jogador produz moedas por ciclo (ex.: a cada X segundos ou por ação "Coletar"); moedas são o saldo do jogador.
- **Evoluir base**: gasta moedas, sobe o nível do território e desbloqueia estruturas.
- **Construir estruturas**: Habitat, Antena, Laboratório, Estufa (reutiliza os nomes/ícones atuais) — cada uma concede bônus (defesa, produção, escudo).
- **Defesa e escudo**: valor de defesa por território; escudo ativável por tempo limitado.
- **Atacar rivais simulados**: lista de rivais fictícios (Luna, Kai, Nova...) com poder de defesa; ataque tem custo, chance de sucesso baseada em defesa vs. ataque, e resultado registrado (vitória: saque de moedas; derrota: perda parcial). Sem multiplayer real.
- **Histórico**: log de evoluções, construções, coletas, ataques e defesas por território, visível na base e no jogo.

Visual: mesmo HUD futurista (painéis translúcidos, fonte mono, detalhes em vermelho/laranja marciano), toasts de feedback e microanimações já existentes.

## Item 1 — Correção do enquadramento do mapa

Hoje o mapa (`ExplorePage`) usa imagem com `object-cover` em container de altura fixa (590px), cortando regiões nas bordas (Olympus Mons, Utopia, Hellas ficam parcialmente escondidas conforme a largura). Correção: o container passa a respeitar a proporção real da imagem (aspect-ratio 16:9 com altura mínima) para que o mapa inteiro fique visível em desktop e mobile, mantendo marcadores posicionados em %, overlay, painéis e todos os botões/dados existentes. Nenhum dado ou região muda.

## Item 2 — Minha Base com vários territórios

Coberto acima: seletor de territórios + painéis de nível, defesa, produção, estruturas e ações por território, tudo vindo do contexto estendido.

## Item 3 — Passaporte

Remover o item "Meu Passaporte" da navegação lateral (desktop) em `marsia-shell.tsx`. A rota `/passaporte` e a página continuam funcionando. Em Minha Base, botão "Passaporte do Explorador" (ícone Fingerprint) com link para `/passaporte`. Nenhum conteúdo duplicado. Verificação: nenhum outro link quebra, pois o passaporte continua acessível por URL e pelo novo botão.

## Item 4 — Marketplace integrado

Coberto acima: mesma página, anúncios do jogador persistidos, somente itens que ele possui, estruturas/evolução acompanhando o anúncio, aviso de simulação mantido.

## Riscos

- **Migração de estado**: quem já tem `marsia-state` antigo em sessionStorage não pode perder a Base Aurora → leitura de compatibilidade na primeira carga.
- **Escopo do contexto**: o contexto cresce bastante → manter a API atual (`acquired`, `baseName`, `acquire`, `renameBase`) funcionando para não quebrar Dashboard, Território e Passaporte.
- **Mapa**: alterar o enquadramento sem desalinhar os marcadores em % → testar desktop e mobile com Playwright.
- **Persistência**: localStorage com versão de schema (`marsia-game-v1`) para futuras migrações seguras.

## Ordem segura de implementação

1. Estender `marsia-context.tsx` (territórios, moedas, persistência localStorage, compatibilidade retroativa) — sem mudar telas.
2. Corrigir enquadramento do mapa em ExplorePage.
3. Adaptar Minha Base (lista de territórios + botão Passaporte).
4. Remover "Meu Passaporte" do menu lateral.
5. Implementar o jogo "Conquista de Setores" (componente novo + entrada em Missões).
6. Conectar Marketplace aos territórios/recursos do jogador.
7. Verificação visual completa (desktop 1280px e mobile 390px) em todas as rotas: Início, Explorar, Território, Missões, Comunidade, Marketplace, Mensagens, Minha Base, Passaporte.

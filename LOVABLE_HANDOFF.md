# MARSIA — Handoff para continuação no Lovable

## 1. Objetivo e limites do projeto

MARSIA é um MVP front-end de uma plataforma futurista de exploração social de Marte. A jornada principal é:

`entrar → explorar Marte → encontrar um território → registrar simbolicamente → criar uma base → participar de missões → interagir com outros exploradores`

Os territórios são conceituais e simbólicos. Não representam propriedade imobiliária real em Marte. O produto deve continuar parecendo uma plataforma de exploração, não um e-commerce convencional.

### Escopo atual

- Front-end visual e interativo, com dados mockados.
- Navegação funcional e responsiva.
- Persistência local mínima para a aquisição do território e a abertura introdutória.
- Sem autenticação real, pagamentos, backend, banco de dados, áudio em salas, mensageria real ou APIs de negócio.

### Restrições para próximas alterações

- Não criar backend, banco, tabelas ou migrations.
- Não executar SQL.
- Não conectar a aplicação ao Supabase nem adicionar um cliente Supabase.
- Não substituir os mocks por dados remotos sem uma decisão explícita futura.
- Preservar layout, comportamento e identidade visual existentes.
- Preservar `src/routeTree.gen.ts` como arquivo gerado; não editar manualmente.
- Evitar reescrever histórico Git publicado (`force push`, rebase/amend/squash de commits já enviados), pois a branch está sincronizada com o Lovable.

## 2. Stack e execução

- React 19 + TypeScript.
- TanStack Start e TanStack Router com roteamento baseado em arquivos.
- Vite 8 usando `@lovable.dev/vite-tanstack-config`.
- Tailwind CSS 4 e CSS próprio em `src/styles.css`.
- Componentes Radix/shadcn disponíveis em `src/components/ui/`.
- Ícones de `lucide-react`.
- Toasts com `sonner`.
- TanStack Query é inicializado no shell, mas não há queries de dados no produto atual.
- Bun possui lockfile (`bun.lock`), embora o README também descreva execução com npm.

Comandos existentes:

```sh
npm install
npm run dev
npm run build
npm run lint
npm run format
```

O projeto publicado está indicado no README como `https://marsia-explore-future.lovable.app`, e o projeto Lovable como `d9730653-a8e8-4901-9b8c-c768daca81fa`.

## 3. Arquitetura e arquivos principais

```text
src/
├── assets/
│   └── mars-map.jpg                 # mapa usado no atlas e no território
├── components/
│   ├── marsia-shell.tsx             # shell, menus, áudio de interface, provider e toasts
│   ├── marsia-intro.tsx             # abertura audiovisual da primeira visita
│   ├── marsia-pages.tsx             # Dashboard, Explorar e Território
│   ├── marsia-secondary-pages.tsx   # Base, Missões, Passaporte e Comunidade
│   ├── marsia-feed.tsx              # feed social interativo simulado
│   ├── marsia-marketplace.tsx       # marketplace simulado
│   ├── marsia-messages.tsx          # mensagens simuladas
│   ├── ui.tsx                       # componentes visuais específicos da MARSIA
│   └── ui/                           # primitives shadcn/Radix
├── lib/
│   ├── marsia-context.tsx           # estado compartilhado de aquisição/base
│   ├── lovable-error-reporting.ts   # telemetria de erro no preview Lovable
│   ├── error-capture.ts             # captura/normalização de erros SSR
│   ├── error-page.ts                # fallback HTML de erro SSR
│   └── utils.ts                     # utilitário de classes
├── routes/                           # rotas TanStack baseadas em arquivos
├── routeTree.gen.ts                  # gerado automaticamente
├── router.tsx                        # criação do router e QueryClient
├── start.ts                          # middleware de erro e CSRF do TanStack Start
├── server.ts                         # wrapper SSR e fallback de erro
└── styles.css                        # tokens e estilos globais MARSIA
```

Configurações importantes:

- `vite.config.ts`: usa o preset do Lovable e aponta o entry de servidor para `src/server.ts`. O próprio arquivo alerta para não duplicar plugins já fornecidos pelo preset.
- `tsconfig.json`: TypeScript estrito e alias `@/* → ./src/*`.
- `components.json`: configuração shadcn no estilo `new-york`, CSS variables e ícones Lucide.
- `src/routes/README.md`: documenta as convenções obrigatórias do roteamento TanStack.
- `AGENTS.md`: contém o aviso de sincronização Git com Lovable.

## 4. Shell, navegação e comportamento global

`MarsiaShell` envolve todas as páginas com `MarsiaProvider` e oferece:

- Header fixo com marca MARSIA, status “Sistema online”, SOL 0451 e atalho de mensagens.
- Sidebar desktop com: Início, Explorar Marte, Missões, Comunidade, Marketplace, Mensagens, Minha Base e Meu Passaporte.
- Navegação mobile fixa com seis itens: Início, Explorar, Missões, Mercado, Rede e Minha Base. Passaporte e Mensagens não aparecem na barra inferior, embora as rotas existam; mensagens possui atalho no header.
- Rodapé com o aviso legal sobre o caráter conceitual dos territórios.
- Scanlines globais e estética HUD.
- Toasts globais no canto superior direito.
- Tons curtos sintetizados com Web Audio API em mudanças de rota e cliques em botões. Não há arquivo de áudio para esses tons.
- Tratamento visual para página não encontrada e erros de renderização.

### Abertura inicial

`MarsiaIntro` aparece somente quando a entrada ocorre pela rota `/` e a chave `marsia-intro-seen` ainda não existe no `localStorage`.

- Exibe grid, scanner, marca, loader e três sinais revelados em sequência.
- O usuário precisa iniciar a experiência para disparar o áudio, respeitando as restrições de autoplay do navegador.
- Pode pular a abertura ou tentar reativar o áudio se o navegador o bloquear.
- Finaliza automaticamente cerca de 7 segundos após o início.
- Ao terminar, grava `marsia-intro-seen=true` em `localStorage`.

## 5. Rotas e páginas

Cada arquivo em `src/routes/` apenas configura a rota/metadados e aponta para um componente de página. Todas as páginas possuem título, descrição e metadados Open Graph/Twitter.

| Rota | Componente | Conteúdo e comportamento |
| --- | --- | --- |
| `/` | `DashboardPage` | Centro de comando com identidade Marcos Almeida, nível 12, 7.450/9.000 XP, território/região/área/missões, Expedição Elysium e atividade online. O card de território reage à aquisição e ao nome da base. |
| `/explorar` | `ExplorePage` | Atlas interativo sobre `mars-map.jpg`, seis regiões selecionáveis e três cards de território. Elysium leva ao M-042; outras regiões disparam um toast de escaneamento. |
| `/territorio/$territoryId` | `TerritoryPage` | Detalhes premium do M-042, mapa, coordenadas, atributos, progresso e pontos de interesse. Fluxo modal de aquisição com loading simulado, confirmação, nome da base, toast e redirecionamento. Apesar do parâmetro dinâmico, o conteúdo atual é fixo em M-042. |
| `/minha-base` | `BasePage` | Antes da aquisição, mostra estado vazio com CTA para explorar. Depois, mostra a base nomeada, progresso, telemetria, renomeação e quatro estruturas (duas bloqueadas). |
| `/passaporte` | `PassportPage` | Identidade digital de Marcos Almeida, código MRS-07-1142-ELYS, nível, território/área condicionais à aquisição, badges e base vinculada. |
| `/missoes` | `MissionsPage` | Três missões mockadas, seleção local da missão ativa, toast de entrada, uma missão bloqueada por nível e progresso da temporada. |
| `/comunidade` | `CommunityPage` | Feed social interativo, equipe Elysium Explorers, métricas e três salas Mars Comms apenas visuais. |
| `/marketplace` | `MarketplacePage` | Seis anúncios mockados, filtros, contadores, negociação simulada, link para mensagens e modal para publicar anúncio local. |
| `/mensagens` | `MessagesPage` | Quatro conversas mockadas, layout adaptado para mobile, envio local e resposta automática aleatória após 1,4 s. |

## 6. Componentes específicos do produto

Em `src/components/ui.tsx`:

- `Eyebrow`: rótulo pequeno em fonte monoespaçada e cor primária.
- `Progress`: barra de progresso simples e animada.
- `Stat`: bloco de métrica com rótulo, valor e texto auxiliar opcional.
- `Panel`: seção com o estilo `.hud-panel`.
- `PageHeader`: cabeçalho padronizado das páginas.
- `ActionLink`: CTA com rotas tipadas; trata o parâmetro do território M-042.
- `ActivityDot`: indicador online pulsante.
- `Structure`: card de módulo de base, com estado bloqueado opcional.
- `CommsRoom`: linha visual de uma sala de áudio simulada.

Componentes de domínio adicionais:

- `MarsiaShell`: composição global e navegação.
- `MarsiaIntro`: experiência inicial.
- `CommunityFeed`: criação de post, likes, respostas e atividades pendentes.
- `MarketplacePage`: catálogo/filtros/formulário de anúncio.
- `MessagesPage`: lista de conversas e chat simulado.

`src/components/ui/` contém primitives shadcn/Radix para accordion, alerts, dialogs, forms, inputs, menus, popovers, tabs, tables, carousel, chart, sidebar, tooltip e outros. A maior parte está disponível como biblioteca local, mas as páginas de produto usam principalmente os componentes específicos acima e HTML estilizado diretamente.

## 7. Estado, persistência e fluxos interativos

### Estado compartilhado persistido na sessão

`MarsiaProvider` expõe:

```ts
{
  acquired: boolean;
  baseName: string;
  acquire(name: string): void;
  renameBase(name: string): void;
}
```

- Valores iniciais: `acquired=false` e `baseName="Base Aurora"`.
- A chave `marsia-state` no `sessionStorage` guarda `{ acquired, baseName }`.
- A aquisição e a renomeação produzem toasts.
- Como é `sessionStorage`, o estado sobrevive a reloads na mesma aba, mas não é uma conta persistente nem sincronizada entre dispositivos/abas.

### Estado apenas em memória

- Região selecionada no mapa.
- Modal/etapas/loading da aquisição.
- Missão ativa.
- Posts, likes, respostas e posts pendentes do feed.
- Filtro, anúncios criados e formulário do marketplace.
- Conversas, mensagens enviadas e respostas automáticas.

Esses estados voltam aos mocks originais ao recarregar a página.

### Tempos simulados

- Aquisição: validação de 900 ms.
- Publicação no feed: 550 ms.
- Novas atividades do feed: uma a cada 14 s, até consumir três itens; o usuário precisa carregá-las no feed.
- Publicação de anúncio: 600 ms.
- Resposta automática de chat: 1,4 s.

## 8. Dados mockados

### Identidade e progresso

- Usuário: Marcos Almeida / `@marcos.pioneer`.
- Explorer ID: 07-1142; passaporte MRS-07-1142-ELYS.
- Título: Pioneer; nível 12; 7.450/9.000 XP.
- Base padrão: Base Aurora.
- Território principal: M-042, Elysium Planitia, 2.500 m², raro, +1,2 km, exploração em 42%, preço simbólico R$ 99.

### Regiões do atlas

- Olympus Mons.
- Valles Marineris.
- Elysium Planitia (destaque e único território navegável).
- Utopia.
- Gale.
- Hellas.

Territórios listados: M-042 (disponível), M-018 (sob análise) e M-077 (sob análise).

### Missões

- MX-12 — Expedição Olympus, exploração, dificuldade 3/5, +500 XP.
- MX-09 — Sinais de Elysium, análise, dificuldade 2/5, +320 XP.
- MX-18 — Abismo de Valles, reconhecimento, dificuldade 5/5, +1.200 XP, bloqueada até o nível 15.
- Temporada: 8 de 12 missões, 66%.

### Estruturas da base

- Habitat: operacional.
- Laboratório: bloqueado até o nível 2.
- Antena: sinal orbital estável.
- Estufa: bloqueada até o nível 3.

### Comunidade

- Feed inicial: Rede Elysium, Mission Control, Luna e Elysium Explorers.
- Atividades posteriores: Sonda Vigil, Olympus Crew e Kai.
- Equipe destacada: Elysium Explorers, 23 membros e 14 missões.
- Mars Comms: Mission Control (18), Olympus Expedition (7) e Mars Science Lab (5). Não há áudio real nessas salas.

### Marketplace

Seis anúncios iniciais:

- M-118 Cratera Norte — território em Gale — R$149 — Luna.
- ST-04 Módulo de Antena — estrutura em Elysium — R$79 — Kai.
- RS-22 Cristais de Hematita — recurso em Valles Marineris — R$39 — Nova.
- M-207 Planalto Utopia — território em Utopia — R$189 — Orion.
- ST-11 Estufa Hidropônica — estrutura em Hellas — R$119 — Vega.
- RS-08 Núcleo de Gelo — recurso em Olympus Mons — R$59 — Sol.

Anúncios criados pelo usuário existem apenas até o próximo reload. Negociar apenas mostra um toast; não há cobrança ou transação.

### Mensagens

- Conversas com Luna, Kai, Nova e o canal Elysium Explorers.
- Mensagens enviadas entram apenas no estado React.
- As respostas automáticas são escolhidas aleatoriamente entre quatro frases fixas.
- Não existe websocket, serviço de mensagens ou persistência remota.

## 9. Identidade visual e responsividade

Direção: interface premium, escura, tecnológica e inspirada em HUD, exploração espacial e Marte.

- Fundo preto/cinza espacial.
- Primária vermelho-laranja marciano.
- Verde para sinais/status online e ciano como token auxiliar.
- Cards translúcidos, bordas finas, glows discretos, grid, scanlines e microanimações.
- Tipografia externa via Google Fonts: Space Grotesk (texto), Barlow Condensed (display) e IBM Plex Mono (dados técnicos).
- Tokens em OKLCH no `:root` de `src/styles.css`.
- Breakpoint principal do shell em `md`: sidebar no desktop e barra inferior no mobile.
- Ajustes mobile escondem rótulos de marcadores inativos, ampliam botões para 100% e reposicionam elementos da intro.
- `prefers-reduced-motion` reduz animações e transições.

Classes próprias que definem a linguagem visual incluem `.hud-panel`, `.action-button`, `.secondary-button`, `.map-marker`, `.territory-scan`, `.status-pill`, `.modal-backdrop`, `.mars-input`, `.passport-grid` e `.marsia-intro*`.

## 10. Assets e integrações existentes

### Assets locais

- `src/assets/mars-map.jpg`: imagem de mapa usada em Explorar e Detalhes do Território.
- `public/favicon.ico`: favicon.

### Serviços externos existentes

- Google Fonts, por links definidos em `src/routes/__root.tsx`.
- Um arquivo de áudio público da intro é carregado diretamente de uma URL do Supabase Storage em `src/components/marsia-intro.tsx`.
- Hooks globais opcionais do Lovable (`window.__lovableEvents` e `window.__lovableReportRuntimeError`) recebem erros do boundary somente quando fornecidos pelo ambiente/editor.
- Preset `@lovable.dev/vite-tanstack-config` integra a aplicação ao fluxo de build/preview do Lovable.

### Supabase

Não foram encontrados cliente Supabase, SDK `@supabase/*`, configuração de projeto, migrations, schema, SQL, autenticação ou consultas ao banco. A única referência ao domínio Supabase é a URL pública do arquivo de áudio da intro no Storage. Preserve essa referência como está e não crie conexão adicional.

## 11. Funcionalidades explicitamente simuladas ou ausentes

- Registro territorial não realiza pagamento nem grava dados remotos.
- Marketplace não cobra, transfere itens nem conversa com um serviço externo.
- Mensagens não são enviadas a pessoas reais.
- Feed não é compartilhado e não persiste após reload.
- Missões não têm motor de progresso ou recompensa real.
- Mars Comms não oferece áudio real.
- Identidade/passaporte não possui autenticação ou verificação real.
- Números de usuários online, XP, raridade, métricas, coordenadas e telemetria são estáticos/mockados.
- Não há API externa de mapas ou dados de Marte.

## 12. Cuidados para continuar no Lovable

1. Manter TanStack Router e criar novas páginas em `src/routes/`; não usar convenções de Next.js/Remix.
2. Manter `<Outlet />` em `src/routes/__root.tsx` e não editar `src/routeTree.gen.ts` manualmente.
3. Reutilizar `PageHeader`, `Panel`, `Stat`, `Progress`, `ActionLink` e os tokens de `styles.css` para preservar consistência.
4. Tratar todo novo comportamento como front-end simulado enquanto o escopo continuar sem backend.
5. Se novos mocks precisarem ser compartilhados entre páginas, preferir constantes tipadas ou ampliar com cuidado o `MarsiaProvider`; não introduzir serviços remotos.
6. Preservar os avisos visíveis de que territórios, valores, comunicações e negociações são conceituais/simulados.
7. Validar desktop e mobile, especialmente a barra inferior fixa, modais, mapa e formulários.
8. Preservar os fallbacks de erro SSR e a instrumentação do preview Lovable.

## 13. Estado atual de entrega

O MVP visual descrito no README está implementado, incluindo abertura inicial, navegação, mapa, aquisição simulada, criação/renomeação de base, missões, comunidade, marketplace, mensagens, passaporte, toasts, loadings e feedback sonoro discreto. O arquivo `roadmap.md` marca como concluídos os dois itens registrados: intro apenas na primeira entrada pela página inicial e sons discretos de navegação/clique.

Este handoff documenta o estado encontrado sem alterar layout, funcionalidades, integrações ou arquivos de configuração existentes.

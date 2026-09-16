# MARSIA — protótipo de exploração social de Marte

## O que será construído
- Uma experiência front-end navegável com identidade futurista, premium e espacial.
- Navegação principal para Início, Explorar Marte, Missões, Comunidade, Minha Base e Meu Passaporte.
- Um grande mapa interativo de Marte com regiões, marcadores e territórios simulados.
- Página de território com dados, raridade, pontos de interesse e aquisição simulada.
- Fluxo de confirmação, registro do território e escolha do nome da base.
- Painéis de base, passaporte, missões e comunidade usando dados mockados.
- Estados visuais de carregamento, notificações, bloqueios e progressão.
- Layout adaptado para desktop e celular, com navegação inferior no mobile.

## Direção visual
- Fundo preto profundo e superfícies grafite translúcidas.
- Vermelho/laranja marciano como sinalização principal, com pequenos acentos luminosos.
- Tipografia técnica e condensada nos títulos, apoiada por texto legível.
- HUD discreto, linhas cartográficas, marcadores pulsantes e microanimações controladas.
- Mapa marciano autoral como principal elemento visual; sem aparência de loja convencional.

## Jornada do protótipo
```text
Entrar → Explorar Marte → Encontrar M-042 → Ver território
→ Adquirir → Nomear Base Aurora → Ver Minha Base
→ Participar de missões → Conhecer exploradores
```

## Detalhes técnicos
- Rotas separadas e funcionais para cada área principal e para o território M-042.
- Estado compartilhado no navegador para refletir a aquisição e o nome da base durante a sessão.
- Modal de confirmação e notificações para ações importantes.
- Componentes reutilizáveis para navegação, indicadores, cards e barras de progresso.
- Metadados próprios para cada página e aviso legal discreto no rodapé.
- Sem backend, autenticação, pagamento, áudio ou integrações externas.

## Validação
- Conferir navegação e fluxo completo de aquisição no navegador.
- Verificar apresentação em desktop e celular.
- Confirmar ausência de erros e sobreposições visuais.

# Abertura de suspense da MARSIA

## O que será construído
- Uma tela de abertura em tela cheia exibida somente na primeira entrada pela página Início.
- Fundo escuro com a marca MARSIA, indicador de carregamento futurista e mensagens reveladas em sequência.
- Reprodução automática do áudio fornecido; quando bloqueada pelo navegador, será mostrado “TOQUE PARA INICIAR”.
- Botão “Pular experiência” disponível durante toda a abertura.
- Transição suave para a Home atual após “SINAL DETECTADO”, “COORDENADAS LOCALIZADAS” e “TERRITÓRIO IDENTIFICADO”.
- Efeitos sonoros curtos e discretos ao mudar de página e em cliques importantes, sem excesso.

## Comportamento
- A abertura não será exibida ao acessar diretamente Explorar, Missões, Comunidade ou qualquer outra página.
- Como o protótipo não possui login, a primeira visita será controlada no navegador e a experiência não se repetirá nas visitas seguintes.
- O áudio será interrompido e liberado ao concluir ou pular a experiência.
- Os efeitos sonoros só serão ativados após uma interação permitida pelo navegador e respeitarão volume baixo.
- Preferências de movimento reduzido serão respeitadas.

## Validação
- Conferir a primeira entrada na Home, a reprodução automática e a alternativa por toque.
- Confirmar que a abertura não aparece novamente nem em outras páginas.
- Testar sequência, botão de pular, sons discretos e acesso à aplicação em desktop e celular.
- Confirmar ausência de erros, telas em branco e sobreposições.

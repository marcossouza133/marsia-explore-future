# Abertura de suspense da MARSIA

## O que será construído
- Uma tela de abertura em tela cheia, exibida antes da aplicação em celulares e desktops.
- Fundo escuro com a marca MARSIA, indicador de carregamento futurista e mensagens reveladas em sequência.
- Reprodução automática do áudio fornecido; quando bloqueada pelo navegador, será mostrado “TOQUE PARA INICIAR”.
- Botão “Pular experiência” disponível durante toda a abertura.
- Transição suave para a tela atual após “SINAL DETECTADO”, “COORDENADAS LOCALIZADAS” e “TERRITÓRIO IDENTIFICADO”.

## Comportamento
- Como o protótipo não possui login, a abertura será exibida uma vez por sessão do navegador, simulando a experiência para visitantes não autenticados.
- A abertura funcionará ao entrar por qualquer página, sem modificar o conteúdo ou a lógica das telas existentes.
- O áudio será interrompido e liberado ao concluir ou pular a experiência.
- Preferências de movimento reduzido serão respeitadas.

## Validação
- Conferir reprodução automática e alternativa por toque.
- Testar sequência, botão de pular e acesso à aplicação em desktop e celular.
- Confirmar ausência de erros, telas em branco e sobreposições.

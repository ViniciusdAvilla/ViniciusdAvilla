# Login compartilhado — Ethos Tribo

**A interface está implementada. A ligação com a autenticação original depende do backend original.** Um site estático em `onrender.com` não pode ler cookies/sessões privados de `www.ethostribo.com.br` devido à política de mesma origem, proteção contra rastreamento e atributos do cookie.

## Integração necessária

1. O backend original deve criar (ou confirmar) um endpoint seguro para consultar a sessão autenticada do usuário. Respostas típicas: `200` com `{ "authenticated": true, "user": { "name": "...", "email": "...", "picture": "https://..." } }` para sessão autenticada; `401` para visitantes.
2. Requisitos se mantiver dois domínios: HTTPS; `Access-Control-Allow-Origin: https://ethos-tribo-claro-dark.onrender.com` (nunca `*`); `Access-Control-Allow-Credentials: true`; cookies configurados adequadamente se esse modo de autenticação for permitido no navegador. Mesmo com CORS, alguns navegadores bloqueiam cookies entre domínios diferentes. A configuração preferida é hospedar a versão visual num subdomínio do domínio original e utilizar a sessão compartilhada conforme o backend.
3. Preencha **somente** `sessionEndpoint` em `auth-config.js` com a URL real do backend; não coloque tokens, segredos ou client secrets em arquivos públicos. Opcionalmente, confirme URLs de login e de conta.
4. Teste sessão autenticada, anônima, expirada, CORS/cookies e permissões no navegador. O frontend só mostra `Conectado` após `200` autenticado, e mostra foto Google se o perfil autenticado contiver URL HTTPS de foto.

Se preferir login Google direto no novo site em vez de compartilhar a sessão original, será necessário um cliente OAuth autorizado para o novo domínio e um backend que verifique o ID token do Google e estabeleça uma sessão de confiança; a foto vem dos dados dessa sessão verificada. O frontend não utiliza login fictício ou informação armazenada localmente como prova de autenticação.

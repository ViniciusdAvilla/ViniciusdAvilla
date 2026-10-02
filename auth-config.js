/* Public config only: no keys or secrets here.
   To share login with www.ethostribo.com.br, supply a cross-origin/session-safe
   authenticated endpoint or host this theme site under the original site's domain.
   See README-AUTENTICACAO.md before enabling. */
window.ETHOS_AUTH = Object.freeze({
  sessionEndpoint: '', // e.g. 'https://www.ethostribo.com.br/api/profile-session' AFTER backend/CORS setup
  loginUrl: 'https://www.ethostribo.com.br/entrar',
  accountUrl: 'https://www.ethostribo.com.br/',
});

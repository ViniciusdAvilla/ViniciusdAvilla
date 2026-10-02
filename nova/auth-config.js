/* Never place a service-role key, OAuth secret, or token here. Set sessionEndpoint
   only after the original Ethos backend explicitly supports authenticated
   cross-origin session checks, or after integrating this UI into the same app. */
window.ETHOS_AUTH = Object.freeze({
  sessionEndpoint: '',
});

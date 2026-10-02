/* Chave pública do Google reCAPTCHA v2. A chave SECRETA fica somente no Render backend. */
window.ETHOS_CONFIG = {
  photo_url: "/assets/encontro-parque.webp",
  legal_name: "", // Nome jurídico do responsável: confirmar antes de coletar autorizações
  whatsapp_number: "5541991363791",
  recaptcha_site_key: "", // Google reCAPTCHA v2 checkbox para ethos-tribo-autorizacao.onrender.com
  verify_url: "https://ethos-captcha-verifier.onrender.com/verify", // Endereço do backend gratuito Render, terminado em /verify
  production_review_complete: false // Habilitar após revisão jurídica, confirmação da foto e chave do Google
};

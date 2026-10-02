(()=>{'use strict';
const cfg=window.ETHOS_CONFIG||{},form=document.getElementById('consent-form'),button=document.getElementById('submit'),msg=document.getElementById('message'),captcha=document.getElementById('recaptcha-box'),placeholder=document.getElementById('captcha-placeholder'),agree=document.getElementById('agree'),photo=document.getElementById('photo'),legal=document.getElementById('legal-name');
const number=String(cfg.whatsapp_number||'').replace(/\D/g,''),siteKey=String(cfg.recaptcha_site_key||'').trim(),verifyUrl=String(cfg.verify_url||'');
let widgetId=null,captchaResponse='',imageReady=false,busy=false;
if(cfg.legal_name)legal.textContent=cfg.legal_name;
if(cfg.photo_url){photo.src=cfg.photo_url;}else{photo.src='assets/encontro-parque.webp';}
photo.addEventListener('load',()=>{imageReady=!!photo.naturalWidth;update()});if(photo.complete && photo.naturalWidth){imageReady=true;}photo.addEventListener('error',()=>{imageReady=false;msg.textContent='Imagem indisponível. Solicite a fotografia oficial ao responsável.';update()});
const ready=()=>Boolean(cfg.production_review_complete===true && cfg.legal_name && siteKey && /^https:\/\/[^ ]+\/verify$/.test(verifyUrl) && number.length>=12 && number.length<=15);
function update(){button.disabled=!ready()||!imageReady||!agree.checked||!captchaResponse||busy}
function show(text){msg.textContent=text}
agree.addEventListener('change',update);
window.ethosCaptchaReady=()=>{
 if(!ready())return;
 placeholder.remove();
 widgetId=grecaptcha.render('recaptcha-box',{sitekey:siteKey,theme:'light',callback:(v)=>{captchaResponse=v;update()},'expired-callback':()=>{captchaResponse='';update()},'error-callback':()=>{captchaResponse='';show('Não foi possível confirmar o reCAPTCHA. Tente novamente.');update()}});
};
if(ready()){
 const script=document.createElement('script');script.src='https://www.google.com/recaptcha/api.js?onload=ethosCaptchaReady&render=explicit';script.async=true;script.defer=true;document.head.appendChild(script);
}else{
 placeholder.querySelector('small').textContent='Aguardando chaves do Google e revisão do responsável';
 show('A página está publicada, mas a autorização ficará disponível após configurar o reCAPTCHA do Google e confirmar os dados legais.');
}
form.addEventListener('submit',async(ev)=>{
 ev.preventDefault();
 if(!ready()||!imageReady||!agree.checked||!captchaResponse||busy)return;
 busy=true;update();show('Verificando o reCAPTCHA…');
 try{
  const res=await fetch(verifyUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:captchaResponse})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok||!data.verified)throw new Error('Não foi possível verificar se você é humano. Tente novamente.');
  const protocol=crypto.randomUUID?crypto.randomUUID():String(Date.now());
  const original=new URL(cfg.photo_url,location.href).href;
  const declaration=['AUTORIZAÇÃO DE USO DE IMAGEM — ETHOS TRIBO','Protocolo de referência: '+protocol,'Data UTC: '+new Date().toISOString(),'Responsável: '+cfg.legal_name,'Fotografia: '+original,'Termo: versão 2.0','Uso: exclusivamente no banner principal de https://www.ethostribo.com.br/ por até 12 meses, sem outras campanhas, salvo revogação.','', 'Confirmo que sou maior de idade, apareço na fotografia apresentada e li o termo. Autorizo livre e expressamente o uso delimitado acima. Sei que posso revogar gratuitamente pelos canais oficiais.','', 'Envio esta declaração voluntariamente pelo meu WhatsApp.'];
  const url='https://wa.me/'+number+'?text='+encodeURIComponent(declaration.join('\n'));
  show('Verificação concluída. O WhatsApp será aberto: envie a mensagem para registrar sua autorização. Abrir o WhatsApp não significa que ela já foi enviada.');
  window.location.assign(url);
 }catch(err){show(err.message||'Erro de validação. Tente novamente.')}
 finally{busy=false;captchaResponse='';if(widgetId!==null && window.grecaptcha)grecaptcha.reset(widgetId);update();}
});
})();
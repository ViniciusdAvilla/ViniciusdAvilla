/* Shared account indicator. Only trusted session endpoints can display 'logged in'. */
(() => {
  'use strict';
  const settings = window.ETHOS_AUTH || {};
  const loginUrl = settings.loginUrl || 'https://www.ethostribo.com.br/entrar';
  const accountUrl = settings.accountUrl || 'https://www.ethostribo.com.br/';
  const header = document.querySelector('.header-actions');
  const login = header?.querySelector('.login');
  const join = header?.querySelector('.header-join');
  const mobileLogin = document.querySelector('#mobile-menu a[href*="/entrar"]');
  if (!header || !login) return;
  const account = document.createElement('a');
  account.href = accountUrl;
  account.className = 'auth-account';
  account.hidden = true;
  account.setAttribute('aria-label', 'Minha conta Ethos Tribo');
  account.innerHTML = `<img class="auth-photo" width="34" height="34" alt="" referrerpolicy="no-referrer" loading="lazy" hidden>
    <span class="auth-initials" aria-hidden="true" hidden></span>
    <span class="auth-details"><span class="auth-name"></span><span class="auth-state"></span></span>`;
  header.insertBefore(account, login);
  const photo = account.querySelector('.auth-photo');
  const initials = account.querySelector('.auth-initials');
  const nameLabel = account.querySelector('.auth-name');
  const statusLabel = account.querySelector('.auth-state');
  const strings = () => document.documentElement.lang.startsWith('en') ? {
    connected:'Signed in', account:'Open my Ethos Tribo account', mobile:'My account'
  } : {connected:'Conectado',account:'Abrir minha conta Ethos Tribo',mobile:'Minha conta'};
  let current = null;
  let lastCheck = 0;
  const isSafePhoto = source => {
    try { return new URL(source).protocol === 'https:'; } catch (_) { return false; }
  };
  function showGuest(){
    current = null;
    account.hidden = true;
    login.hidden = false;
    if(join) join.hidden = false;
    if(mobileLogin){mobileLogin.href=loginUrl;mobileLogin.dataset.authGuest='true';mobileLogin.textContent=document.documentElement.lang.startsWith('en')?'Join the Tribe':'Entrar na Tribo';}
  }
  function refreshLabels(){
    const s=strings();
    statusLabel.textContent=s.connected;
    if(current) {
      const displayName=current.name || current.email || '';
      account.setAttribute('aria-label', `${s.account}: ${displayName}`);
      if(mobileLogin)mobileLogin.textContent=s.mobile;
    }
  }
  function showUser(user){
    const name = typeof user.name==='string' && user.name.trim() ? user.name.trim()
      : (typeof user.email==='string' && user.email.trim() ? user.email.trim() : 'Ethos Tribo');
    const picture = user.picture || user.image || user.avatarUrl || user.photoURL;
    current = {name,email:user.email || ''};
    nameLabel.textContent = name.split(' ')[0];
    if(typeof picture==='string' && isSafePhoto(picture)){
      photo.src=picture;photo.hidden=false;initials.hidden=true;
      photo.onerror=()=>{photo.hidden=true;initials.hidden=false;initials.textContent=name[0].toUpperCase()};
    }else{
      photo.removeAttribute('src');photo.hidden=true;initials.hidden=false;initials.textContent=name[0].toUpperCase();
    }
    login.hidden = true;
    if(join)join.hidden = true;
    account.hidden = false;
    if(mobileLogin){mobileLogin.href=accountUrl;delete mobileLogin.dataset.authGuest;}
    refreshLabels();
  }
  async function checkSession(){
    // Without a configured real backend, don't infer login from Google cookies/localStorage.
    if(!settings.sessionEndpoint) return showGuest();
    lastCheck=Date.now();
    try {
      const response=await fetch(settings.sessionEndpoint,{
        method:'GET',mode:'cors',credentials:'include',cache:'no-store',headers:{Accept:'application/json'}
      });
      if(!response.ok) return showGuest();
      const data=await response.json();
      const user=data?.user || data?.profile || (data?.authenticated===true ? data : null);
      if(!user || data?.authenticated===false || !(user.name || user.email))return showGuest();
      showUser(user);
    }catch(_){showGuest();}
  }
  document.addEventListener('ethos:language-changed',()=>{
    if(current)refreshLabels();
    else if(mobileLogin)mobileLogin.textContent=document.documentElement.lang.startsWith('en')?'Join the Tribe':'Entrar na Tribo';
  });
  window.addEventListener('pageshow',()=>{if(Date.now()-lastCheck>5000)checkSession()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden && Date.now()-lastCheck>5000)checkSession()});
  showGuest();
  checkSession();
})();

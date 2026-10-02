/* The entire layout is scoped to .et. No global selectors or external libraries. */
(() => {
  'use strict';
  const root = document.querySelector('[data-et-root]');
  if (!root) return;
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  function setTheme(theme) {
    root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    const active = root.dataset.theme;
    const label = active === 'dark' ? 'White' : 'Dark';
    const btn = $('[data-et-theme]');
    if (btn) {
      const txt = btn.querySelector('.et-theme-word');
      const symbol = btn.querySelector('.et-theme-symbol');
      if (txt) txt.textContent = label;
      if (symbol) symbol.textContent = active === 'dark' ? '☼' : '☾';
      btn.setAttribute('aria-pressed', String(active === 'dark'));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',active === 'dark'?'#101e19':'#f4f5ef');
    save('ethos-design-theme',active);
  }
  setTheme(read('ethos-design-theme') || 'light');
  $('[data-et-theme]')?.addEventListener('click',() => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  const menu = $('[data-et-menu]');
  const mobile = $('#et-mobile-nav');
  if (menu && mobile) {
    menu.addEventListener('click', () => {
      const open=mobile.hidden;
      mobile.hidden=!open;
      menu.setAttribute('aria-expanded',String(open));
      menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
    });
    mobile.addEventListener('click',e=>{if(e.target.closest('a')){mobile.hidden=true;menu.setAttribute('aria-expanded','false')}});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'){mobile.hidden=true;menu.setAttribute('aria-expanded','false')}});
  }
  $$('img[data-et-fallback]').forEach(img => img.addEventListener('error',() => {
    const fallback=img.dataset.etFallback;
    if (fallback && !img.dataset.etFallbackUsed) {img.dataset.etFallbackUsed='true';img.src=fallback;}
  }));
  // Locale and theme preference persist across the separate pt/en routes.
  $$('.et-flags a').forEach(a=>a.addEventListener('click',()=>save('ethos-design-lang',a.href.includes('/en/')?'en':'pt')));
  const filters=$$('[data-et-filter]');
  const search=$('[data-et-search]');
  const items=$$('[data-et-item]');
  function filterCards() {
    const active=$('[data-et-filter].is-current')?.dataset.etFilter || 'all';
    const term=(search?.value||'').trim().toLocaleLowerCase();
    let shown=0;
    items.forEach(x=>{const match=(active==='all'||x.dataset.etItem===active)&&(!term||x.dataset.etName.includes(term));x.hidden=!match;if(match)shown++});
    const empty=$('[data-et-empty]');
    if(empty){empty.hidden=shown>0;empty.textContent=root.dataset.etLang==='en'?'No events match this filter. Open the live events list for more.':'Nenhum encontro neste filtro. Consulte a agenda atualizada para outras opções.'}
  }
  filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.toggle('is-current',x===b));filterCards()}));
  search?.addEventListener('input',filterCards);
  // Restrained scroll effects, disabled for reduced-motion preference.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('et-enter-hidden');observer.unobserve(e.target)}}),{threshold:.08});
    $$('[data-et-reveal]').forEach(x=>{x.classList.add('et-enter-hidden');observer.observe(x)});
    let scheduled=false;
    window.addEventListener('scroll',()=>{
      if(scheduled)return; scheduled=true;
      requestAnimationFrame(()=>{const hero=$('.et-hero-photo');if(hero){const scrolled=Math.max(0,window.scrollY);hero.style.setProperty('--et-scroll-hero',Math.min(scrolled*.05,26)+'px')}scheduled=false});
    },{passive:true});
  }
  // Account displays only if YOUR verified backend responds with authenticated=true.
  const auth=window.ETHOS_AUTH || {};
  const guest=$('[data-et-login]'), profile=$('[data-et-profile]');
  if(auth.sessionEndpoint && guest && profile){
    fetch(auth.sessionEndpoint,{credentials:'include',headers:{Accept:'application/json'},cache:'no-store'}).then(r=>r.ok?r.json():null).then(data=>{
      const u=data?.authenticated===true?data.user:null;
      if(!u||!u.name||typeof u.name!=='string')return;
      guest.hidden=true;profile.hidden=false;
      $('[data-et-name]').textContent=u.name.split(' ')[0];
      const img=$('[data-et-photo]');
      if(typeof u.picture==='string' && u.picture.startsWith('https://'))img.src=u.picture;
    }).catch(()=>{});
  }
})();

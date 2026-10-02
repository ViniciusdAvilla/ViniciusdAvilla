'use strict';
(()=>{
 const root=document.getElementById('ethos-mirror'); if(!root)return;
 const menu=root.querySelector('#mobile-nav'),toggle=root.querySelector('#menu-toggle');
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')});
 root.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{menu.hidden=true;toggle?.setAttribute('aria-expanded','false')}));
 const stylesheet=document.querySelector('link[href$="styles.css"]'); const safeOrigin=location.protocol==='http:'||location.protocol==='https:'?location.href:'https://ethos.invalid/'; const assets=new URL('assets/',stylesheet?.href||safeOrigin);
 root.querySelectorAll('img[data-fallback]').forEach(img=>{img.addEventListener('error',()=>{if(img.dataset.fallback){const next=new URL(img.dataset.fallback,assets).href;delete img.dataset.fallback;img.src=next;}})});
 const filters=[...root.querySelectorAll('button[data-filter]')],events=[...root.querySelectorAll('.event[data-territory]')],empty=root.querySelector('.no-results'); let chosen=new URLSearchParams(location.search).get('territorio')||'all';
 function filter(){if(!filters.length)return;const params=new URLSearchParams(location.search);const selected=filters.some(x=>x.dataset.filter===chosen)?chosen:'all';filters.forEach(b=>{const active=b.dataset.filter===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});const query=(params.get('q')||'').trim().toLocaleLowerCase('pt-BR');const shown=events.filter(e=>{const ok=(selected==='all'||e.dataset.territory===selected)&&(!query||e.dataset.name.toLocaleLowerCase('pt-BR').includes(query));e.hidden=!ok;return ok});if(empty)empty.hidden=shown.length>0}
 filters.forEach(b=>b.addEventListener('click',()=>{chosen=b.dataset.filter;if(location.protocol==='http:'||location.protocol==='https:'){const u=new URL(location.href);if(chosen==='all')u.searchParams.delete('territorio');else u.searchParams.set('territorio',chosen);history.replaceState(null,'',u)}filter()}));filter();
})();

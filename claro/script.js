(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // The mobile menu remains a regular, keyboard-accessible navigation.
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  const closeMenu = () => {
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu();
      toggle.focus();
    }
  });
  menu.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  // Progressive enhancement: everything is visible when scripting is unavailable.
  let observer;
  if ('IntersectionObserver' in window && !motion.matches) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.07 });
    $$('.reveal').forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
  }
  motion.addEventListener('change', event => {
    if (event.matches) {
      observer?.disconnect();
      $$('.is-pending').forEach(element => element.classList.remove('is-pending'));
      $$('[data-tilt]').forEach(element => { element.style.removeProperty('--rx'); element.style.removeProperty('--ry'); });
    }
  });

  // Small perspective changes only on devices with an accurate pointer.
  $$('[data-tilt]').forEach(card => {
    let frame = 0;
    card.addEventListener('pointermove', event => {
      if (motion.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - .5) * 8}deg`);
        card.style.setProperty('--rx', `${((event.clientY - rect.top) / rect.height - .5) * -7}deg`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });

  // The agenda is an explicitly dated snapshot. Booking happens on the original platform.
  const form = $('#event-search');
  if (form) {
    const search = $('#search');
    const city = $('#city');
    const filters = $$('[data-filter]');
    const cards = $$('.event-card');
    const parameters = new URLSearchParams(location.search);
    let selected = filters.some(button => button.dataset.filter === parameters.get('territorio')) ? parameters.get('territorio') : 'all';
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    search.value = parameters.get('q') || '';
    if ([...city.options].some(option => option.value === parameters.get('city'))) city.value = parameters.get('city');
    const filter = (syncUrl = true) => {
      const terms = normalize(search.value).split(/\s+/).filter(Boolean);
      let count = 0;
      cards.forEach(card => {
        const visible = (selected === 'all' || card.dataset.category === selected) &&
          (city.value === 'all' || card.dataset.city === city.value) &&
          terms.every(term => normalize(card.dataset.search).includes(term));
        card.hidden = !visible;
        if (visible) count++;
      });
      filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
      $('#event-empty').hidden = count > 0;
      $('#result-count').textContent = `${count} ${count === 1 ? 'encontro' : 'encontros'}`;
      if (syncUrl && (location.protocol === 'http:' || location.protocol === 'https:')) {
        const url = new URL(location.href);
        for (const [key, value] of [['territorio', selected === 'all' ? '' : selected], ['q', search.value.trim()], ['city', city.value === 'all' ? '' : city.value]]) {
          if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
        }
        history.replaceState(null, '', url);
      }
    };
    filters.forEach(button => button.addEventListener('click', () => { selected = button.dataset.filter; filter(); }));
    form.addEventListener('submit', event => { event.preventDefault(); filter(); });
    search.addEventListener('input', () => filter());
    city.addEventListener('change', () => filter());
    $('#reset-filters').addEventListener('click', () => { selected = 'all'; search.value = ''; city.value = 'all'; filter(); search.focus(); });
    filter(false);
  }

  const dialog = $('#event-dialog');
  if (dialog) {
    const opener = $('[data-open-dialog]');
    opener.addEventListener('click', () => dialog.showModal());
    $('[data-close-dialog]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => opener.focus());
  }
})();

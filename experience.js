/* Progressive, accessible scroll depth. Lightweight: one observer + one rAF. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(pointer: coarse)');
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const portal = document.querySelector('.reality-portal');
  const hero = document.querySelector('.hero');
  const hoverCards = [...document.querySelectorAll('.territory-card')];
  const depthStages = [...document.querySelectorAll('[data-scroll-stage],.groups-hero,.page-heading,.about-intro,.join-section')];
  const revealElements = [...document.querySelectorAll('.territory-card,.step,.group-type,.journey-grid article,.pillars-grid article')];
  let frame = 0;
  let observer;

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const write = () => {
    frame = 0;
    if (reducedMotion.matches) return;
    const viewport = window.innerHeight || 800;
    const scrolling = document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - viewport;
    if (header) header.style.setProperty('--site-progress', `${Math.round(maxScroll ? scrolling / maxScroll * 100 : 0)}%`);
    if (hero) {
      const rect = hero.getBoundingClientRect();
      const stage = clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
      hero.style.setProperty('--hero-scroll', stage.toFixed(3));
      const largePhoto = hero.querySelector('.photo-main');
      const smallPhoto = hero.querySelector('.photo-small');
      if (largePhoto) {
        largePhoto.dataset.depthInline = '';
        largePhoto.style.transform = `rotate(${7 - stage * 13}deg) translate3d(${stage * 10}px,${-stage * 48}px,${stage * 30}px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;
      }
      if (smallPhoto) {
        smallPhoto.dataset.depthInline = '';
        smallPhoto.style.transform = `rotate(${-11 + stage * 12}deg) translate3d(0,${-stage * 80}px,70px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;
      }
    }
    if (portal) {
      const rect = portal.getBoundingClientRect();
      if (rect.bottom > -60 && rect.top < viewport + 60) {
        const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
        portal.style.setProperty('--portal-progress', progress.toFixed(3));
        portal.style.setProperty('--portal-shift', (progress * 95).toFixed(1));
        const art = portal.querySelector('.portal-art');
        if (art) {
          art.style.setProperty('--portal-progress', progress.toFixed(3));
          // Explicit compositor transforms retain the full 3D sequence in browsers
          // without CSS typed arithmetic multiplication support.
          const transforms = {
            '.portal-ring-back': `rotateX(68deg) rotateZ(${42 + progress * 48}deg) scale(.95)`,
            '.portal-ring-main': `rotateX(${20 - progress * 25}deg) rotateY(${-23 + progress * 36}deg) rotateZ(${-12 + progress * 45}deg) scale(${.88 + progress * .14})`,
            '.portal-ring-front': `rotateX(${70 - progress * 25}deg) rotateZ(${-18 - progress * 70}deg) scale(1.17)`,
            '.portal-core': `rotateY(${-17 + progress * 33}deg) rotateX(${8 - progress * 15}deg) translateZ(${25 + progress * 90}px) scale(${.91 + progress * .08})`,
            '.portal-stamp': `rotate(${12 - progress * 25}deg) translateY(${-progress * 40}px) translateZ(80px)`,
            '.portal-float-a': `translate3d(${progress * 48}px,${progress * 65}px,60px) rotate(-9deg)`,
            '.portal-float-b': `translate3d(${-progress * 50}px,${-progress * 70}px,90px) rotate(8deg)`
          };
          for (const [selector, transform] of Object.entries(transforms)) {
            const node = art.querySelector(selector);
            if (node) { node.dataset.depthInline = ''; node.style.transform = transform; }
          }
        }
      }
    }
    for (const item of depthStages) {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -30 || rect.top > viewport + 30) continue;
      const value = clamp((viewport * .5 - (rect.top + rect.height * .5)) * .12, -85, 85);
      item.style.setProperty('--depth-shift', value.toFixed(1));
      const mainImage = item.querySelector('.manifesto-image');
      if (mainImage) {
        mainImage.dataset.depthInline = '';
        mainImage.style.transform = `scale(${1.1 + value * .0007}) translateY(${-value * .16}px)`;
      }
      const editorialPhoto = item.querySelector('.about-photo');
      if (editorialPhoto) {
        editorialPhoto.dataset.depthInline = '';
        editorialPhoto.style.transform = `translateY(${-value}px) rotateY(${-value * .11}deg)`;
      }
      const innerPhoto = item.querySelector('.groups-photo');
      if (innerPhoto) {
        innerPhoto.dataset.depthInline = '';
        innerPhoto.style.transform = `rotate(${4 - value * .045}deg) translateY(${-value * .5}px) perspective(1200px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;
      }
    }
  };
  const requestWrite = () => { if (!frame) frame = requestAnimationFrame(write); };

  function enableMotion() {
    if (reducedMotion.matches) return;
    root.classList.add('js-experience');
    observer?.disconnect();
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      }, { threshold: .09, rootMargin: '0px 0px -5% 0px' });
      for (const node of revealElements) {
        node.classList.add('depth-appear');
        // Above-the-fold items must never be invisible on first paint.
        if (node.getBoundingClientRect().top < innerHeight * .9) node.classList.add('in-view');
        else observer.observe(node);
      }
    }
    requestWrite();
  }
  enableMotion();
  window.addEventListener('scroll', requestWrite, { passive: true });
  window.addEventListener('resize', requestWrite, { passive: true });
  reducedMotion.addEventListener('change', e => {
    if (e.matches) {
      observer?.disconnect();
      root.classList.remove('js-experience');
      for (const node of revealElements) node.classList.remove('depth-appear');
      for (const item of depthStages) item.style.removeProperty('--depth-shift');
      if (header) header.style.removeProperty('--site-progress');
      for (const node of document.querySelectorAll('[data-depth-inline]')) {
        node.style.removeProperty('transform');
        delete node.dataset.depthInline;
      }
    } else enableMotion();
  });
  // 3D cards respond to the pointer only on capable devices.
  if (!coarsePointer.matches && !reducedMotion.matches) {
    hoverCards.forEach(card => {
      let motionFrame = 0;
      card.addEventListener('pointermove', event => {
        if (motionFrame) return;
        motionFrame = requestAnimationFrame(() => {
          motionFrame = 0;
          const box = card.getBoundingClientRect();
          card.style.setProperty('--card-ry', `${clamp((event.clientX - box.left) / box.width - .5, -.5, .5) * 7}deg`);
        });
      }, { passive: true });
      card.addEventListener('pointerleave', () => card.style.removeProperty('--card-ry'));
    });
  }
})();

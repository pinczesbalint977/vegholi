'use strict';

(() => {
  /* ========================= */
  /* BETÖLTÉS / KEZDŐ ANIMÁCIÓ */
  /* ========================= */
  const root = document.documentElement;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const startedAt = performance.now();
  const blockedRegions = [];
  const revealTargets = [];
  let loader = null;
  let ready = false;
  let leaving = false;
  let domReady = false;
  let revealsStarted = false;
  let revealObserver = null;
  let minimumTimer = 0;
  let fadeTimer = 0;
  let introTimer = 0;

  root.classList.add('is-loading');
  if (!motionPreference.matches) root.classList.add('motion-enabled');
  const safetyTimer = window.setTimeout(finishLoading, 5000);

  function finishLoading() {
    if (ready) return;
    ready = true;
    window.clearTimeout(safetyTimer);
    window.clearTimeout(minimumTimer);
    window.clearTimeout(fadeTimer);
    (loader || document.querySelector('#site-loader'))?.remove();
    root.classList.remove('is-loading', 'loader-leaving');
    blockedRegions.forEach(region => region.removeAttribute('inert'));
    if (!motionPreference.matches) {
      root.classList.add('intro-running');
      introTimer = window.setTimeout(() => root.classList.remove('intro-running'), 1600);
    }
    // Az első belépő animáció csak a takaróréteg eltávolítása után indulhat.
    root.classList.add('is-ready');
    if (domReady) startReveals();
  }

  function leaveLoader() {
    if (ready || leaving) return;
    leaving = true;
    if (motionPreference.matches || !loader) {
      finishLoading();
      return;
    }
    root.classList.add('loader-leaving');
    loader.addEventListener('transitionend', event => {
      if (event.target === loader && event.propertyName === 'opacity') finishLoading();
    });
    // A CSS 320 ms-os áttűnésének tartalék lezárása.
    fadeTimer = window.setTimeout(finishLoading, 370);
  }

  function waitForImage(image) {
    if (typeof image.decode === 'function') return image.decode().catch(() => {});
    if (image.complete) return Promise.resolve();
    return new Promise(resolve => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  }

  function onDomReady() {
    domReady = true;
    if (ready) {
      startReveals();
      return;
    }
    loader = document.querySelector('#site-loader');
    document.querySelectorAll('header, main, footer, .skip-link, .cookie-banner').forEach(region => {
      if (!region.hasAttribute('inert')) {
        region.setAttribute('inert', '');
        blockedRegions.push(region);
      }
    });
    if (motionPreference.matches) {
      finishLoading();
      return;
    }
    const criticalImages = [...document.querySelectorAll('#site-loader img, .site-header .brand img, #kezdolap img:not([loading="lazy"])')];
    const minimumTime = new Promise(resolve => {
      minimumTimer = window.setTimeout(resolve, Math.max(0, 800 - (performance.now() - startedAt)));
    });
    Promise.allSettled([minimumTime, ...criticalImages.map(waitForImage)]).then(leaveLoader).catch(finishLoading);
  }

  /* ========================= */
  /* GÖRGETÉSKOR MEGJELENŐ ELEMEK */
  /* ========================= */
  function clearReveals() {
    revealObserver?.disconnect();
    revealTargets.forEach(element => {
      element.classList.remove('reveal-item', 'is-visible');
      element.style.removeProperty('--reveal-delay');
    });
  }

  function startReveals() {
    if (revealsStarted || motionPreference.matches || !('IntersectionObserver' in window)) return;
    revealsStarted = true;
    try {
      const selectors = '.section-heading, .service-card, .about-visual, .about-copy, .gallery-help, .gallery-item, .gallery-pagination, .contact-copy, .form-panel, .footer-main, .footer-bottom';
      revealTargets.push(...[...document.querySelectorAll(selectors)].filter(element =>
        !element.closest('#kezdolap') && getComputedStyle(element).display !== 'contents'
      ));
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.hidden && entry.target.getClientRects().length) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
      revealTargets.forEach(element => {
        const siblingIndex = [...element.parentElement.children].indexOf(element);
        element.style.setProperty('--reveal-delay', `${Math.min(siblingIndex % 4, 3) * 65}ms`);
        element.classList.add('reveal-item');
        revealObserver.observe(element);
      });
    } catch {
      clearReveals();
    }
  }

  motionPreference.addEventListener('change', event => {
    if (!event.matches) return;
    root.classList.remove('motion-enabled');
    root.classList.remove('intro-running');
    window.clearTimeout(introTimer);
    clearReveals();
    finishLoading();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
  else onDomReady();
})();

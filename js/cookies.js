'use strict';

(() => {
  /* ========================= */
  /* VERZIÓZOTT SÜTIVÁLASZTÁS */
  /* ========================= */
  const config = window.VOSTONE_CONFIG || {};
  const settings = config.cookies || {};
  const storageKey = settings.storageKey || 'vostone-cookie-consent';
  const version = Number.isInteger(settings.version) && settings.version > 0 ? settings.version : 1;
  const configuredDays = Number(settings.maxAgeDays);
  const maxAgeMs = (Number.isFinite(configuredDays) && configuredDays > 0 ? configuredDays : 180) * 86400000;
  const measurementId = /^G-[A-Z0-9]+$/.test(config.analytics?.measurementId || '') ? config.analytics.measurementId : '';
  let consent = null;
  let memoryConsent = null;
  let memoryOnly = false;
  let analyticsStarted = false;
  let analyticsScript = null;
  let reloadScheduled = false;
  let expiryTimer = 0;
  let banner = null;
  let dialog = null;
  let analyticsToggle = null;
  let footerButton = null;
  let status = null;
  let statusMessage = '';
  let dialogVisible = false;
  let fallbackDialog = false;
  let previousFocus = null;
  const fallbackInert = [];

  function validateConsent(value) {
    const now = Date.now();
    return value && value.version === version && value.necessary === true &&
      typeof value.analytics === 'boolean' && value.measurementId === measurementId &&
      (!value.analytics || Boolean(measurementId)) &&
      Number.isFinite(value.updatedAt) && value.updatedAt > 0 && value.updatedAt <= now &&
      Number.isFinite(value.expiresAt) && value.expiresAt > now &&
      value.expiresAt > value.updatedAt && value.expiresAt - value.updatedAt <= maxAgeMs + 1
      ? value : null;
  }

  function parseConsent(raw) {
    try { return validateConsent(JSON.parse(raw)); } catch { return null; }
  }

  function readConsent() {
    if (memoryOnly) return validateConsent(memoryConsent);
    try {
      const raw = localStorage.getItem(storageKey);
      return parseConsent(raw);
    } catch { return validateConsent(memoryConsent); }
  }

  function announce(message) {
    statusMessage = message;
    if (status) status.textContent = message;
  }

  function choose(allowAnalytics) {
    const restoreBannerFocus = !dialogVisible && banner?.contains(document.activeElement);
    const now = Date.now();
    const choice = {
      version, necessary: true, analytics: Boolean(measurementId && allowAnalytics),
      measurementId, updatedAt: now, expiresAt: now + maxAgeMs
    };
    memoryConsent = choice;
    try {
      localStorage.setItem(storageKey, JSON.stringify(choice));
      memoryOnly = false;
      announce('A sütibeállításokat elmentettük.');
    } catch {
      memoryOnly = true;
      try { localStorage.removeItem(storageKey); } catch { /* A tiltott tárolást csak memóriában helyettesítjük. */ }
      announce('A böngésző nem engedi a döntés tartós megjegyzését. A választás ezen az oldalon érvényes.');
    }
    applyConsent(choice);
    closeSettings();
    if (restoreBannerFocus && footerButton?.getClientRects().length) footerButton.focus({ preventScroll: true });
  }

  function applyConsent(value) {
    consent = validateConsent(value);
    window.clearTimeout(expiryTimer);
    if (consent?.analytics) startAnalytics();
    else stopAnalytics();
    if (banner) banner.hidden = Boolean(consent);
    if (analyticsToggle) analyticsToggle.checked = Boolean(consent?.analytics);
    if (consent) {
      expiryTimer = window.setTimeout(refreshConsent, Math.min(2147483647, Math.max(1, consent.expiresAt - Date.now() + 1)));
    }
  }

  function refreshConsent() {
    applyConsent(readConsent());
  }

  /* ========================= */
  /* GOOGLE ANALYTICS: CSAK ELFOGADÁS UTÁN */
  /* ========================= */
  function startAnalytics() {
    if (!measurementId || analyticsStarted || reloadScheduled) return;
    analyticsStarted = true;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    // Basic Consent Mode: a parancsok is csak az elfogadás után kerülnek a sorba.
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false, allow_ad_personalization_signals: false
    });
    analyticsScript = document.createElement('script');
    analyticsScript.id = 'vostone-analytics';
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(analyticsScript);
  }

  function clearAnalyticsCookies() {
    try {
      const names = new Set(document.cookie.split(';').map(cookie => cookie.split('=')[0].trim())
        .filter(name => /^(?:_ga(?:_|$)|_gid$|_gat(?:_|$)|__utm[a-z]$|AMP_TOKEN$)/.test(name)));
      if (!names.size && !analyticsStarted) return;
      names.add('_ga');
      if (measurementId) names.add(`_ga_${measurementId.slice(2)}`);
      const domains = new Set([location.hostname, `.${location.hostname}`]);
      if (!/^[\d.]+$/.test(location.hostname)) {
        const parts = location.hostname.split('.');
        while (parts.length > 2) {
          parts.shift();
          domains.add(parts.join('.'));
          domains.add(`.${parts.join('.')}`);
        }
      }
      const paths = new Set(['/']);
      let path = '';
      location.pathname.split('/').filter(Boolean).forEach(part => {
        path += `/${part}`;
        paths.add(path);
        paths.add(`${path}/`);
      });
      names.forEach(name => paths.forEach(cookiePath => {
        const expiredCookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${cookiePath}; SameSite=Lax`;
        document.cookie = expiredCookie;
        domains.forEach(domain => { document.cookie = `${expiredCookie}; domain=${domain}`; });
      }));
    } catch { /* A böngésző blokkolhatja a sütihozzáférést is. */ }
  }

  function stopAnalytics() {
    if (measurementId) window[`ga-disable-${measurementId}`] = true;
    clearAnalyticsCookies();
    if (!analyticsStarted || reloadScheduled) return;
    reloadScheduled = true;
    analyticsScript?.remove();
    if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
    window.dataLayer = [];
    window.gtag = undefined;
    // Nem küldünk elutasítási pinget; az újratöltés az aktív mérőkódot is megszünteti.
    window.setTimeout(() => location.reload(), 0);
  }

  /* ========================= */
  /* SÜTISÁV / RÉSZLETES BEÁLLÍTÁSOK */
  /* ========================= */
  function closeSettings() {
    if (!dialogVisible) return;
    if (!fallbackDialog && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    finishClosing();
  }

  function finishClosing() {
    if (!dialogVisible) return;
    dialogVisible = false;
    dialog.hidden = true;
    document.body.classList.remove('cookie-dialog-open');
    fallbackInert.splice(0).forEach(element => element.removeAttribute('inert'));
    fallbackDialog = false;
    const target = previousFocus?.isConnected && previousFocus.getClientRects().length ? previousFocus : footerButton;
    target?.focus({ preventScroll: true });
  }

  function openSettings() {
    if (!dialog || dialogVisible) return;
    refreshConsent();
    previousFocus = document.activeElement;
    analyticsToggle.checked = Boolean(consent?.analytics);
    dialog.hidden = false;
    dialogVisible = true;
    try {
      if (typeof dialog.showModal !== 'function') throw new Error('dialog-fallback');
      dialog.showModal();
    } catch {
      fallbackDialog = true;
      dialog.setAttribute('open', '');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      [...document.body.children].forEach(element => {
        if (element !== dialog && !element.hasAttribute('inert')) {
          element.setAttribute('inert', '');
          fallbackInert.push(element);
        }
      });
    }
    document.body.classList.add('cookie-dialog-open');
    document.querySelector('#cookie-dialog-close').focus({ preventScroll: true });
  }

  function createUi() {
    if (banner) return;
    document.querySelector('#cookie-banner')?.remove();
    const analyticsDescription = measurementId
      ? 'A Google Analytics csak az Ön hozzájárulása után segít weboldalunk használatának megértésében.'
      : 'A látogatottságmérés jelenleg nincs bekapcsolva; statisztikai tárolást nem használunk.';
    banner = document.createElement('aside');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.innerHTML = `
      <div class="cookie-banner-copy"><p class="cookie-eyebrow">AZ ÖN ADATAI, AZ ÖN DÖNTÉSE</p>
        <h2 id="cookie-banner-title">Sütik és adatvédelem</h2>
        <p>A szükséges tárolás az Ön sütiválasztásának megjegyzését biztosítja. ${analyticsDescription} Döntését később a láblécben módosíthatja. <a href="adatkezeles.html">Adatkezelési tájékoztató</a></p>
      </div>
      <div class="cookie-actions"><button class="button button-dark" id="cookie-necessary" type="button">Csak szükséges</button><button class="button button-dark" id="cookie-accept" type="button">Mindet elfogadom</button><button class="button button-outline" id="cookie-options" type="button" aria-haspopup="dialog" aria-controls="cookie-dialog">Beállítások</button></div>`;
    banner.hidden = Boolean(consent);
    dialog = document.createElement('dialog');
    dialog.id = 'cookie-dialog';
    dialog.className = 'cookie-dialog';
    dialog.hidden = true;
    dialog.setAttribute('aria-labelledby', 'cookie-dialog-title');
    dialog.setAttribute('aria-describedby', 'cookie-dialog-description');
    dialog.innerHTML = `
      <div class="cookie-dialog-header"><div><p class="cookie-eyebrow">ADATVÉDELMI BEÁLLÍTÁSOK</p><h2 id="cookie-dialog-title">Ön dönt a sütikről.</h2></div><button class="cookie-close" id="cookie-dialog-close" type="button" aria-label="Beállítások bezárása">×</button></div>
      <div class="cookie-dialog-body"><p id="cookie-dialog-description">Az oldal a statisztikai sütik elutasítása esetén is teljesen használható. A bezárás önmagában nem jelent hozzájárulást.</p>
        <div class="cookie-category"><div><h3>Szükséges tárolás</h3><p>A sütiválasztást ezen a böngészőn jegyezzük meg, más célra nem használjuk. Mindig aktív.</p></div><input type="checkbox" checked disabled aria-label="Szükséges tárolás: mindig aktív"></div>
        <div class="cookie-category"><div><h3><label for="cookie-analytics">Statisztikai sütik</label></h3><p id="cookie-analytics-description">${analyticsDescription} Reklámcélú mérést nem kapcsolunk be.</p></div><input id="cookie-analytics" type="checkbox" aria-describedby="cookie-analytics-description"${measurementId ? '' : ' disabled'}></div>
        <p>A döntés a sütibeállításoknál bármikor módosítható vagy visszavonható. További részletek az <a href="adatkezeles.html">adatkezelési tájékoztatóban</a>.</p>
      </div>
      <div class="cookie-dialog-actions"><button class="button button-outline" id="cookie-save" type="button">Beállítások mentése</button><button class="button button-dark" id="cookie-dialog-reject" type="button">Csak szükséges</button><button class="button button-dark" id="cookie-dialog-accept" type="button">Mindet elfogadom</button></div>`;
    status = document.createElement('p');
    status.id = 'cookie-status';
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    status.textContent = statusMessage;
    document.body.append(banner, dialog, status);
    analyticsToggle = document.querySelector('#cookie-analytics');
    analyticsToggle.checked = Boolean(consent?.analytics);
    document.querySelector('#cookie-necessary').addEventListener('click', () => choose(false));
    document.querySelector('#cookie-accept').addEventListener('click', () => choose(true));
    document.querySelector('#cookie-options').addEventListener('click', openSettings);
    document.querySelector('#cookie-dialog-close').addEventListener('click', closeSettings);
    document.querySelector('#cookie-save').addEventListener('click', () => choose(analyticsToggle.checked));
    document.querySelector('#cookie-dialog-reject').addEventListener('click', () => choose(false));
    document.querySelector('#cookie-dialog-accept').addEventListener('click', () => choose(true));
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeSettings(); });
    dialog.addEventListener('close', finishClosing);
    dialog.addEventListener('click', event => { if (event.target === dialog) closeSettings(); });
    footerButton = document.querySelector('#cookie-settings');
    if (footerButton) {
      footerButton.hidden = false;
      footerButton.setAttribute('aria-haspopup', 'dialog');
      footerButton.setAttribute('aria-controls', 'cookie-dialog');
      footerButton.addEventListener('click', openSettings);
    }
  }

  /* ========================= */
  /* ÉLETCIKLUS / TÖBB BÖNGÉSZŐLAP */
  /* ========================= */
  function initialize() {
    refreshConsent();
    if (!document.documentElement.classList.contains('is-loading')) createUi();
    else {
      const loaderObserver = new MutationObserver(() => {
        if (document.documentElement.classList.contains('is-ready') || !document.documentElement.classList.contains('is-loading')) {
          loaderObserver.disconnect();
          createUi();
        }
      });
      loaderObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
  }

  window.addEventListener('focus', refreshConsent);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshConsent(); });
  window.addEventListener('storage', event => {
    if (event.key !== null && event.key !== storageKey) return;
    try { if (event.storageArea && event.storageArea !== localStorage) return; } catch { return; }
    memoryConsent = null;
    memoryOnly = false;
    applyConsent(event.key === null ? null : parseConsent(event.newValue));
  });
  document.addEventListener('keydown', event => {
    if (!dialogVisible) return;
    if (event.key === 'Escape') { event.preventDefault(); closeSettings(); }
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')].filter(element => element.getClientRects().length);
      const current = controls.indexOf(document.activeElement);
      event.preventDefault();
      controls[(current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
    }
  });
  document.addEventListener('focusin', event => {
    if (fallbackDialog && dialogVisible && !dialog.contains(event.target)) document.querySelector('#cookie-dialog-close').focus();
  });
  document.addEventListener('click', event => {
    if (fallbackDialog && dialogVisible && !dialog.contains(event.target)) { event.preventDefault(); event.stopPropagation(); }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();

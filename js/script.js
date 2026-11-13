'use strict';

(() => {
  const config = window.VOSTONE_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ========================= */
  /* MOBIL NAVIGÁCIÓ */
  /* ========================= */
  const menuButton = document.querySelector('#nav-toggle');
  const navigation = document.querySelector('#primary-nav');
  const navigationLinks = navigation ? [...navigation.querySelectorAll('a[href*="#"]')] : [];

  function setMenuOpen(open, restoreFocus = false) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
    navigation.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && navigation) {
    const header = menuButton.closest('.site-header');
    const headerInner = header?.querySelector('.header-inner');
    const brand = headerInner?.querySelector('.brand');
    const narrowMenu = window.matchMedia('(max-width: 959px)');
    let compactMenu = narrowMenu.matches;
    let menuResizeFrame = 0;

    function updateMenuLayout(closeOnResize = false) {
      if (!header || !headerInner || !brand) return;
      const focusedElement = document.activeElement;
      const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
      // Normál menüstílusokkal mérünk; a végleges osztály még a kirajzolás előtt visszakerül.
      header.classList.remove('compact-nav');
      let shouldCompact = narrowMenu.matches;
      if (!shouldCompact) {
        const innerStyle = getComputedStyle(headerInner);
        const availableWidth = headerInner.clientWidth - (parseFloat(innerStyle.paddingLeft) || 0) - (parseFloat(innerStyle.paddingRight) || 0);
        const requiredWidth = brand.getBoundingClientRect().width + navigation.scrollWidth + (parseFloat(innerStyle.columnGap) || 0);
        shouldCompact = requiredWidth > availableWidth;
      }
      const layoutChanged = compactMenu !== shouldCompact;
      compactMenu = shouldCompact;
      header.classList.toggle('compact-nav', compactMenu);
      if (layoutChanged || (closeOnResize && wasOpen)) setMenuOpen(false);
      if (compactMenu && navigation.contains(focusedElement) && menuButton.getAttribute('aria-expanded') !== 'true') {
        menuButton.focus();
      } else if (!compactMenu && focusedElement === menuButton) {
        navigationLinks[0]?.focus();
      }
    }

    menuButton.addEventListener('click', () => {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    navigationLinks.forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (menuButton.getAttribute('aria-expanded') !== 'true') return;
      if (event.key === 'Escape') setMenuOpen(false, true);
      if (event.key === 'Tab') {
        const focusable = [menuButton, ...navigation.querySelectorAll('a, button')];
        const currentIndex = focusable.indexOf(document.activeElement);
        const nextIndex = (currentIndex + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
        event.preventDefault();
        focusable[nextIndex].focus();
      }
    });
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(menuResizeFrame);
      menuResizeFrame = window.requestAnimationFrame(() => updateMenuLayout(true));
    });
    narrowMenu.addEventListener('change', () => updateMenuLayout(true));
    document.fonts?.ready.then(() => updateMenuLayout());
    updateMenuLayout();
  }

  /* ========================= */
  /* AKTÍV SZEKCIÓ / GÖRGETÉS */
  /* ========================= */
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (sections.length && 'IntersectionObserver' in window) {
    const visibleSections = new Set();
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visibleSections.add(entry.target);
        else visibleSections.delete(entry.target);
      });
      const activeSection = [...visibleSections].sort((a, b) =>
        Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top)
      )[0];
      if (!activeSection) return;
      navigationLinks.forEach(link => {
        const active = link.hash === `#${activeSection.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }
  // A CSS kezeli a finom görgetést és a csökkentett animációs beállítást.
  if (reducedMotion.matches) document.documentElement.classList.add('reduced-motion');

  /* ========================= */
  /* SZOLGÁLTATÁSOK LAPOZÁSA */
  /* ========================= */
  const servicesList = document.querySelector('#services-list');
  const servicePrevious = document.querySelector('#service-prev');
  const serviceNext = document.querySelector('#service-next');
  if (servicesList && servicePrevious && serviceNext) {
    function updateServiceButtons() {
      servicePrevious.disabled = servicesList.scrollLeft <= 1;
      serviceNext.disabled = servicesList.scrollLeft >= servicesList.scrollWidth - servicesList.clientWidth - 1;
    }
    function scrollServices(direction) {
      const cardWidth = servicesList.firstElementChild?.getBoundingClientRect().width || 0;
      const gap = parseFloat(getComputedStyle(servicesList).columnGap) || 0;
      servicesList.scrollBy({ left: direction * (cardWidth + gap), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }
    servicePrevious.addEventListener('click', () => scrollServices(-1));
    serviceNext.addEventListener('click', () => scrollServices(1));
    servicesList.addEventListener('scroll', updateServiceButtons, { passive: true });
    window.addEventListener('resize', updateServiceButtons);
    updateServiceButtons();
  }

  /* ========================= */
  /* RÓLUNK / TOVÁBBI RÉSZLETEK */
  /* ========================= */
  const aboutSection = document.querySelector('#rolunk');
  const aboutMore = document.querySelector('#about-more');
  const aboutDetails = document.querySelector('#about-details');
  if (aboutSection && aboutMore && aboutDetails) {
    aboutSection.classList.add('about-collapsible');
    aboutMore.addEventListener('click', () => {
      aboutSection.classList.add('about-expanded');
      aboutMore.setAttribute('aria-expanded', 'true');
      aboutDetails.focus({ preventScroll: true });
    }, { once: true });
  }

  /* ========================= */
  /* GALÉRIA / LIGHTBOX */
  /* ========================= */
  const galleryItems = [...document.querySelectorAll('.gallery-item[data-image]')];
  const galleryDialog = document.querySelector('#gallery-dialog');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const lightboxCount = document.querySelector('#lightbox-count');
  const galleryPagination = document.querySelector('#gallery-pagination');
  const galleryPagePrevious = document.querySelector('#gallery-page-prev');
  const galleryPageNext = document.querySelector('#gallery-page-next');
  const galleryPageCount = document.querySelector('#gallery-page-count');
  const galleryHelp = document.querySelector('#gallery-help');
  const mobileGallery = window.matchMedia('(max-width: 699px)');
  let galleryPageSize = mobileGallery.matches ? 4 : 6;
  let galleryPageTotal = Math.max(1, Math.ceil(galleryItems.length / galleryPageSize));
  let galleryPage = 0;
  let galleryIndex = 0;
  let galleryTrigger = null;

  function showGalleryPage(page) {
    galleryPage = Math.max(0, Math.min(page, galleryPageTotal - 1));
    galleryItems.forEach((item, index) => {
      item.hidden = Math.floor(index / galleryPageSize) !== galleryPage;
    });
    if (galleryPageCount) galleryPageCount.textContent = `${galleryPage + 1} / ${galleryPageTotal} · ${galleryItems.length} kép`;
    if (galleryHelp) {
      const first = galleryPage * galleryPageSize + 1;
      const last = Math.min(first + galleryPageSize - 1, galleryItems.length);
      galleryHelp.textContent = galleryItems.length > galleryPageSize
        ? `Összesen ${galleryItems.length} kép tekinthető meg! Jelenleg: ${first}–${last}. kép. Lapozzon a további képekért, vagy kattintson a nagyításhoz.`
        : `${galleryItems.length} kép tekinthető meg. Kattintson egy képre: nagyított nézetben is végiglapozhatja a galériát.`;
    }
    if (galleryPagePrevious) galleryPagePrevious.disabled = galleryPage === 0;
    if (galleryPageNext) galleryPageNext.disabled = galleryPage === galleryPageTotal - 1;
    if (galleryPagination) galleryPagination.hidden = galleryItems.length <= galleryPageSize;
  }

  galleryPagePrevious?.addEventListener('click', () => showGalleryPage(galleryPage - 1));
  galleryPageNext?.addEventListener('click', () => showGalleryPage(galleryPage + 1));
  mobileGallery.addEventListener('change', event => {
    const focusedIndex = galleryItems.findIndex(item => item.contains(document.activeElement));
    const anchorIndex = galleryDialog?.open ? galleryIndex : focusedIndex >= 0 ? focusedIndex : galleryPage * galleryPageSize;
    galleryPageSize = event.matches ? 4 : 6;
    galleryPageTotal = Math.max(1, Math.ceil(galleryItems.length / galleryPageSize));
    showGalleryPage(Math.floor(anchorIndex / galleryPageSize));
    if (!galleryDialog?.open && focusedIndex >= 0) galleryItems[focusedIndex].focus({ preventScroll: true });
  });
  showGalleryPage(0);

  function showGalleryImage(index) {
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    const thumbnail = item.querySelector('img');
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = thumbnail?.alt || item.dataset.title || 'Burkolási kép';
    if (lightboxCaption) lightboxCaption.textContent = item.dataset.title || lightboxImage.alt;
    if (lightboxCount) lightboxCount.textContent = `${galleryIndex + 1} / ${galleryItems.length}`;
  }

  function closeGallery() {
    if (!galleryDialog) return;
    if (typeof galleryDialog.close === 'function') galleryDialog.close();
    else {
      galleryDialog.removeAttribute('open');
      restoreGalleryFocus();
    }
  }

  function restoreGalleryFocus() {
    document.body.classList.remove('lightbox-open');
    showGalleryPage(Math.floor(galleryIndex / galleryPageSize));
    (galleryItems[galleryIndex] || galleryTrigger)?.focus();
  }

  if (galleryDialog && lightboxImage && galleryItems.length) {
    galleryItems.forEach((item, index) => item.addEventListener('click', () => {
      galleryTrigger = item;
      showGalleryImage(index);
      if (typeof galleryDialog.showModal === 'function') galleryDialog.showModal();
      else galleryDialog.setAttribute('open', '');
      document.body.classList.add('lightbox-open');
      document.querySelector('#lightbox-close')?.focus();
    }));
    document.querySelector('#lightbox-close')?.addEventListener('click', closeGallery);
    document.querySelector('#lightbox-prev')?.addEventListener('click', () => showGalleryImage(galleryIndex - 1));
    document.querySelector('#lightbox-next')?.addEventListener('click', () => showGalleryImage(galleryIndex + 1));
    galleryDialog.addEventListener('close', restoreGalleryFocus);
    galleryDialog.addEventListener('click', event => {
      if (event.target === galleryDialog) closeGallery();
    });
    galleryDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showGalleryImage(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeGallery();
      }
    });
  }

  /* ========================= */
  /* KAPCSOLATI ŰRLAP */
  /* ========================= */
  const form = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  const submitButton = document.querySelector('#form-submit');
  const formModeNote = document.querySelector('#form-mode-note');
  const formFallback = document.querySelector('#form-fallback');
  const formConfig = config.form || {};
  const isLiveForm = formConfig.mode === 'live';
  const isFormSubmit = formConfig.provider === 'formsubmit';
  let formStartedAt = Date.now();
  let sending = false;

  function setFormStatus(message, state) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.dataset.state = state;
    formStatus.hidden = false;
  }

  function getField(name) {
    return form?.elements.namedItem(name);
  }

  function validateField(field) {
    if (!field || !field.name) return true;
    const value = field.value.trim();
    let message = '';
    if (field.name === 'name' && value.length < 2) message = 'Adja meg a nevét (legalább 2 karakter).';
    if (field.name === 'email' && (!value || field.validity.typeMismatch)) message = 'Adjon meg egy érvényes emailcímet.';
    if (field.name === 'phone' && value && (!/^[+\d\s()./-]+$/.test(value) || value.replace(/\D/g, '').length < 7 || value.replace(/\D/g, '').length > 15)) {
      message = 'Adjon meg egy érvényes telefonszámot, vagy hagyja üresen ezt a mezőt.';
    }
    if (field.name === 'service' && !value) message = 'Válassza ki, milyen munkában segíthetünk.';
    if (field.name === 'message' && value.length < 10) message = 'Írjon néhány szót az elképzeléséről (legalább 10 karakter).';
    if (field.name === 'privacy' && !field.checked) message = 'Kérjük, jelölje be, hogy megismerte az adatkezelési tájékoztatót.';
    if (!message && (field.validity.tooLong || (field.maxLength >= 0 && field.value.length > field.maxLength))) {
      message = `Legfeljebb ${field.maxLength} karakter adható meg.`;
    }
    if (!message && (field.validity.tooShort || (field.minLength > 0 && value.length < field.minLength))) {
      message = `Legalább ${field.minLength} karaktert adjon meg.`;
    }
    if (!message && !field.validity.valid) message = 'Kérjük, ellenőrizze ennek a mezőnek a kitöltését.';
    const error = document.getElementById(`${field.name}-error`);
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !message;
  }

  function resolveFormEndpoint() {
    if (!formConfig.endpoint) throw new Error('missing-endpoint');
    const endpoint = new URL(formConfig.endpoint, document.baseURI);
    if (!['http:', 'https:'].includes(endpoint.protocol)) throw new Error('unsafe-endpoint');
    if (endpoint.origin !== location.origin && endpoint.protocol !== 'https:') throw new Error('unsafe-endpoint');
    if (location.protocol === 'https:' && endpoint.protocol !== 'https:') throw new Error('unsafe-endpoint');
    return endpoint;
  }

  if (form && submitButton) {
    form.noValidate = true;
    const fields = ['name', 'email', 'phone', 'service', 'message', 'privacy'].map(getField).filter(Boolean);
    fields.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener(field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });
    if (formModeNote) formModeNote.textContent = isLiveForm
      ? 'Megkeresésére a megadott elérhetőségeken válaszolunk.'
      : 'Online üzenetküldés jelenleg nem érhető el. Ajánlatkéréshez kérjük, telefonáljon.';
    const initialButtonLabel = submitButton.querySelector('.button-label') || submitButton;
    initialButtonLabel.textContent = isLiveForm ? 'Ajánlatkérés küldése' : 'Ajánlatkérés ellenőrzése';

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      const invalidFields = fields.filter(field => !validateField(field));
      if (invalidFields.length) {
        setFormStatus('Kérjük, ellenőrizze a megjelölt mezőket.', 'error');
        invalidFields[0].focus();
        return;
      }
      if (getField('website')?.value.trim() || Date.now() - formStartedAt < 2500) {
        setFormStatus('A küldés nem indult el. Kérjük, várjon néhány másodpercet, majd próbálja újra.', 'error');
        return;
      }
      sending = true;
      if (formFallback) formFallback.hidden = true;
      submitButton.disabled = true;
      form.setAttribute('aria-busy', 'true');
      const label = submitButton.querySelector('.button-label') || submitButton;
      const originalLabel = label.textContent;
      label.textContent = isLiveForm ? 'Küldés folyamatban…' : 'Ellenőrzés…';
      setFormStatus(isLiveForm ? 'Az üzenet küldése folyamatban…' : 'Az adatok ellenőrzése folyamatban…', 'pending');
      let timeout;
      try {
        if (!isLiveForm) {
          // Az ellenőrzés helyben történik. Nincs hálózati kérés vagy adattárolás.
          await new Promise(resolve => window.setTimeout(resolve, 450));
          setFormStatus('A mezők kitöltése megfelelő. Az online küldés jelenleg nem aktív, az üzenet nem került elküldésre. Egyeztetéshez hívja a +36 30 392 0372 számot.', 'demo');
          return;
        }
        if (!['http:', 'https:'].includes(location.protocol)) throw new Error('local-file');
        if (navigator.onLine === false) throw new Error('offline');
        const endpoint = resolveFormEndpoint();
        const successPage = new URL(formConfig.successPage || 'koszonjuk.html', document.baseURI);
        if (successPage.origin !== location.origin) throw new Error('unsafe-success-page');
        const controller = new AbortController();
        const timeoutMs = Number(formConfig.timeoutMs) || 12000;
        timeout = window.setTimeout(() => controller.abort(), Math.max(3000, timeoutMs));
        const payload = isFormSubmit ? {
          name: getField('name').value.trim(),
          email: getField('email').value.trim(),
          phone: getField('phone').value.trim(),
          service: getField('service').selectedOptions[0].textContent,
          message: getField('message').value.trim(),
          privacy: 'Az adatkezelési tájékoztatót megismertem.',
          _replyto: getField('email').value.trim(),
          _subject: 'VOSTONE – Új ajánlatkérés',
          _template: 'table',
          _captcha: 'false'
        } : Object.fromEntries(new FormData(form));
        const response = await fetch(endpoint.href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'omit',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        const result = await response.json().catch(() => null);
        const accepted = isFormSubmit
          ? result?.success === true || result?.success === 'true'
          : result?.ok === true;
        if (!response.ok || !accepted) throw new Error('send-failed');
        setFormStatus('Üzenetét a küldőszolgáltatás fogadta. Átirányítás…', 'success');
        form.reset();
        formStartedAt = Date.now();
        location.assign(successPage.href);
      } catch (error) {
        const configurationError = ['missing-endpoint', 'unsafe-endpoint', 'unsafe-success-page'].includes(error.message);
        setFormStatus(configurationError
          ? 'Az online küldés még nincs megfelelően beállítva. Kérjük, hívja a +36 30 392 0372 számot.'
          : error.message === 'local-file'
            ? 'Az űrlap fájlként megnyitva nem küldhető el. Kérjük, használja a weboldal internetes címét, vagy keressen közvetlenül.'
          : error.message === 'offline'
            ? 'Nincs internetkapcsolat. Az üzenetet nem küldtük el; adatai megmaradtak. Csatlakozás után próbálja újra.'
          : error.name === 'AbortError'
            ? 'A küldőszolgáltatás nem válaszolt időben. Az üzenet fogadása nem igazolt; adatai megmaradtak. Kérjük, egyeztessen telefonon vagy e-mailben.'
            : 'Az üzenet fogadását nem sikerült visszaigazolni. Adatai megmaradtak. Próbálja újra, vagy keressen telefonon vagy e-mailben.', 'error');
        if (formFallback) formFallback.hidden = false;
      } finally {
        window.clearTimeout(timeout);
        sending = false;
        submitButton.disabled = false;
        form.removeAttribute('aria-busy');
        label.textContent = originalLabel;
        formStatus?.focus({ preventScroll: true });
      }
    });
    // Csak az alapértelmezett böngészős adatküldés letiltása után engedélyezzük.
    submitButton.disabled = false;
  }

  /* ========================= */
  /* KONFIGURÁLHATÓ SEO-ADATOK */
  /* ========================= */
  try {
    if (config.siteUrl) {
      const base = new URL(config.siteUrl);
      if (base.protocol !== 'https:') throw new Error('HTTPS-domain szükséges.');
      if (!base.pathname.endsWith('/')) base.pathname += '/';
      const filename = location.pathname.split('/').pop() || 'index.html';
      const canonical = new URL(filename === 'index.html' ? './' : filename, base).href;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.append(canonicalLink);
      }
      canonicalLink.href = canonical;
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonical);
      ['meta[property="og:image"]', 'meta[name="twitter:image"]'].forEach(selector => {
        const meta = document.querySelector(selector);
        if (meta) meta.content = new URL(meta.dataset.image || meta.content || 'assets/images/gallery%20(41).webp', base).href;
      });
    }
    if (config.searchConsoleVerification) {
      const verification = document.createElement('meta');
      verification.name = 'google-site-verification';
      verification.content = config.searchConsoleVerification;
      document.head.append(verification);
    }
  } catch {
    // Hibás vagy még üres domain esetén nem írunk ki kitalált canonical URL-t.
  }

})();

/* ========================= */
/* ÉLESÍTÉSI BEÁLLÍTÁSOK */
/* ========================= */
// Nyilvános beállítások: jelszó vagy titkos API-kulcs ide soha ne kerüljön.
window.VOSTONE_CONFIG = {
  // Végleges HTTPS-cím, záró perjellel; például: https://sajat-domain.hu/
  siteUrl: '',
  form: {
    mode: 'live',
    provider: 'formsubmit',
    endpoint: 'https://formsubmit.co/ajax/vostone2000@gmail.com',
    successPage: 'koszonjuk.html',
    timeoutMs: 15000
  },
  analytics: {
    // Bekapcsolás előtt az adatkezeles.html oldalt is frissítse a mérés részleteivel.
    measurementId: '', // Opcionális GA4-azonosító: G-XXXXXXXXXX.
    storageKey: 'vostone-analytics-consent'
  },
  searchConsoleVerification: '' // Opcionális Google Search Console ellenőrzőkód.
};

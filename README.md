# VOSTONE

Magyar nyelvű, natív HTML/CSS/JavaScript bemutatkozó oldal. Nincs build, keretrendszer vagy telepítendő futtatási függőség. A kapcsolatfelvételi űrlap FormSubmit AJAX-küldésre van beállítva, címzettje **info@vostone.hu**; az első használathoz a címzett aktiválása szükséges. A bézs megjelenés a kapott referenciaképet követi.

## Gyors segítség a szerkesztéshez

- **Megnyitás:** kattintson az `index.html` fájlra.
- **Szövegek és telefonszám:** az `index.html` fájlban írhatók át.
- **Színek és betűméretek:** a `css/style.css` fájlban, szekciókra bontva találhatók.
- **Nyitókép:** cserélje az `assets/images/hero.webp` fájlt.
- **Rólunk képe:** jelenleg az `assets/images/gallery (1).webp`. Saját portréhoz töltsön fel külön fájlt, majd módosítsa a `.about-visual` képének `src` és `alt` értékét az `index.html` fájlban.
- **Galériaképek:** az `assets/images/gallery (1).webp`–`gallery (50).webp` fájlok cserélhetők.
- **Űrlap és domain:** a `js/config.js` fájlban állítható be; a részletek lent olvashatók.
- **Feltöltés:** a `vostone` mappa tartalmát kell a tárhelyre másolni.

## Így alakítsa a saját oldalává

1. **Készítsen másolatot** a teljes `vostone` mappáról. A fájlokat kódszerkesztőben nyissa meg, és UTF-8 kódolással mentse. Mentés után frissítse a böngészőt (`Ctrl+F5`).
2. **Írja át a szövegeket** az `index.html` megfelelő, kommenttel jelölt szekciójában. Az `id`, `class`, `name` és `data-` attribútumokat tartsa meg: ezek kapcsolják össze a menüt, megjelenést és működést. Például a `hero-title` elem szövege a nyitócím.
3. **Cserélje a kapcsolati adatokat** minden előfordulásnál. A telefonszám látható szövege mellett a `tel:+36303920372` hivatkozást is módosítsa. A céges email csak ellenőrzött, működő postafiókra mutasson; a `mailto:` értéket is cserélje.
4. **Tegye fel saját képeit** a meglévő WebP-fájlneveken. A JPG/PNG fájlt előbb valóban alakítsa WebP formátumra; az átnevezés kevés. Frissítse az `alt` képleírásokat, eltérő képaránynál a `width`/`height` értékeket. A kivágást a CSS `object-position` szabálya állítja.
5. **Szabja át az arculatot** a `css/style.css` elején lévő `:root` változókkal. A címméret a `h1`/`h2`, a gomb a `.button` szabálynál található. Például:

   ```css
   --beige-light: #f0e7dc;
   ```

   A színeket itt elég egyszer módosítani: `--beige-light` = fejléc, kártyák és felületek; `--beige-medium` = nyitórész és képi területek; `--beige-dark` = kiemelések; `--background` = szekcióhátterek; `--line` = szegélyek; `--text-primary` és `--text-muted` = szövegek. A siker- és hibajelzések külön színei maradjanak felismerhetők.

   A fejléc és lábléc logója: `assets/icons/new logo1.svg` (a HTML-ben: `new%20logo1.svg`). A böngészőfül külön, kis méretre egyszerűsített ikonja: `assets/icons/favicon.svg`. A logó felirata rajzolt görbékből áll, ezért SVG-szerkesztővel módosítható, vagy az egész fájl lecserélhető.
6. **Tartsa röviden a tartalmat.** A fő szekciók alapból egy képernyőnyi területet kapnak (`100vh`, mobilon `100svh`). A Rólunk rész kis képernyőn a „Tudj meg többet” gombbal bővíthető: utána nyitva marad és természetes magasságúra nő. A Kapcsolat rész minden adatot és az egész űrlapot megjeleníti, szükség esetén magasabbra nő; egyiknél sincs külön belső görgetőablak.
7. **Élesítsen a lenti útmutató szerint:** saját domain a HTML-ekben, `js/config.js`, sitemap és robots fájlban; jogi adatok véglegesítése; FormSubmit aktiválása és fogadási próba a `info@vostone.hu` címen. Az űrlap már `live` módban van. Az indexelést csak a tartalom véglegesítése után engedélyezze. Titkos kulcs ne kerüljön JavaScriptbe.

## Animációk

A `js/animations.js` kezeli a betöltőt és a görgetéskor megjelenő elemeket; szinkron hivatkozása az `index.html` fejlécében található. A `#site-loader` a `newlogo1.svg` logót használja. A logó pulzálása, a belépések, a lépcsőzetes megjelenések és a görgetési effektek a CSS **BETÖLTŐ ÉS FINOM ANIMÁCIÓK** blokkjában módosíthatók. A navigáció és a nyitórész csak a betöltő eltávolítása után indul. A csökkentett mozgás beállítását figyelembe veszi. Kikapcsoláshoz törölje az `animations.js` szkripthivatkozását; az oldal animáció nélkül is látható marad.

## Megnyitás és feltöltés

Telefonon a nyitórész legalább egy képernyő magas, és szükség esetén tovább nő. A kép minimum 220 px magas; a mobilos arányok a CSS „MOBIL NYITÓOLDAL” blokkjában állíthatók.

- Helyi megtekintés: `index.html`, vagy a `vostone` mappából `python -m http.server 8080`, majd `http://localhost:8080`.
- A mappa tartalmát töltse a Rackhost domain dokumentumgyökerébe; a `vostone` szülőmappát ne hozza létre a tárhelyen.
- HTTPS legyen aktív, HTTP és alternatív domain irányítson a választott végleges HTTPS-domainre.
- A tárhely kezelőfelületén állítsa be a `/404.html` egyedi hibaoldalt valódi **404** HTTP-státusszal. Apache esetén a szerver konfigurációjába illeszkedő `ErrorDocument 404 /404.html` használható. A 404 oldal gyökérhez viszonyított útvonalai domain-gyökér telepítést feltételeznek; almappás telepítésnél módosítandók.

## Publikálás GitHub Pages segítségével

1. A `pinczesbalint977/vegholi` tároló `main` ágában az `index.html` és az oldal többi fájlja közvetlenül a tároló gyökerében legyen.
2. A **Settings → Pages → Source** beállítása **GitHub Actions**. A `.github/workflows/pages.yml` a `main` ág minden feltöltése után automatikusan publikál. Beállítási forrás: [GitHub Pages dokumentáció](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Kézi indítás: **Actions → Publish VOSTONE to GitHub Pages → Run workflow**. Várja meg a zöld `deploy` eredményt, majd ellenőrizze a `https://pinczesbalint977.github.io/vegholi/` oldalt. A sikeres Git-feltöltés önmagában még nem igazolja az éles oldal frissülését.
4. Az első űrlappróbánál a `info@vostone.hu` címzett hagyja jóvá a FormSubmit aktiváló emailjét, majd ellenőrizze az újabb üzenet beérkezését.

A projektoldal `/vegholi/` almappában fut: a `404.html` gyökérhez viszonyított kép-, stílus- és oldalhivatkozásainak itt `/vegholi/` előtag kell (például `/vegholi/css/style.css`). Saját domainre, domain-gyökérbe költözéskor az előtagot módosítsa. Az éles URL beállítását a konfigurációban és a SEO-fájlokban is végezze el a lenti útmutató szerint.

## Galériaképek kezelése

A galéria jelenlegi 50 képe: `assets/images/gallery (1).webp`–`assets/images/gallery (50).webp`. A HTML `src` és `data-image` útvonalaiban a szóköz `%20`, például `assets/images/gallery%20(1).webp`. A rendelkezésre álló forrásadatok a képforrásjegyzékben találhatók.

A galéria nagyobb képernyőn **6, telefonon 4 képet mutat oldalanként**. A szekció 100vh magas marad, a nagyított nézetben az összes képen végig lehet lépkedni. A lapozógombok szükség esetén automatikusan jelennek meg. A főmenü 960 px alatt, illetve helyhiány esetén hamburger menüre vált.

1. Másolja az új fotókat az `assets/images` mappába.
2. Az `index.html` `id="gallery-grid"` blokkjában másoljon le egy teljes `<button class="gallery-item" ...>...</button>` képelemet, és illessze a többi után, ugyanabba a blokkba.
3. Írja át a `data-image` és a belső kép `src` útvonalát az új fájlra. Frissítse a `data-title`, `aria-label`, `alt`, `width`, `height` értékeket és a képfeliratot is.
4. Az oldalak száma automatikusan frissül; külön JavaScript-módosítás nem kell.

## Tartalom és képek

Az öt szolgáltatáskártya képe: **Hidegburkolás** → `assets/images/gallery/large-format.webp`; **Épített polcok** → `assets/images/gallery/bathroom.webp`; **Melegburkolás** → `assets/images/gallery/floor.webp`; **Felület-előkészítés** → `assets/images/surface-preparation.webp`; **Nyílászáró-beépítés** → `assets/images/windows.webp`. Saját fotónál a fájlt és az `alt` képleírást cserélje.

- A kezdőlap és az űrlap feliratai: `index.html`; színek, töréspontok: `css/style.css`; működés: `js/script.js`.
- A logó és favicon saját, módosítható SVG az `assets/icons` mappában.
- A képek helyi fájlok. A hero és a galéria az azonos nevű fájl cseréjével frissíthető; a Rólunk szekció képét külön HTML-hivatkozás állítja. Eltérő képaránynál a HTML `width`/`height` és szükség szerint a CSS `object-position` is frissítendő.
- Képforrások és engedélyek: [assets/IMAGE-SOURCES.md](assets/IMAGE-SOURCES.md). Saját referenciaként csak igazolt saját munkafotókat nevezzen meg.

## Élesítés előtti adatok és SEO

1. Az adatkezelési tájékoztatóban a FormSubmiton keresztüli űrlapküldés, a címzett `info@vostone.hu`, valamint a tényleges szolgáltatók és megőrzési szabályok szerepeljenek. Analitika alapból nincs bekapcsolva. Tárhelyre költözéskor ellenőrizze a szolgáltató és a naplózás adatait, valamint a postafiók működését.
2. A `js/config.js` `siteUrl` értéke a végleges HTTPS-domain legyen záró `/` jellel. **A HTML fájlokban, `robots.txt`-ben és `sitemap.xml`-ben is cserélje az összes `https://DOMAIN-BEALLITANDO.invalid` helyőrzőt.** A JavaScriptes beállítás nem helyettesíti a szerverről érkező metaadatokat a keresők és közösségi előnézetek számára.
3. Az indexelés kezdetben tiltott. Csak végleges tartalommal törölje a főoldal `noindex` beállítását és állítsa a `robots.txt` szabályát `Allow: /` értékre. A `robots.txt` tiltása nem hozzáférés-védelem. A 404 oldal maradjon `noindex`; a jogi oldalak indexelése véglegesítés után opcionális. Ha indexelhetők, adja őket a sitemaphez.
4. A JSON-LD-ben csak ismert, ellenőrzött vállalkozási adat szerepeljen; kitalált értékelés, cím vagy szolgáltatási terület ne kerüljön bele.
5. Search Console: a `searchConsoleVerification` beállítással a metaellenőrzés előkészített. A biztos, JavaScript nélküli ellenőrzéshez a Google által adott metaelemet közvetlenül a HTML `head` részébe tegye, vagy használjon a Search Console-ban megadott DNS-rekordot. A végleges sitemapet ott küldje be.

## Az űrlap aktiválása és használata

A `js/config.js` jelenlegi beállítása:

```js
form: {
  mode: 'live',
  provider: 'formsubmit',
  endpoint: 'https://formsubmit.co/ajax/info@vostone.hu',
  successPage: 'koszonjuk.html',
  timeoutMs: 15000
}
```

1. Töltse fel az oldalt, majd HTTP(S)-címen nyissa meg; a `file://` megnyitás küldési próbára nem megfelelő.
2. Küldjön egy rövid tesztüzenetet. Az első használat aktiváló emailt indít a `info@vostone.hu` címre. A címzett nyissa meg, és kattintson a **Confirm / Activate** gombra; ellenőrizze a spam mappát is. Ezt a lépést a [FormSubmit hivatalos beállítási útmutatója](https://formsubmit.co/) írja le.
3. Aktiválás után az éles HTTP(S)-domainről küldjön újabb próbát, és a postafiókban is ellenőrizze a megérkezést. A konfiguráció bekötése önmagában nem igazolja az email kézbesítését. A fejlesztés során nem küldtünk éles tesztüzenetet.

Az űrlap AJAX-kéréssel küld a szolgáltatónak. Sikeres HTTP-válasz és `success: true` vagy `success: 'true'` visszaigazolás után a látogató a `koszonjuk.html` oldalra jut. Szolgáltatói hiba, 15 másodperces időtúllépés vagy internetkimaradás esetén hibaüzenetet és telefonos/emailes kapcsolatfelvételi lehetőséget kap; a kitöltött értékek megmaradnak, automatikus újraküldés nincs. A sikeres visszaigazolás a szolgáltató fogadását jelzi, a kézbesítést a címzett postafiókjában kell ellenőrizni.

Címzettváltáskor az `endpoint`, az oldalak emailhivatkozásai és az adatkezelési tájékoztató is frissítendő; az új cím aktiválását ismét ellenőrizze. A feladó válaszcíme a látogató emailmezőjéből származik. Részletek: [FormSubmit dokumentáció](https://formsubmit.co/documentation), [AJAX-útmutató](https://formsubmit.co/ajax-documentation).

## Sütibeállítások és opcionális GA4

A `js/cookies.js` hozza létre a reszponzív hozzájárulási sávot és a részletes beállítási ablakot. Az első döntés előtt a sáv a betöltő után jelenik meg; elfogadás, elutasítás és egyedi mentés is használható. A lábléc **Sütibeállítások** gombjával a döntés később módosítható vagy visszavonható.

A szükséges preferencia a `localStorage` **`vostone-cookie-consent`** kulcsára kerül: változat, szükséges működés, analitikai döntés, mérési azonosító, mentési és lejárati idő. Az utolsó kifejezett mentéstől **180 napig** érvényes. Új változat, új mérési azonosító, lejárat, hibás vagy törölt bejegyzés új választást kér; tiltott tárhelynél csak az aktuális oldalon őrzi a döntést. A megnyitott böngészőlapok összehangolják a változásokat.

Az `analytics.measurementId` jelenleg üres: az analitikai kapcsoló inaktív, nincs GA-kód vagy Google-követési kérés. Bekapcsolás előtt az `adatkezeles.html` tájékoztatóját egészítse ki a tényleges mérési adatokkal, szolgáltatóval, sütikkel, megőrzéssel és adattovábbítási feltételekkel, majd adjon meg érvényes `G-...` azonosítót a `js/config.js` fájlban. A mérés csak ezután, kifejezett hozzájárulásra indulhat. Az elutasítást és visszavonást is ellenőrizze; a weboldal és az űrlap ezek mellett is használható.

## Ellenőrzés

Élesítés előtt ellenőrizze a fő navigációt, mobilmenüt, billentyűzetes galériát, hibás és érvényes űrlapadatokat, a FormSubmit aktiválását, a köszönőoldalt és a hibaágakat. Opcionális analitikánál próbálja az elfogadás/elutasítás/visszavonás ágait is. Vizsgálja meg a 320, 375, 390, 430, 768, 1024, 1440 és 1920 px szélességeket. A helyi működés nem igazolja az éles levelezést, domainbeállítást vagy a szerver 404-válaszát.

## Ellenőrzött hivatalos források

Ellenőrzés: 2026. november 8.

- Rackhost cég- és tárhelyadatai: [Rackhost – kapcsolat és impresszum](https://www.rackhost.hu/contact).
- Adatvédelmi alapfogalmak és érintetti jogok: [GDPR, hivatalos magyar szöveg](https://eur-lex.europa.eu/legal-content/HU/TXT/?uri=CELEX:32016R0679).
- Panaszbenyújtás és hatósági elérhetőségek: [NAIH – ügyfélszolgálat, kapcsolat](https://naih.hu/ugyfelszolgalat-kapcsolat).

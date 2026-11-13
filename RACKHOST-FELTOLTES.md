# VOSTONE feltöltése Rackhost tárhelyre

Az éles cím: **https://www.vostone.hu/**. Feltöltendő csomag: **`vostone-rackhost.zip`**. Az oldal statikus; adatbázis és PHP beállítása nem szükséges, az űrlap a FormSubmit szolgáltatását használja.

## 1. Domain és HTTPS

A Rackhost felületén rendelje a `vostone.hu` és `www.vostone.hu` neveket ugyanahhoz a webtárhelyhez. A webes DNS-rekordokhoz kizárólag a saját tárhely paneljén megadott célértékeket használja. **A meglévő levelezési MX és TXT rekordokat ne módosítsa**, így az `info@vostone.hu` beállításai megmaradnak.

Előbb mindkét névre működő SSL-tanúsítvány szükséges, utána használható a csomag HTTPS/www átirányítása. A pontos panel a tárhelycsomagtól függ. [Rackhost: SSL telepítése](https://www.rackhost.hu/tudasbazis/cpanel-webtarhely/hogyan-tudom-aktivalni-az-ssl-tanusitvanyt-a-weboldalamhoz/).

## 2. Fájlok feltöltése

1. A tárhely Fájlkezelőjében vagy FTP-n nyissa meg a `vostone.hu` **dokumentumgyökerét**. Ezt a domain beállítása mutatja: cPanelen lehet például `public_html`, más csomagnál `web/vostone.hu/`; a saját paneljén látható útvonal a mérvadó. Ha van régi oldal vagy `.htaccess`, előbb mentse le.
2. Töltse fel a `vostone-rackhost.zip` fájlt, és **a tartalmát** bontsa ki ide. Az `index.html` közvetlenül a dokumentumgyökérben legyen, ne egy külön `vostone` mappában.
3. Ellenőrizze a `css`, `js`, `assets` mappákat és a rejtett **`.htaccess`** fájlt is. A Fájlkezelő beállításaiban engedélyezze a rejtett fájlok megjelenítését. [Rackhost: Fájlkezelő és rejtett fájlok](https://www.rackhost.hu/tudasbazis/cpanel-webtarhely/fajlkezelo-a-cpanel-feluleten/).

A csomag gyökerében az öt HTML-oldal, `robots.txt`, `sitemap.xml` és `.htaccess` szerepel a három fájlmappa mellett. A fejlesztői README, GitHub-munkafolyamatok és forrásjegyzék nem feltöltendő weboldalfájlok. Kibontás után a ZIP eltávolítható a nyilvános tárhelyről.

## 3. Ellenőrzés és űrlap

Nyissa meg az éles oldalt, majd ellenőrizze a képeket, menüt, galériát és az adatkezelési oldalt. A `http://vostone.hu/` és az `/index.html` cím a `https://www.vostone.hu/` címre irányítson. Egy nem létező oldal saját hibaoldalt és **404** HTTP-státuszt adjon. A csomag a `.htaccess` fájlban kezeli az átirányítást, a gyorsítótárazást és a támogatott tömörítést; ezeket éles szerveren is ellenőrizze.

Az első saját űrlappróba után az **`info@vostone.hu`** postaládában hagyja jóvá a FormSubmit aktiváló levelét; nézze meg a spam mappát is. Ezután a `https://www.vostone.hu/` oldalon újabb próbával ellenőrizze a tényleges beérkezést. A fejlesztői bekötés önmagában nem igazolja a kézbesítést.

## 4. Google Search Console

Vegyen fel **Domain-tulajdont** `vostone.hu` néven. Az igazolási ablakban kapott új DNS-rekordot a saját DNS-kezelőjében adja hozzá; a meglévő levelezési TXT-rekordokat hagyja meg. A rekordot sikeres igazolás után is tartsa meg. [Google: tulajdonjog igazolása](https://support.google.com/webmasters/answer/9008080?hl=hu).

Ezután a Webhelytérképek felületen küldje be: **https://www.vostone.hu/sitemap.xml**. [Google: sitemap beküldése](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap). A közzététel és a beküldés nem jelent azonnali indexelést vagy garantált találati helyezést.

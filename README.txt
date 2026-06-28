LOJËRAT SHQIPTARE — App-Paket
=================================

INHALT
  index.html      → Startseite / Hub (alle Spiele + Sprachwahl + Werbefrei-Kauf)
  kapucave.html   → Loja e Kapuçave (Socken/Murmel) — mit Combo + Cash-out
  cicmic.html     → Cic-Mic (Mühle/Strategie)
  gropat.html     → Gropat (Mancala)
  manifest.json   → PWA-Manifest (installierbar)
  sw.js           → Service Worker (Offline-Betrieb)
  icon-192.png    → App-Icon 192px
  icon-512.png    → App-Icon 512px

ALLE Dateien MÜSSEN im selben Ordner liegen. index.html ist der Einstieg.


FARB-THEMES (pro Spiel)
  Jedes Spiel hat im Menü eine Farbleiste (🎨 Ngjyra) mit 6 Welten:
    Nata (Nacht/blau), Ar (Gold), Smerald (grün), Rubin (weinrot) — dunkel
    Mjaltë (Honig/creme), Mermer (Marmor/hellgrau) — HELL
  Die Wahl wird pro Spiel gespeichert (localStorage). Standard:
    Kapuçave→Nata, Gropat→Ar, Cic-Mic→Smerald.
  Technik: Themes setzen CSS-Variablen über html[data-theme="..."].
  Nur Seitenhintergrund + Info-Flächen werden umgefärbt; Spielbrett/Steine
  behalten ihren Look → funktioniert auf hell UND dunkel.
  Der Hub (index.html) behält bewusst seine feste Farbe (kein Umschalter).

OFFLINE / PWA
  manifest.json + sw.js machen die App installierbar und offline-fähig.
  Wichtig: Service Worker laufen NUR über HTTPS (Netlify liefert das
  automatisch) oder über http://localhost — nicht per Datei-Doppelklick
  (file://). Zum lokalen Testen einen kleinen Webserver nutzen, z.B.:
    python3 -m http.server 8080   → dann http://localhost:8080 öffnen.


WAS NEU IST (diese Version)
  • Combo-Mechanik in Kapuçave: jede leere Socke ist mehr wert (+1, +2, +3 …).
    Triffst du die Murmel, verfallen die ungesicherten Punkte.
  • Cash-out-Button "💰 Sichern": ab der 2. Combo sichtbar — Punkte sichern
    und Runde freiwillig beenden (Push-your-luck). Die KI nutzt es ebenfalls.
  • Golden Shot ist jetzt ein "All-in": bei Treffer läuft die Combo über alle
    restlichen Socken weiter (großer Punktesprung), bei Fehlschuss alles verloren.
  • Eigene Akzentfarben je Spiel (Basis Holz+Gold bleibt):
        Kapuçave = Türkis (#7fd4e0)
        Gropat   = Smaragdgrün (#3fb86e)
        Cic-Mic  = Violett (#9b6dd6)
    Jede Farbe steckt in der CSS-Variable --accent bzw. --marble (oben in :root).
    Ändern = eine Zeile pro Datei.
  • Werbefrei-Kauf (einmalig, 1,99 €) — siehe unten.


WERBEFREI-KAUF EINRICHTEN
  Der Kauf-Button liegt im Hub (index.html). Die Logik ist im Objekt "ADS"
  gekapselt. Im reinen Browser ist KEIN echter Kauf möglich (zeigt nur einen
  Hinweis). Echte Käufe funktionieren erst im nativen Wrapper (Capacitor/Cordova).

  Schritte:
  1) Produkt anlegen:
       - Apple App Store Connect: In-App-Kauf, Typ "Non-Consumable",
         Produkt-ID = remove_ads
       - Google Play Console: In-App-Produkt, Produkt-ID = remove_ads
     (Andere ID möglich → in index.html die Variable IAP_PRODUCT_ID anpassen.)

  2) Kauf-Plugin einbauen (empfohlen: cordova-plugin-purchase / "CdvPurchase").
     Der Code reagiert bereits auf dessen Events:
       store.when().approved → verify
       store.when().verified → finish + ADS.grant()
       store.when().owned    → ADS.grant()
     Alternativ wird auch window.inAppPurchase (cordova-plugin-inapppurchase)
     unterstützt.

  3) Nach erfolgreichem Kauf/Restore wird ADS.grant() aufgerufen. Das setzt
     localStorage "noAds" = "1". Dieses Flag wirkt automatisch in ALLEN vier
     Seiten (gleiche Origin) → Banner werden ausgeblendet und AdMob übersprungen.

  "Käufe wiederherstellen" ruft ADS.restore() auf (Pflicht für App-Store-Freigabe).


ADMOB EINRICHTEN
  In JEDER der vier Dateien steht ein ADMOB_CONFIG-Block mit Platzhalter-IDs
  (aktuell Test-IDs). Ersetze sie durch deine echten IDs aus admob.google.com:
       appId.ios / appId.android
       bannerId.ios / bannerId.android
  Banner werden nur gezeigt, wenn "noAds" NICHT gesetzt ist.

  Empfehlung (UX): Banner im aktiven Spielbildschirm bleiben ausgeblendet
  (mehr Platz fürs Spielfeld); im Menü/Ergebnis sichtbar. Das ist bereits so
  umgesetzt.


ALS APP VERPACKEN (Kurz)
  - Capacitor: `npm i @capacitor/core @capacitor/cli`, dann diese 4 Dateien
    in den www-/dist-Ordner, `npx cap add ios` / `npx cap add android`.
  - PWA: index.html enthält bereits ein Manifest + App-Icon; installierbar
    direkt aus dem Browser.


HINWEIS
  Kein echter Bezahlvorgang ist in HTML allein möglich — die Store-Billing-APIs
  greifen erst im nativen Wrapper. Die komplette App-seitige Logik dafür ist
  aber vorbereitet; du musst nur Produkt-ID + Plugin verbinden (Schritte oben).

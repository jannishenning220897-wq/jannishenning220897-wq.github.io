        /* ========================================
           JAVASCRIPT - HIER BEGINNT DIE LOGIK
           ======================================== */

        // ===== KONFIGURATION =====
        const ADMIN_PASSWORT = "admin123"; // WICHTIG: Ändere das Passwort hier!

        /* ========================================
           MULTI-TENANT SYSTEM (NEU!)
           
           Jede Abteilung hat eigene Daten:
           - Eigene Benutzer & Guthaben
           - Eigene Produkte & Preise
           - Eigene Einkaufsliste
           - Eigene Abendessen-Bestellungen
           ======================================== */

        // ABTEILUNGS-DEFINITIONEN
        const ABTEILUNGEN_CONFIG = {
            'ww1': {
                name: 'Wache West - Abteilung 1',
                pin: '1234',
                kurzname: 'WW1'
            },
            'ww2': {
                name: 'Wache West - Abteilung 2',
                pin: '5678',
                kurzname: 'WW2'
            },
            'ws2': {
                name: 'Wache Süd - Abteilung 2',
                pin: '9012',
                kurzname: 'WS2'
            }
        };

        // AKTUELLE ABTEILUNG (wird beim Login gesetzt)
        let aktuelleAbteilungId = null;
        let aktuelleAbteilung = null;

        /* ========================================
           DATEN-STRUKTUR
           
           Hier werden alle Daten der App gespeichert.
           Diese Daten werden im Browser (localStorage)
           gespeichert und bleiben auch nach einem
           Neustart der App erhalten.
           ======================================== */
        
        /* ----- PRODUKTE -----
           
           Alle verfügbaren Produkte, organisiert
           nach Kategorien (Getränke, Brötchen, etc.).
           
           STRUKTUR:
           - id: Einzigartige Nummer des Produkts
           - name: Name der auf der Karte angezeigt wird
           - preis: Preis in Euro (änderbar in Preisverwaltung)
           - typ: Kategorie für Einkaufsliste
                  (z.B. "brötchen_normal" wird gezählt,
                   "sonstiges" wird NICHT gezählt)
           
           NEUE PRODUKTE HINZUFÜGEN:
           1. Neue id vergeben (fortlaufend)
           2. Name, Preis und Typ festlegen
           3. In passende Kategorie einfügen
           
           NEUE KATEGORIE HINZUFÜGEN:
           1. Neues Objekt mit name + produkte erstellen
           2. In produktKategorien-Array einfügen
        */
        let produktKategorien = [
            {
                name: "Getränke",
                produkte: [
                    { id: 1, name: "Kaffeeflatrate", preis: 1.00, typ: "sonstiges" },
                    { id: 2, name: "Cola/Fanta/Limo", preis: 1.30, typ: "sonstiges" },
                    
                    
                ]
            },
            {
                name: "Brötchen",
                produkte: [
                    { id: 3, name: "Normal", preis: 1.30, typ: "brötchen_normal" },
                    { id: 4, name: "Sunny", preis: 1.50, typ: "brötchen_sunny" },
                    { id: 5, name: "Roggen", preis: 1.70, typ: "brötchen_roggen" },
                    { id: 6, name: "Mehrkorn", preis: 1.70, typ: "brötchen_mehrkorn" }
                    
                ]
            },
            {
                name: "Eier",
                produkte: [
                    { id: 7, name: "Ei", preis: 0.40, typ: "ei" }
                ]
            },
            {
                name: "Abendessen",
                produkte: [
                    { id: 8, name: "Abendessen Normal", preis: 0, typ: "abendessen_normal" },
                    { id: 9, name: "Abendessen Vegetarisch", preis: 0, typ: "abendessen_vegetarisch" }
                ]
            },
             
            {
                name: "Kuchen & Eis",
                produkte: [
                    { id: 10, name: "Kuchen/Eis", preis: 1.20, typ: "sonstiges" }
                ]
            },
            {
                name: "Süßigkeiten",
                produkte: [
                    { id: 11, name: "Süßes Klein", preis: 0.40, typ: "sonstiges" },
                    { id: 12, name: "Süßes Groß", preis: 0.80, typ: "sonstiges" }
                ]
            }
        ];

        // HILFSVARIABLE: Flache Produkt-Liste
        // Wird automatisch aus produktKategorien erstellt
        // Macht es einfacher, ein Produkt per ID zu finden
        let alleProdukteFlach = [];
        produktKategorien.forEach(kategorie => {
            alleProdukteFlach = alleProdukteFlach.concat(kategorie.produkte);
        });

        /* ----- BENUTZER -----
           
           Alle Personen die die Kantine nutzen,
           organisiert nach 5 Kategorien.
           
           STRUKTUR JEDER PERSON:
           - id: Einzigartige ID (optional, nur bei festen Personen)
           - name: Name der Person
           - guthaben: Aktuelles Guthaben in Euro (kann negativ sein = Schulden)
           - tagesbestellungen: Array mit heutigen Bestellungen
           - istPlatzhalter: true = Leerer Platz (nur bei Gästen/Notarzt/Azubi/B-Dienst)
           
           KATEGORIEN:
           - wachabteilung: Feste Personen mit Namen
           - bdienst: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           - notarzt: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           - azubi: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           - gaeste: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           
           NEUE PERSON HINZUFÜGEN (bei Wachabteilung):
           1. Neue id vergeben (z.B. "w28")
           2. Name, guthaben: 0.00, tagesbestellungen: [] einfügen
           3. In die richtige Kategorie eintragen
           
           HINWEIS: Bei B-Dienst/Notarzt/Azubi/Gäste werden Namen zur
           Laufzeit eingegeben - hier nichts ändern!
        */
        let benutzer = {
            wachabteilung: [
                { id: "w1", name: "Test Benutzer", guthaben: 0.00 }
            ],
            bdienst: [
                // 12 leere Platzhalter
                { name: "Test Gast", guthaben: 5.00, istPlatzhalter: false, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ],

            notarzt: [
                // 12 leere Platzhalter für Gäste
                { name: "Test Gast", guthaben: 5.00, istPlatzhalter: false, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ],

            azubi: [
                // 12 leere Platzhalter für Gäste
                { name: "Test Gast", guthaben: 5.00, istPlatzhalter: false, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ],

            gaeste: [
                // 12 leere Platzhalter für Gäste
                { name: "Test Gast", guthaben: 5.00, istPlatzhalter: false, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ]

            
        };

        /* ----- EINKAUFSLISTE -----
           
           Zählt wie viele Artikel heute bestellt wurden.
           Diese Liste wird im Küchenbereich angezeigt.
           
           FUNKTION:
           - Bei jeder Bestellung werden die Mengen hochgezählt
           - Bei Tagesabschluss wird alles auf 0 gesetzt
           - Nur Produkte mit passendem "typ" werden gezählt
           
           NEUE ARTIKEL HINZUFÜGEN:
           1. Neue Zeile mit typ: 0 erstellen
           2. Typ muss mit Produkt-typ übereinstimmen
           3. Namen in einkaufslisteAnzeigen() hinzufügen
           
           HINWEIS: "sonstiges" wird NICHT gezählt!
        */
        let einkaufsliste = {
            brötchen_normal: 0,
            brötchen_mehrkorn: 0,
            brötchen_sunny: 0,
            brötchen_roggen: 0,
            ei: 0,
            abendessen_normal: 0,
            abendessen_vegetarisch: 0
        };

        /* ----- ABENDESSEN-BESTELLUNGEN -----
           
           Liste aller Personen die heute Abendessen bestellt haben.
           
           FUNKTION:
           - Beim Bestellen: Person wird zur Liste hinzugefügt (Preis = 0€)
           - Im Koch-Bereich: Liste wird angezeigt + Abrechnung möglich
           - Nach Abbuchung: Liste wird geleert
           
           STRUKTUR:
           - name: Name der Person
           - kategorie: Welche Kategorie (für Zugriff auf Guthaben)
           - benutzerIndex: Index in der Kategorie (für Guthaben-Abzug)
           - vegetarisch: true/false (zur Info, wird aber nicht unterschieden bei Abrechnung)
        */
        let abendessenBestellungen = [];

        /* ----- ZUSTANDSVARIABLEN -----
           
           Diese Variablen merken sich den aktuellen
           Zustand der App (wo ist der Benutzer gerade,
           was liegt im Warenkorb, etc.).
           
           Diese Variablen werden NICHT gespeichert,
           da sie sich ständig ändern.
        */
        let aktuelleKategorie = null;      // Welche Kategorie wurde gewählt? (wachabteilung/bdienst/etc.)
        let aktuellerBenutzer = null;      // Wer ist gerade angemeldet? (Objekt mit name, guthaben, etc.)
        let aktuellerGastIndex = null;     // Bei Gästen/Notarzt/Azubi: Welcher Platzhalter-Index?
        let warenkorb = [];                // Was liegt aktuell im Warenkorb? (Array von Produkten mit Menge)
        let guthabenVerwaltungKategorie = null; // Im Verwaltungsbereich: Welche Kategorie wurde gewählt?

        /* ========================================
           DATEN SPEICHERN & LADEN
           
           Diese Funktionen speichern alle wichtigen
           Daten im Browser (localStorage).
           
           localStorage = Speicher im Browser, der
           auch nach Neustart erhalten bleibt.
           
           WAS WIRD GESPEICHERT:
           - benutzer (mit Namen, Guthaben, Tagesbestellungen)
           - produktKategorien (mit Preisen)
           - einkaufsliste (Tageszähler)
           
           WAS WIRD NICHT GESPEICHERT:
           - Zustandsvariablen (aktuelleKategorie, warenkorb, etc.)
             Diese werden bei jedem App-Start zurückgesetzt
           ======================================== */
        
        function datenSpeichern() {
            // Multi-Tenant: Speichere Daten mit Abteilungs-Prefix
            if (!aktuelleAbteilungId) {
                console.warn('⚠️ Keine Abteilung angemeldet - Speichern übersprungen');
                return;
            }

            // WICHTIG: Runde alle Guthaben auf 2 Nachkommastellen
            // Grund: JavaScript hat manchmal Rundungsfehler bei
            // Kommazahlen (z.B. 0.1 + 0.2 = 0.30000000000000004)
            for (const kategorie in benutzer) {
                benutzer[kategorie].forEach(person => {
                    if (!person.istPlatzhalter) {
                        person.guthaben = Math.round(person.guthaben * 100) / 100;
                    }
                });
            }

            // Speichere mit Abteilungs-Prefix
            const prefix = aktuelleAbteilungId + '_';
            localStorage.setItem(prefix + 'benutzer', JSON.stringify(benutzer));
            localStorage.setItem(prefix + 'produktKategorien', JSON.stringify(produktKategorien));
            localStorage.setItem(prefix + 'einkaufsliste', JSON.stringify(einkaufsliste));
            localStorage.setItem(prefix + 'abendessenBestellungen', JSON.stringify(abendessenBestellungen));
            
            console.log(`✅ Daten für ${aktuelleAbteilung.name} gespeichert!`);
        }

        function datenLaden() {
            // Multi-Tenant: Lade Daten mit Abteilungs-Prefix
            if (!aktuelleAbteilungId) {
                console.warn('⚠️ Keine Abteilung angemeldet - Laden übersprungen');
                return;
            }

            const prefix = aktuelleAbteilungId + '_';

            // MIGRATION: Alte Daten (ohne Prefix) zu neuer Struktur migrieren
            // Dies läuft nur einmal beim ersten Login nach dem Update
            migriereAlteDaten(aktuelleAbteilungId);

            // Lade Daten dieser Abteilung
            const gespeicherteBenutzer = localStorage.getItem(prefix + 'benutzer');
            const gespeicherteKategorien = localStorage.getItem(prefix + 'produktKategorien');
            const gespeicherteEinkaufsliste = localStorage.getItem(prefix + 'einkaufsliste');
            const gespeicherteAbendessenBestellungen = localStorage.getItem(prefix + 'abendessenBestellungen');

            // Wenn Daten vorhanden sind, lade sie
            if (gespeicherteBenutzer) {
                benutzer = JSON.parse(gespeicherteBenutzer);
                
                // WICHTIG: Initialisiere tagesbestellungen für alte Datensätze
                // Falls jemand die App schon vorher genutzt hat, haben die
                // Benutzer noch kein tagesbestellungen-Array
                for (const kategorie in benutzer) {
                    benutzer[kategorie].forEach(person => {
                        if (!person.tagesbestellungen) {
                            person.tagesbestellungen = [];
                        }
                    });
                }
            }
            
            if (gespeicherteKategorien) {
                produktKategorien = JSON.parse(gespeicherteKategorien);
                
                // Erstelle flache Produktliste neu (für schnellen Zugriff per ID)
                alleProdukteFlach = [];
                produktKategorien.forEach(kategorie => {
                    alleProdukteFlach = alleProdukteFlach.concat(kategorie.produkte);
                });
            }
            
            if (gespeicherteEinkaufsliste) {
                einkaufsliste = JSON.parse(gespeicherteEinkaufsliste);
            }
            
            if (gespeicherteAbendessenBestellungen) {
                abendessenBestellungen = JSON.parse(gespeicherteAbendessenBestellungen);
            }
            
            console.log(`✅ Daten für ${aktuelleAbteilung.name} geladen!`);
        }

        function migriereAlteDaten(abteilungId) {
            // Migriere alte Daten (ohne Prefix) zu neuer Struktur (mit Prefix)
            // Dies wird nur für WW1 relevant sein, da das die ursprüngliche Installation ist
            
            const prefix = abteilungId + '_';
            
            // Prüfe ob schon neue Daten vorhanden (dann keine Migration nötig)
            if (localStorage.getItem(prefix + 'benutzer')) {
                return; // Neue Daten bereits vorhanden
            }
            
            // Prüfe ob alte Daten vorhanden (ohne Prefix)
            const alteBenutzer = localStorage.getItem('benutzer');
            const alteProdukte = localStorage.getItem('produktKategorien');
            const alteEinkaufsliste = localStorage.getItem('einkaufsliste');
            const alteAbendessen = localStorage.getItem('abendessenBestellungen');
            
            // Wenn alte Daten gefunden, migriere sie
            if (alteBenutzer || alteProdukte) {
                console.log(`🔄 Migriere alte Daten zu ${abteilungId}...`);
                
                if (alteBenutzer) {
                    localStorage.setItem(prefix + 'benutzer', alteBenutzer);
                }
                if (alteProdukte) {
                    localStorage.setItem(prefix + 'produktKategorien', alteProdukte);
                }
                if (alteEinkaufsliste) {
                    localStorage.setItem(prefix + 'einkaufsliste', alteEinkaufsliste);
                }
                if (alteAbendessen) {
                    localStorage.setItem(prefix + 'abendessenBestellungen', alteAbendessen);
                }
                
                console.log(`✅ Migration erfolgreich! Alte Daten jetzt unter ${abteilungId}`);
                
                // NICHT löschen! Andere Abteilungen könnten sie noch brauchen
                // localStorage.removeItem('benutzer'); etc.
            }
        }

        /* ========================================
           NAVIGATION
           
           Diese Funktionen steuern die Seitenansicht.
           Die App hat verschiedene "Bereiche" (Seiten),
           die ein- und ausgeblendet werden.
           
           BEREICHE DER APP:
           1. startseite - Kategorieauswahl (Wachabteilung, B-Dienst, etc.)
           2. benutzer-auswahl - Person aus Kategorie wählen
           3. bestell-bereich - Produkte auswählen und bestellen
           4. koch-bereich - Einkaufsliste und Schulden (KEIN Passwort)
           5. guthaben-login - Passwort-Eingabe für Verwaltung
           6. guthaben-kategorie - Kategorie für Guthaben-Verwaltung wählen
           7. guthaben-personen - Guthaben aufladen/abziehen
           8. preisverwaltung - Preise ändern
           
           WICHTIG: Immer nur EIN Bereich ist sichtbar!
           ======================================== */
        
        /* ========================================
           LOGIN & AUTHENTIFIZIERUNG (NEU!)
           
           Multi-Tenant System:
           - Jede Abteilung hat eigene PIN
           - Login bleibt gespeichert (localStorage)
           - Abmelden möglich
           ======================================== */

        function anmelden() {
            const abteilungId = document.getElementById('abteilung-auswahl').value;
            const pin = document.getElementById('pin-eingabe').value;

            // Validierung
            if (!abteilungId) {
                meldungAnzeigen('Bitte wählen Sie eine Abteilung aus!', 'fehler');
                return;
            }

            if (!pin) {
                meldungAnzeigen('Bitte geben Sie Ihre PIN ein!', 'fehler');
                return;
            }

            // PIN prüfen
            const abteilung = ABTEILUNGEN_CONFIG[abteilungId];
            if (pin !== abteilung.pin) {
                meldungAnzeigen('❌ Falsche PIN!', 'fehler');
                document.getElementById('pin-eingabe').value = '';
                return;
            }

            // Login erfolgreich!
            aktuelleAbteilungId = abteilungId;
            aktuelleAbteilung = abteilung;

            // Speichere Login im localStorage
            localStorage.setItem('angemeldet_abteilung', abteilungId);

            // Lade Daten dieser Abteilung
            datenLaden();

            // Zeige App
            zuApp();
        }

        function zuApp() {
            // Wechsle vom Login zur App-Startseite
            alleBereicheVerstecken();
            document.getElementById('startseite').classList.remove('hidden');
            
            // Zeige alle Header-Buttons (Küche, Verwaltung, Abmelden)
            document.getElementById('kueche-btn').style.display = 'block';
            document.getElementById('verwaltung-btn').style.display = 'block';
            document.getElementById('abmelden-btn').style.display = 'block';
        }

        function abmelden() {
            if (!confirm('Wirklich abmelden?\n\nSie müssen sich beim nächsten Mal neu anmelden.')) {
                return;
            }

            // Lösche gespeicherten Login
            localStorage.removeItem('angemeldet_abteilung');
            
            // Zurück zum Login
            aktuelleAbteilungId = null;
            aktuelleAbteilung = null;
            
            alleBereicheVerstecken();
            document.getElementById('login-bereich').classList.remove('hidden');
            
            // Verstecke alle Header-Buttons
            document.getElementById('kueche-btn').style.display = 'none';
            document.getElementById('verwaltung-btn').style.display = 'none';
            document.getElementById('abmelden-btn').style.display = 'none';
            
            // Formular zurücksetzen
            document.getElementById('abteilung-auswahl').value = '';
            document.getElementById('pin-eingabe').value = '';
            document.getElementById('login-formular').style.display = 'block';
            document.getElementById('bereits-angemeldet').style.display = 'none';
            
            meldungAnzeigen('✅ Erfolgreich abgemeldet!', 'erfolg');
        }

        function abmeldenVomLogin() {
            // Vom "Bereits angemeldet"-Screen abmelden
            localStorage.removeItem('angemeldet_abteilung');
            aktuelleAbteilungId = null;
            aktuelleAbteilung = null;
            
            document.getElementById('login-formular').style.display = 'block';
            document.getElementById('bereits-angemeldet').style.display = 'none';
            document.getElementById('abteilung-auswahl').value = '';
            document.getElementById('pin-eingabe').value = '';
        }

        function pruefeLogin() {
            // Prüfe beim App-Start ob bereits eingeloggt
            const gespeicherteAbteilung = localStorage.getItem('angemeldet_abteilung');
            
            if (gespeicherteAbteilung && ABTEILUNGEN_CONFIG[gespeicherteAbteilung]) {
                // Bereits eingeloggt!
                aktuelleAbteilungId = gespeicherteAbteilung;
                aktuelleAbteilung = ABTEILUNGEN_CONFIG[gespeicherteAbteilung];
                
                // Zeige "Bereits angemeldet" Info
                document.getElementById('angemeldet-als-text').textContent = aktuelleAbteilung.name;
                document.getElementById('bereits-angemeldet').style.display = 'block';
                document.getElementById('login-formular').style.display = 'none';
                
                // Zeige Header-Buttons (versteckt, da noch im Login-Screen)
                // Werden sichtbar wenn "Weiter zur App" geklickt wird
                
                // Lade Daten
                datenLaden();
                
                return true;
            } else {
                // Nicht eingeloggt - zeige Login
                alleBereicheVerstecken();
                document.getElementById('login-bereich').classList.remove('hidden');
                
                // Verstecke alle Header-Buttons
                document.getElementById('kueche-btn').style.display = 'none';
                document.getElementById('verwaltung-btn').style.display = 'none';
                document.getElementById('abmelden-btn').style.display = 'none';
                
                return false;
            }
        }

        /* ========================================
           NAVIGATION
           ======================================== */

        function alleBereicheVerstecken() {
            // Verstecke ALLE Bereiche der App
            // Diese Funktion wird vor jedem Seitenwechsel aufgerufen
            // Danach wird der gewünschte Bereich wieder eingeblendet
            document.getElementById('login-bereich').classList.add('hidden');
            document.getElementById('startseite').classList.add('hidden');
            document.getElementById('benutzer-auswahl').classList.add('hidden');
            document.getElementById('bestell-bereich').classList.add('hidden');
            document.getElementById('koch-bereich').classList.add('hidden');
            document.getElementById('guthaben-login').classList.add('hidden');
            document.getElementById('guthaben-kategorie').classList.add('hidden');
            document.getElementById('guthaben-personen').classList.add('hidden');
            document.getElementById('preisverwaltung').classList.add('hidden');
            document.getElementById('wachabteilung-bearbeiten').classList.add('hidden');
        }

        function zurückZurStartseite() {
            // Gehe zurück zur Startseite und setze alles zurück
            alleBereicheVerstecken();
            document.getElementById('startseite').classList.remove('hidden');
            
            // Zustand zurücksetzen
            aktuelleKategorie = null;
            aktuellerBenutzer = null;
            aktuellerGastIndex = null;
            warenkorb = [];
        }

        function zurückZuBenutzerauswahl() {
            // Gehe zurück zur Benutzer-Liste
            alleBereicheVerstecken();
            document.getElementById('benutzer-auswahl').classList.remove('hidden');
            
            // Benutzer abmelden, aber Kategorie behalten
            aktuellerBenutzer = null;
            warenkorb = [];
        }

        /* ========================================
           SORTIERUNG NACH NACHNAMEN
           
           Diese Funktion sortiert Personen
           alphabetisch nach ihrem Nachnamen.
           ======================================== */
        
        function nachNamenSortieren(personen) {
            // Erstelle eine Kopie der Liste
            return [...personen].sort((a, b) => {
                // Platzhalter (leere Gäste) immer ans Ende
                if (a.istPlatzhalter && !b.istPlatzhalter) return 1;
                if (!a.istPlatzhalter && b.istPlatzhalter) return -1;
                if (a.istPlatzhalter && b.istPlatzhalter) return 0;
                
                // Extrahiere Nachname (letztes Wort im Namen)
                const nameA = a.name.split(' ').pop().toLowerCase();
                const nameB = b.name.split(' ').pop().toLowerCase();
                
                // Vergleiche alphabetisch
                return nameA.localeCompare(nameB);
            });
        }

        /* ========================================
           KATEGORIE AUSWÄHLEN (Startseite)
           
           Wird aufgerufen, wenn jemand auf
           "Wachabteilung", "B-Dienst" oder "Gäste"
           klickt.
           ======================================== */
        
        function kategorieAuswaehlen(kategorie) {
            // Merke dir welche Kategorie gewählt wurde
            aktuelleKategorie = kategorie;
            
            // Zeige Benutzer-Auswahl
            alleBereicheVerstecken();
            document.getElementById('benutzer-auswahl').classList.remove('hidden');
            
            // Setze passenden Titel für alle Kategorien
            const titel = {
                'wachabteilung': 'Wachabteilung',
                'bdienst': 'B-Dienst',
                'notarzt': 'Notarzt',
                'azubi': 'Auszubildende',
                'gaeste': 'Gäste'
            };
            document.getElementById('kategorie-titel').textContent = titel[kategorie];
            
            // Schulden-Warnung nur bei Wachabteilung anzeigen
            if (kategorie === 'wachabteilung') {
                schuldenWarnungAnzeigen();
            } else {
                document.getElementById('schulden-warnung-box').classList.add('hidden');
            }
            
            // Name-Eingabe nur bei Kategorien mit Platzhaltern anzeigen (Gäste, Notarzt, Azubi, B-Dienst)
            const platzhalterKategorien = ['gaeste', 'notarzt', 'azubi', 'bdienst'];
            if (platzhalterKategorien.includes(kategorie)) {
                document.getElementById('platzhalter-eingabe-bereich').classList.remove('hidden');
            } else {
                document.getElementById('platzhalter-eingabe-bereich').classList.add('hidden');
            }
            
            // Zeige die Benutzer-Liste (automatisch sortiert)
            benutzerListeAnzeigen();
        }

        /* ========================================
           SCHULDEN-WARNUNG
           
           Findet die Person mit den höchsten
           Schulden in der Wachabteilung und
           zeigt eine Warnung an.
           ======================================== */
        
        function schuldenWarnungAnzeigen() {
            const warnung = document.getElementById('schulden-warnung-box');
            
            // Finde Person mit niedrigstem Guthaben (= höchste Schulden)
            let maxSchulden = 0;
            let personMitMaxSchulden = null;
            
            benutzer.wachabteilung.forEach(person => {
                if (person.guthaben < maxSchulden) {
                    maxSchulden = person.guthaben;
                    personMitMaxSchulden = person;
                }
            });
            
            // Wenn jemand Schulden hat, zeige Warnung
            if (personMitMaxSchulden) {
                warnung.classList.remove('hidden');
                warnung.innerHTML = `
                    <strong>⚠️ Höchste Schulden:</strong> ${personMitMaxSchulden.name} 
                    (${maxSchulden.toFixed(2)} €)
                `;
            } else {
                warnung.classList.add('hidden');
            }
        }

        /* ========================================
           BENUTZER-LISTE ANZEIGEN
           
           Zeigt alle Personen der gewählten
           Kategorie an - SORTIERT NACH NACHNAMEN!
           ======================================== */
        
        function benutzerListeAnzeigen() {
            const liste = document.getElementById('benutzer-liste');
            liste.innerHTML = ''; // Leere die Liste

            // Hole Personen und sortiere sie nach Nachnamen
            let personenListe = nachNamenSortieren(benutzer[aktuelleKategorie]);

            // Erstelle für jede Person eine Karte
            personenListe.forEach((person) => {
                const karte = document.createElement('div');
                
                // Platzhalter anzeigen bei allen Kategorien die sie haben (Gäste, Notarzt, Azubi)
                if (person.istPlatzhalter) {
                    // LEERER PLATZHALTER - ausgegraut, nicht klickbar
                    karte.className = 'benutzer-karte platzhalter';
                    karte.innerHTML = `
                        <div class="benutzer-name">Leerer Platz</div>
                        <div class="benutzer-guthaben" style="color: #95a5a6; font-size: 14px;">
                            Unten Name eingeben
                        </div>
                    `;
                } else {
                    // NORMALE PERSON
                    karte.className = 'benutzer-karte';
                    
                    // Finde Original-Index (wichtig fürs Speichern)
                    const originalIndex = benutzer[aktuelleKategorie].indexOf(person);
                    
                    // Klick auf Karte = Person anmelden
                    karte.onclick = () => benutzerAnmelden(person, originalIndex);
                    
                    // Farbe je nach Guthaben (positiv = grün, negativ = rot)
                    const guthabenKlasse = person.guthaben >= 0 ? 'guthaben-positiv' : 'guthaben-negativ';
                    
                    karte.innerHTML = `
                        <div class="benutzer-name">${person.name}</div>
                        <div class="benutzer-guthaben ${guthabenKlasse}">
                            ${person.guthaben.toFixed(2)} €
                        </div>
                    `;
                }
                
                // Füge Karte zur Liste hinzu
                liste.appendChild(karte);
            });
        }

        /* ========================================
           BENUTZER ANMELDEN
           
           Wird aufgerufen wenn jemand auf eine
           Person klickt. Öffnet dann die
           Bestell-Seite.
           ======================================== */
        
        function benutzerAnmelden(benutzer, index) {
            // Merke dir wer angemeldet ist
            aktuellerBenutzer = benutzer;
            if (aktuelleKategorie === 'gaeste') {
                aktuellerGastIndex = index;
            }
            warenkorb = []; // Leere den Warenkorb
            
            // Zeige Bestell-Seite
            alleBereicheVerstecken();
            document.getElementById('bestell-bereich').classList.remove('hidden');
            
            // Zeige Name und Guthaben an
            document.getElementById('aktueller-benutzer').textContent = benutzer.name;
            document.getElementById('guthaben-anzeige').textContent = benutzer.guthaben.toFixed(2) + ' €';
            
            // Zeige Produkte und Warenkorb
            produkteAnzeigen();
            warenkorbAktualisieren();
            
            // Zeige Tagesübersicht des Benutzers
            benutzerTagesuebersichtAnzeigen();
        }

        /* ========================================
           GAST NAME SETZEN
           
           Wenn ein Gastname eingegeben wird,
           wird der erste leere Platzhalter
           mit diesem Namen gefüllt.
           ======================================== */
        
        /* ========================================
           PLATZHALTER NAME SETZEN (Gäste / Notarzt / Azubi)
           
           Eine einzige Funktion für alle drei
           Kategorien mit Platzhaltern.
           Nutzt aktuelleKategorie um zu wissen
           wohin der Name gehört.
           ======================================== */
        
        function platzhalterNameSetzen() {
            const name = document.getElementById('platzhalter-name-input').value.trim();
            
            // Prüfe ob Name eingegeben wurde
            if (!name) {
                meldungAnzeigen('Bitte einen Namen eingeben!', 'fehler');
                return;
            }

            // Finde ersten leeren Platzhalter in der AKTUELLEN Kategorie
            const index = benutzer[aktuelleKategorie].findIndex(g => g.istPlatzhalter);
            
            if (index === -1) {
                meldungAnzeigen('Alle 12 Plätze sind belegt!', 'fehler');
                return;
            }

            // Erstelle neuen Eintrag
            benutzer[aktuelleKategorie][index] = {
                name: name,
                guthaben: 0.00,
                istPlatzhalter: false,
                tagesbestellungen: []
            };

            datenSpeichern();
            document.getElementById('platzhalter-name-input').value = '';
            
            // Melde Person direkt an
            benutzerAnmelden(benutzer[aktuelleKategorie][index], index);
        }

       

        /* ========================================
           PRODUKTE ANZEIGEN
           
           Zeigt alle verfügbaren Produkte auf der
           Bestellseite an, organisiert nach Kategorien.
           
           FUNKTION:
           - Geht durch alle produktKategorien
           - Erstellt für jede Kategorie eine Überschrift
           - Erstellt für jedes Produkt eine Karte mit:
             * Name und Preis
             * Plus/Minus Buttons zur Mengenauswahl
             * Aktuelle Menge aus dem Warenkorb
           
           HINWEIS: Die Menge wird direkt aus dem
           warenkorb-Array gelesen und angezeigt
           ======================================== */
        
        function produkteAnzeigen() {
            const container = document.getElementById('produkte-container');
            container.innerHTML = '';

            // Gehe durch alle Produkt-Kategorien
            produktKategorien.forEach(kategorie => {
                // Erstelle Kategorie-Container
                const katDiv = document.createElement('div');
                katDiv.className = 'produkt-kategorie';
                
                // Überschrift
                const h3 = document.createElement('h3');
                h3.textContent = kategorie.name;
                katDiv.appendChild(h3);
                
                // Produkt-Grid
                const grid = document.createElement('div');
                grid.className = 'produkt-liste';
                
                // Erstelle Karte für jedes Produkt
                kategorie.produkte.forEach(p => {
                    const karte = document.createElement('div');
                    karte.className = 'produkt-karte';
                    
                    // Finde Menge im Warenkorb
                    const imWarenkorb = warenkorb.find(item => item.id === p.id);
                    const menge = imWarenkorb ? imWarenkorb.menge : 0;
                    
                    karte.innerHTML = `
                        <div class="produkt-name">${p.name}</div>
                        <div class="produkt-preis">${p.preis.toFixed(2)} €</div>
                        <div class="menge-steuerung">
                            <button class="menge-btn" onclick="produktEntfernen(${p.id})">−</button>
                            <span class="menge-anzeige" id="menge-${p.id}">${menge}</span>
                            <button class="menge-btn" onclick="produktHinzufugen(${p.id})">+</button>
                        </div>
                    `;
                    
                    grid.appendChild(karte);
                });
                
                katDiv.appendChild(grid);
                container.appendChild(katDiv);
            });
        }

        /* ========================================
           WARENKORB-FUNKTIONEN
           
           Diese Funktionen verwalten den Warenkorb:
           - Produkte hinzufügen (Plus-Button)
           - Produkte entfernen (Minus-Button)
           - Warenkorb anzeigen (Zusammenfassung unten)
           
           WICHTIG: 
           - Bei Plus: Menge wird erhöht ODER Produkt neu hinzugefügt
           - Bei Minus: Menge wird verringert ODER Produkt entfernt (bei 0)
           - Beide Funktionen aktualisieren die Mengen-Anzeige
             bei den Produkten UND im Warenkorb
           ======================================== */
        
        function produktHinzufugen(produktId) {
            // Finde das Produkt in der flachen Produktliste
            const produkt = alleProdukteFlach.find(p => p.id === produktId);
            
            // Prüfe ob Produkt schon im Warenkorb ist
            const vorhandenesItem = warenkorb.find(item => item.id === produktId);
            
            if (vorhandenesItem) {
                // Produkt ist schon im Warenkorb → Erhöhe nur die Menge
                vorhandenesItem.menge++;
            } else {
                // Produkt ist NEU im Warenkorb → Füge es mit Menge 1 hinzu
                warenkorb.push({
                    id: produkt.id,
                    name: produkt.name,
                    preis: produkt.preis,
                    typ: produkt.typ,
                    menge: 1
                });
            }
            
            // Aktualisiere die Mengen-Anzeige beim Produkt (die Zahl neben +/-)
            const mengeElement = document.getElementById('menge-' + produktId);
            if (mengeElement) {
                const item = warenkorb.find(item => item.id === produktId);
                mengeElement.textContent = item ? item.menge : 0;
            }
            
            // Aktualisiere den Warenkorb unten (Zusammenfassung)
            warenkorbAktualisieren();
        }

        function produktEntfernen(produktId) {
            // Finde das Produkt im Warenkorb
            const item = warenkorb.find(item => item.id === produktId);
            
            if (item) {
                // Verringere die Menge um 1
                item.menge--;
                
                // Wenn Menge 0 erreicht → Entferne Produkt komplett aus Warenkorb
                if (item.menge <= 0) {
                    warenkorb = warenkorb.filter(item => item.id !== produktId);
                }
            }
            
            // Aktualisiere die Mengen-Anzeige beim Produkt (die Zahl neben +/-)
            const mengeElement = document.getElementById('menge-' + produktId);
            if (mengeElement) {
                const item = warenkorb.find(item => item.id === produktId);
                mengeElement.textContent = item ? item.menge : 0;
            }
            
            // Aktualisiere den Warenkorb unten (Zusammenfassung)
            warenkorbAktualisieren();
        }

        /* ========================================
           INDIVIDUELLER BETRAG
           
           Ermöglicht das Hinzufügen eines
           benutzerdefinierten Betrags.
           ======================================== */
        
        function individuellenBetragHinzufugen() {
            const betrag = parseFloat(document.getElementById('individueller-betrag-input').value);
            const bezeichnung = document.getElementById('individueller-bezeichnung-input').value.trim();
            
            // Prüfe ob Betrag gültig ist
            if (isNaN(betrag) || betrag <= 0) {
                meldungAnzeigen('Bitte einen gültigen Betrag eingeben!', 'fehler');
                return;
            }
            
            // Nutze Bezeichnung oder Standard-Text
            const name = bezeichnung || 'Individueller Betrag';
            
            // Erstelle einzigartige ID (negativ, damit keine Konflikte)
            const neuId = -Date.now();
            
            // Füge zum Warenkorb hinzu
            warenkorb.push({
                id: neuId,
                name: name,
                preis: betrag,
                typ: 'sonstiges',
                menge: 1,
                istIndividuell: true
            });
            
            // Leere Eingabefelder
            document.getElementById('individueller-betrag-input').value = '';
            document.getElementById('individueller-bezeichnung-input').value = '';
            
            warenkorbAktualisieren();
        }

        function warenkorbAktualisieren() {
            // Hole HTML-Elemente für Warenkorb und Summe
            const warenkorbDiv = document.getElementById('warenkorb');
            const summeSpan = document.getElementById('summe-anzeige');
            
            // FALL 1: Warenkorb ist leer
            if (warenkorb.length === 0) {
                warenkorbDiv.innerHTML = '<p style="color: #95a5a6; text-align: center; padding: 20px;">Warenkorb ist leer</p>';
                summeSpan.textContent = '0.00';
                return;
            }
            
            // FALL 2: Warenkorb hat Produkte
            let html = '';
            let summe = 0;
            
            // Erstelle für jedes Produkt eine Zeile
            // Format: "2× Süßes Klein" (NUR Menge und Name, kein Preis)
            warenkorb.forEach(item => {
                const itemSumme = item.preis * item.menge;
                summe += itemSumme;
                
                html += `
                    <div class="warenkorb-item">
                        <div>
                            <strong>${item.menge}× ${item.name}</strong>
                        </div>
                    </div>
                `;
            });
            
            // Zeige Warenkorb und Gesamtsumme an
            warenkorbDiv.innerHTML = html;
            summeSpan.textContent = summe.toFixed(2);
        }

        /* ========================================
           BESTELLUNG ABSCHLIESSEN
           
           Wird aufgerufen wenn der "Jetzt bestellen"
           Button geklickt wird.
           
           ABLAUF:
           1. Prüfe ob Warenkorb leer ist
           2. Berechne Gesamtsumme
           3. Ziehe Summe vom Guthaben ab
           4. Aktualisiere Einkaufsliste (für Küche)
           5. Speichere Bestellung in Benutzer-Tagesübersicht
           6. Zeige Erfolgsmeldung
           7. Leere Warenkorb und aktualisiere Anzeige
           ======================================== */
        
        function bestellungAbschliessen() {
            // SCHRITT 1: Prüfe ob überhaupt etwas bestellt wurde
            if (warenkorb.length === 0) {
                meldungAnzeigen('Warenkorb ist leer!', 'fehler');
                return;
            }

            // SCHRITT 2: Prüfe ob Abendessen im Warenkorb ist
            const hatAbendessen = warenkorb.some(item => 
                item.typ === 'abendessen_normal' || item.typ === 'abendessen_vegetarisch'
            );
            
            // Wenn Abendessen bestellt wurde, füge Person zur Abendessen-Liste hinzu
            if (hatAbendessen) {
                // Prüfe ob Person schon in der Liste ist
                const schonInListe = abendessenBestellungen.some(eintrag => 
                    eintrag.name === aktuellerBenutzer.name && eintrag.kategorie === aktuelleKategorie
                );
                
                if (!schonInListe) {
                    // Finde Index des Benutzers in seiner Kategorie
                    const benutzerIndex = benutzer[aktuelleKategorie].indexOf(aktuellerBenutzer);
                    
                    // Prüfe ob vegetarisch bestellt wurde
                    const istVegetarisch = warenkorb.some(item => item.typ === 'abendessen_vegetarisch');
                    
                    abendessenBestellungen.push({
                        name: aktuellerBenutzer.name,
                        kategorie: aktuelleKategorie,
                        benutzerIndex: benutzerIndex,
                        vegetarisch: istVegetarisch
                    });
                }
            }

            // SCHRITT 3: Berechne Gesamtsumme OHNE Abendessen (Abendessen = 0€)
            let summe = 0;
            warenkorb.forEach(item => {
                // Abendessen kostet NICHTS beim Bestellen
                if (item.typ !== 'abendessen_normal' && item.typ !== 'abendessen_vegetarisch') {
                    summe += item.preis * item.menge;
                }
            });

            // SCHRITT 4: Ziehe Summe vom Guthaben ab
            // (Guthaben kann negativ werden = Schulden)
            aktuellerBenutzer.guthaben -= summe;

            // SCHRITT 5: Aktualisiere Einkaufsliste
            // Nur Produkte mit passendem "typ" werden gezählt
            // "sonstiges" wird NICHT gezählt
            // ABENDESSEN wird NICHT gezählt (wird separat abgerechnet)
            warenkorb.forEach(item => {
                if (einkaufsliste.hasOwnProperty(item.typ)) {
                    // Überspringe Abendessen - wird separat abgerechnet
                    if (item.typ !== 'abendessen_normal' && item.typ !== 'abendessen_vegetarisch') {
                        einkaufsliste[item.typ] += item.menge;
                    }
                }
            });

            // SCHRITT 6: Speichere Bestellung in Benutzer-Tagesübersicht
            // Damit der Benutzer sehen kann was er heute bestellt hat
            if (!aktuellerBenutzer.tagesbestellungen) {
                aktuellerBenutzer.tagesbestellungen = [];
            }
            
            aktuellerBenutzer.tagesbestellungen.push({
                produkte: warenkorb.map(item => ({
                    name: item.name,
                    menge: item.menge
                })),
                uhrzeit: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
            });

            // SCHRITT 7: Speichere alle Änderungen im Browser
            datenSpeichern();

            // SCHRITT 8: Zeige Erfolgsmeldung
            let meldungText = `Bestellung erfolgreich! Summe: ${summe.toFixed(2)} €<br>Neues Guthaben: ${aktuellerBenutzer.guthaben.toFixed(2)} €`;
            if (hatAbendessen) {
                meldungText += '<br>🍽️ <strong>Abendessen vorgemerkt!</strong> Wird später abgerechnet.';
            }
            meldungAnzeigen(meldungText, 'erfolg');

            // SCHRITT 9: Leere Warenkorb und aktualisiere Anzeigen
            warenkorb = [];
            warenkorbAktualisieren();
            
            // Aktualisiere Guthaben-Anzeige oben
            document.getElementById('guthaben-anzeige').textContent = aktuellerBenutzer.guthaben.toFixed(2) + ' €';
            
            // Aktualisiere Tagesübersicht (damit neue Bestellung sichtbar wird)
            benutzerTagesuebersichtAnzeigen();
        }

        /* ========================================
           KOCH-BEREICH
           
           Zeigt Schulden und Einkaufsliste an.
           KEIN PASSWORT ERFORDERLICH!
           ======================================== */
        
        function kochBereichOeffnen() {
            // Prüfe Login
            if (!aktuelleAbteilungId) {
                meldungAnzeigen('⚠️ Bitte melden Sie sich zuerst an!', 'fehler');
                return;
            }

            alleBereicheVerstecken();
            document.getElementById('koch-bereich').classList.remove('hidden');
            
            schuldenBerechnen();
            einkaufslisteAnzeigen();
            abendessenListeAnzeigen();
        }

        function schuldenBerechnen() {
            let gesamt = 0;

            // Summiere alle negativen Guthaben
            for (const [kategorie, personen] of Object.entries(benutzer)) {
                personen.forEach(person => {
                    if (!person.istPlatzhalter && person.guthaben < 0) {
                        gesamt += Math.abs(person.guthaben);
                    }
                });
            }

            document.getElementById('schulden-betrag').textContent = gesamt.toFixed(2) + ' €';
        }

        function einkaufslisteAnzeigen() {
            const anzeige = document.getElementById('einkaufsliste-anzeige');
            
            // Namen für Anzeige
            const namen = {
                'brötchen_normal': 'Brötchen (Normal)',
                'brötchen_mehrkorn': 'Brötchen (Mehrkorn)',
                'brötchen_sunny': 'Brötchen (Sunny)',
                'brötchen_roggen': 'Brötchen (Roggen)',
                'ei': 'Eier',
                'abendessen_normal': 'Abendessen (Normal)',
                'abendessen_vegetarisch': 'Abendessen (Vegetarisch)'
            };

            let html = '';
            let gesamt = 0;

            // Erstelle Zeile für jedes Produkt
            for (const [key, menge] of Object.entries(einkaufsliste)) {
                if (menge > 0) {
                    html += `
                        <div class="einkaufsitem">
                            <span class="einkaufsitem-name">${namen[key]}</span>
                            <span class="einkaufsitem-menge">${menge} Stück</span>
                        </div>
                    `;
                    gesamt += menge;
                }
            }

            // Wenn nichts bestellt wurde
            if (gesamt === 0) {
                html = '<p style="text-align: center; color: #95a5a6;">Noch keine Bestellungen</p>';
            }

            anzeige.innerHTML = html;
        }

        /* ========================================
           ABENDESSEN-ABRECHNUNG
           
           Zeigt alle Personen die Abendessen bestellt haben.
           Ermöglicht die Abrechnung am Abend mit dem
           tatsächlichen Preis.
           ======================================== */

        function abendessenListeAnzeigen() {
            const anzeige = document.getElementById('abendessen-liste');
            
            if (!anzeige) return; // Falls Element nicht existiert
            
            // Wenn niemand Abendessen bestellt hat
            if (abendessenBestellungen.length === 0) {
                anzeige.innerHTML = '<p style="text-align: center; color: #95a5a6;">Noch keine Abendessen-Bestellungen</p>';
                return;
            }
            
            let html = '<div style="margin-bottom: 15px;">';
            
            // Zähle Normal und Vegetarisch
            let anzahlNormal = 0;
            let anzahlVegetarisch = 0;
            
            // Erstelle Liste aller Personen
            abendessenBestellungen.forEach(eintrag => {
                if (eintrag.vegetarisch) {
                    anzahlVegetarisch++;
                } else {
                    anzahlNormal++;
                }
                
                const icon = eintrag.vegetarisch ? '🥗' : '🍽️';
                const typ = eintrag.vegetarisch ? '(Vegetarisch)' : '(Normal)';
                
                html += `
                    <div class="einkaufsitem">
                        <span class="einkaufsitem-name">${icon} ${eintrag.name}</span>
                        <span class="einkaufsitem-menge">${typ}</span>
                    </div>
                `;
            });
            
            html += '</div>';
            
            // Zusammenfassung
            html += `
                <div style="background: #ecf0f1; padding: 10px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                    <strong>Gesamt: ${abendessenBestellungen.length} Personen</strong><br>
                    <span style="font-size: 14px; color: #7f8c8d;">
                        ${anzahlNormal} × Normal | ${anzahlVegetarisch} × Vegetarisch
                    </span>
                </div>
            `;
            
            // Eingabefeld für Preis
            html += `
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 2px solid #ffc107;">
                    <label style="display: block; font-weight: bold; margin-bottom: 8px;">
                        💶 Preis pro Person eingeben:
                    </label>
                    <input 
                        type="number" 
                        id="abendessen-preis-input" 
                        placeholder="z.B. 6.50" 
                        step="0.01"
                        style="width: 100%; padding: 10px; font-size: 16px; border: 2px solid #ffc107; border-radius: 5px; margin-bottom: 10px;"
                    >
                    <button 
                        onclick="abendessenAbrechnen()" 
                        class="primary"
                        style="width: 100%; padding: 15px; font-size: 18px;">
                        ✅ Jetzt alle Personen abbuchen
                    </button>
                </div>
            `;
            
            anzeige.innerHTML = html;
        }

        function abendessenAbrechnen() {
            // Hole Preis aus Eingabefeld
            const preisInput = document.getElementById('abendessen-preis-input');
            const preis = parseFloat(preisInput.value);
            
            // Validierung
            if (!preis || isNaN(preis) || preis <= 0) {
                meldungAnzeigen('Bitte einen gültigen Preis eingeben!', 'fehler');
                return;
            }
            
            // Sicherheitsabfrage
            if (!confirm(`Wirklich ${preis.toFixed(2)} € von ${abendessenBestellungen.length} Personen abbuchen?\n\nGesamtsumme: ${(preis * abendessenBestellungen.length).toFixed(2)} €`)) {
                return;
            }
            
            // Buche allen Personen den Betrag ab
            let erfolg = 0;
            abendessenBestellungen.forEach(eintrag => {
                try {
                    const person = benutzer[eintrag.kategorie][eintrag.benutzerIndex];
                    if (person) {
                        person.guthaben -= preis;
                        erfolg++;
                    }
                } catch (error) {
                    console.error('Fehler bei Abbuchung:', error, eintrag);
                }
            });
            
            // Leere Abendessen-Liste
            abendessenBestellungen = [];
            
            // Speichere Änderungen
            datenSpeichern();
            
            // Aktualisiere Anzeigen
            abendessenListeAnzeigen();
            schuldenBerechnen();
            
            // Erfolg-Meldung
            meldungAnzeigen(
                `✅ Abendessen abgerechnet!<br>` +
                `${erfolg} Personen × ${preis.toFixed(2)} € = ${(erfolg * preis).toFixed(2)} € abgebucht`,
                'erfolg'
            );
            
            // Leere Eingabefeld
            if (preisInput) {
                preisInput.value = '';
            }
        }

        /* ========================================
           TAGESABSCHLUSS
           
           Setzt Einkaufsliste auf 0.
           
           ======================================== */
        
        function tagesabschluss() {
            if (!confirm('Wirklich Tagesabschluss durchführen?\n\n- Einkaufsliste wird auf 0 gesetzt\n- Alle Tagesübersichten werden geleert\n- Backup wird heruntergeladen\n- Bestätigen mit LADEN')) {
                return;
            }

           // Erstelle Backup-Objekt mit ALLEN Daten dieser Abteilung
            const backup = {
                abteilungId: aktuelleAbteilungId,
                abteilungName: aktuelleAbteilung.name,
                abteilungKurzname: aktuelleAbteilung.kurzname,
                datum: new Date().toLocaleString('de-DE'),
                version: "3.0",  // Version 3.0 = Multi-Tenant System
                benutzer: benutzer,
                produktKategorien: produktKategorien,
                einkaufsliste: einkaufsliste,
                abendessenBestellungen: abendessenBestellungen
            };

            // Wandle in JSON-Text um
            const jsonString = JSON.stringify(backup, null, 2);
            
            // Erstelle Download-Datei mit Abteilungs-ID
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const dateiname = `kantine-backup-${aktuelleAbteilung.kurzname}-${new Date().toISOString().split('T')[0]}.json`;
            
            // Download starten
            const a = document.createElement('a');
            a.href = url;
            a.download = dateiname;
            a.style.display = 'none';
            document.body.appendChild(a);
            
            try {
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                meldungAnzeigen('✅ Backup erfolgreich erstellt! Datei wurde heruntergeladen.', 'erfolg');
            } catch (error) {
                console.error('Backup-Fehler:', error);
                meldungAnzeigen('❌ Backup-Download fehlgeschlagen. Siehe Browser-Konsole.', 'fehler');
            }

            // Setze Einkaufsliste zurück
            einkaufsliste = {
                brötchen_normal: 0,
                brötchen_mehrkorn: 0,
                brötchen_sunny: 0,
                brötchen_roggen: 0,
                ei: 0,
                abendessen_normal: 0,
                abendessen_vegetarisch: 0
            };

            // Lösche alle Benutzer-Tagesbestellungen
            for (const kategorie in benutzer) {
                benutzer[kategorie].forEach(person => {
                    if (!person.istPlatzhalter) {
                        person.tagesbestellungen = [];
                    }
                });
            }

            // Lösche Abendessen-Bestellungen
            abendessenBestellungen = [];

            datenSpeichern();
            einkaufslisteAnzeigen();
            abendessenListeAnzeigen();

            meldungAnzeigen('Tagesabschluss durchgeführt! Einkaufsliste, Tagesübersichten und Abendessen-Liste auf 0 gesetzt.', 'erfolg');
        }

        /* ========================================
           GUTHABEN-VERWALTUNG
           
           MIT PASSWORT GESCHÜTZT!
           Hier können Guthaben aufgeladen werden.
           ======================================== */
        
        function guthabenVerwaltungLoginOeffnen() {
            // Prüfe Login
            if (!aktuelleAbteilungId) {
                meldungAnzeigen('⚠️ Bitte melden Sie sich zuerst an!', 'fehler');
                return;
            }

            alleBereicheVerstecken();
            document.getElementById('guthaben-login').classList.remove('hidden');
        }

        function guthabenVerwaltungLogin() {
            const passwort = document.getElementById('admin-passwort').value;
            
            // Prüfe Passwort
            if (passwort === ADMIN_PASSWORT) {
                alleBereicheVerstecken();
                document.getElementById('guthaben-kategorie').classList.remove('hidden');
                
                meldungAnzeigen('Erfolgreich angemeldet', 'erfolg');
            } else {
                meldungAnzeigen('Falsches Passwort!', 'fehler');
            }
            
            document.getElementById('admin-passwort').value = '';
        }

        function guthabenVerwaltungAbmelden() {
            zurückZurStartseite();
        }

        function guthabenKategorieAuswaehlen(kategorie) {
            guthabenVerwaltungKategorie = kategorie;
            alleBereicheVerstecken();
            document.getElementById('guthaben-personen').classList.remove('hidden');
            
            const titel = {
                'wachabteilung': 'Wachabteilung - Guthaben verwalten',
                'bdienst': 'B-Dienst - Guthaben verwalten',
                'notarzt': 'Notarzt - Guthaben verwalten',
                'azubi': 'Auszubildende - Guthaben verwalten',
                'gaeste': 'Gäste - Guthaben verwalten'
            };
            document.getElementById('guthaben-kategorie-titel').textContent = titel[kategorie];
            
            guthabenPersonenAnzeigen();
        }

        function zurückZuGuthabenKategorie() {
            alleBereicheVerstecken();
            document.getElementById('guthaben-kategorie').classList.remove('hidden');
        }

        function guthabenPersonenAnzeigen() {
            const liste = document.getElementById('guthaben-personen-liste');
            liste.innerHTML = '';

            // Sortiere nach Namen
            const sortiertePersonen = nachNamenSortieren(benutzer[guthabenVerwaltungKategorie]);

            sortiertePersonen.forEach((person) => {
                // Finde Original-Index
                const index = benutzer[guthabenVerwaltungKategorie].indexOf(person);
                
                if (person.istPlatzhalter) {
                    // Leerer Platzhalter
                    const karte = document.createElement('div');
                    karte.className = 'guthaben-verwaltung-karte';
                    karte.style.opacity = '0.5';
                    karte.innerHTML = `
                        <h3>Leerer Gast-Platz</h3>
                        <p style="color: #95a5a6; font-size: 14px;">Kein Gast hinterlegt</p>
                    `;
                    liste.appendChild(karte);
                } else {
                    // Person mit Guthaben-Verwaltung
                    const karte = document.createElement('div');
                    karte.className = 'guthaben-verwaltung-karte';
                    
                    const guthabenKlasse = person.guthaben >= 0 ? 'guthaben-positiv' : 'guthaben-negativ';
                    
                    let html = `
                        <h3>${person.name}</h3>
                        <div style="font-size: 20px; margin: 10px 0;" class="${guthabenKlasse}">
                            Aktuell: ${person.guthaben.toFixed(2)} €
                        </div>
                        <div class="guthaben-eingabe">
                            <input type="number" id="betrag-${index}" placeholder="Betrag (z.B. 20.00)" step="0.01">
                            <button class="success" onclick="guthabenErhoehen('${guthabenVerwaltungKategorie}', ${index})">
                                Aufladen
                            </button>
                        </div>
                    `;
                    
                    // Bei Kategorien mit Platzhaltern: Löschen-Button anzeigen
                    const platzhalterKategorien = ['gaeste', 'notarzt', 'azubi', 'bdienst'];
                    if (platzhalterKategorien.includes(guthabenVerwaltungKategorie)) {
                        html += `
                            <button class="danger" onclick="platzhalterLoeschen(${index})" style="width: 100%; margin-top: 10px; padding: 10px; font-size: 14px;">
                                Person löschen
                            </button>
                        `;
                    }
                    
                    karte.innerHTML = html;
                    liste.appendChild(karte);
                }
            });
        }

        function guthabenErhoehen(kategorie, index) {
            const betragInput = document.getElementById('betrag-' + index);
            const betrag = parseFloat(betragInput.value);

            if (isNaN(betrag) || betrag <= 0) {
                meldungAnzeigen('Bitte einen gültigen positiven Betrag eingeben!', 'fehler');
                return;
            }

            // Erhöhe Guthaben
            benutzer[kategorie][index].guthaben += betrag;
            datenSpeichern();
            
            betragInput.value = '';
            guthabenPersonenAnzeigen();
            
            meldungAnzeigen(`${betrag.toFixed(2)} € wurden aufgeladen!`, 'erfolg');
        }

        // Löscht eine Person in einer Platzhalter-Kategorie (Gäste/Notarzt/Azubi)
        // Nutzt guthabenVerwaltungKategorie um zu wissen wo gelöscht wird
        function platzhalterLoeschen(index) {
            const person = benutzer[guthabenVerwaltungKategorie][index];
            
            if (confirm(`Wirklich "${person.name}" löschen?\n\nWird zu leerem Platzhalter.`)) {
                benutzer[guthabenVerwaltungKategorie][index] = {
                    name: "",
                    guthaben: 0.00,
                    istPlatzhalter: true
                };
                
                datenSpeichern();
                guthabenPersonenAnzeigen();
                
                meldungAnzeigen('Person wurde gelöscht!', 'erfolg');
            }
        }

        /* ========================================
           PREISVERWALTUNG
           
           Zeigt alle Produkte nach Kategorien
           und ermöglicht Preis-Änderungen.
           ======================================== */
        
        function preisverwaltungOeffnen() {
            // Öffne Preisverwaltungs-Seite
            alleBereicheVerstecken();
            document.getElementById('preisverwaltung').classList.remove('hidden');
            
            // Zeige alle Preise an
            preiseAnzeigen();
        }
        
        function preiseAnzeigen() {
            const liste = document.getElementById('preisverwaltung-liste');
            liste.innerHTML = '';

            // Gehe durch alle Produkt-Kategorien
            produktKategorien.forEach(kategorie => {
                // Erstelle Kategorie-Container
                const katDiv = document.createElement('div');
                katDiv.className = 'preis-kategorie';
                
                // Überschrift
                const h3 = document.createElement('h3');
                h3.textContent = kategorie.name;
                katDiv.appendChild(h3);
                
                // Produkt-Grid
                const grid = document.createElement('div');
                grid.className = 'preis-grid';
                
                // Erstelle Karte für jedes Produkt
                kategorie.produkte.forEach(produkt => {
                    const item = document.createElement('div');
                    item.className = 'preis-item';
                    
                    item.innerHTML = `
                        <div class="preis-item-name">${produkt.name}</div>
                        <div class="preis-item-aktuell">
                            Aktuell: <strong>${produkt.preis.toFixed(2)} €</strong>
                        </div>
                        <div class="preis-eingabe">
                            <input 
                                type="number" 
                                id="preis-${produkt.id}" 
                                placeholder="Neuer Preis" 
                                step="0.01"
                                value="${produkt.preis.toFixed(2)}"
                            >
                            <button onclick="preisAendern(${produkt.id})">
                                ✓
                            </button>
                        </div>
                    `;
                    
                    grid.appendChild(item);
                });
                
                katDiv.appendChild(grid);
                liste.appendChild(katDiv);
            });
        }

        function preisAendern(produktId) {
            // Hole neuen Preis aus Eingabefeld
            const neuerPreis = parseFloat(document.getElementById('preis-' + produktId).value);
            
            // Validierung
            if (isNaN(neuerPreis) || neuerPreis < 0) {
                meldungAnzeigen('Bitte einen gültigen Preis eingeben!', 'fehler');
                return;
            }

            // Finde Produkt in allen Kategorien
            let gefunden = false;
            produktKategorien.forEach(kategorie => {
                const produkt = kategorie.produkte.find(p => p.id === produktId);
                if (produkt) {
                    const alterPreis = produkt.preis;
                    produkt.preis = neuerPreis;
                    gefunden = true;
                    
                    // Erfolg-Meldung
                    meldungAnzeigen(
                        `Preis für "${produkt.name}" wurde von ${alterPreis.toFixed(2)} € auf ${neuerPreis.toFixed(2)} € geändert!`,
                        'erfolg'
                    );
                }
            });

            if (gefunden) {
                // Aktualisiere flache Produktliste
                alleProdukteFlach = [];
                produktKategorien.forEach(kategorie => {
                    alleProdukteFlach = alleProdukteFlach.concat(kategorie.produkte);
                });
                
                // Speichere Änderungen
                datenSpeichern();
                
                // Aktualisiere Anzeige
                preiseAnzeigen();
            }
        }

        /* ========================================
           WACHABTEILUNG BEARBEITEN
           
           Ermöglicht das Hinzufügen und Löschen
           von Personen in der Wachabteilung.
           ======================================== */

        function wachabteilungBearbeitenOeffnen() {
            alleBereicheVerstecken();
            document.getElementById('wachabteilung-bearbeiten').classList.remove('hidden');
            wachabteilungPersonenAnzeigen();
        }

        function wachabteilungPersonenAnzeigen() {
            const liste = document.getElementById('wachabteilung-personen-liste');
            liste.innerHTML = '';

            // Sortiere nach Namen
            const sortiertePersonen = nachNamenSortieren(benutzer.wachabteilung);

            sortiertePersonen.forEach((person) => {
                // Finde Original-Index
                const index = benutzer.wachabteilung.indexOf(person);
                
                const karte = document.createElement('div');
                karte.className = 'guthaben-verwaltung-karte';
                
                const guthabenKlasse = person.guthaben >= 0 ? 'guthaben-positiv' : 'guthaben-negativ';
                
                karte.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3>${person.name}</h3>
                            <div style="font-size: 16px; margin-top: 5px;" class="${guthabenKlasse}">
                                Guthaben: ${person.guthaben.toFixed(2)} €
                            </div>
                        </div>
                        <button class="danger" onclick="wachabteilungPersonLoeschen(${index})" style="padding: 10px 20px;">
                            🗑️ Löschen
                        </button>
                    </div>
                `;
                
                liste.appendChild(karte);
            });
        }

        function wachabteilungPersonHinzufugen() {
            const name = document.getElementById('wachabteilung-name-input').value.trim();
            
            if (!name) {
                meldungAnzeigen('Bitte einen Namen eingeben!', 'fehler');
                return;
            }

            // Prüfe ob Name bereits existiert
            const existiert = benutzer.wachabteilung.some(p => p.name.toLowerCase() === name.toLowerCase());
            if (existiert) {
                meldungAnzeigen('Diese Person existiert bereits in der Wachabteilung!', 'fehler');
                return;
            }

            // Finde die höchste ID
            let maxId = 0;
            benutzer.wachabteilung.forEach(p => {
                if (p.id) {
                    const num = parseInt(p.id.replace('w', ''));
                    if (num > maxId) maxId = num;
                }
            });

            // Erstelle neue Person mit nächster ID
            const neueId = 'w' + (maxId + 1);
            benutzer.wachabteilung.push({
                id: neueId,
                name: name,
                guthaben: 0.00
            });

            datenSpeichern();
            document.getElementById('wachabteilung-name-input').value = '';
            wachabteilungPersonenAnzeigen();
            
            meldungAnzeigen(`${name} wurde zur Wachabteilung hinzugefügt!`, 'erfolg');
        }

        function wachabteilungPersonLoeschen(index) {
            const person = benutzer.wachabteilung[index];
            
            if (!confirm(`Wirklich "${person.name}" aus der Wachabteilung löschen?\n\nAlle Daten (inkl. Guthaben von ${person.guthaben.toFixed(2)} €) gehen verloren!`)) {
                return;
            }

            // Lösche Person aus Array
            benutzer.wachabteilung.splice(index, 1);
            
            datenSpeichern();
            wachabteilungPersonenAnzeigen();
            
            meldungAnzeigen(`${person.name} wurde aus der Wachabteilung gelöscht!`, 'erfolg');
        }

        /* ========================================
           BENUTZER-TAGESÜBERSICHT
           
           Zeigt die heutigen Bestellungen des 
           aktuell angemeldeten Benutzers an.
           
           Diese Liste erscheint am Ende der 
           Bestellseite als ausklappbares Accordeon.
           
           Wird bei Tagesabschluss (Küchenbereich) 
           für ALLE Benutzer geleert.
           ======================================== */

        function benutzerTagesuebersichtToggle() {
            // Klappe Accordeon auf/zu
            const accordeon = document.getElementById('benutzer-tagesuebersicht-accordeon');
            const inhalt = document.getElementById('benutzer-tagesuebersicht-inhalt');
            accordeon.classList.toggle('offen');
            inhalt.classList.toggle('hidden');
        }

        function benutzerTagesuebersichtAnzeigen() {
            const liste = document.getElementById('benutzer-tagesuebersicht-liste');
            const badge = document.getElementById('benutzer-tagesuebersicht-badge');
            
            // Prüfe ob Benutzer angemeldet ist
            if (!aktuellerBenutzer || !aktuellerBenutzer.tagesbestellungen) {
                return;
            }

            // Anzahl der Bestellungen anzeigen
            const anzahl = aktuellerBenutzer.tagesbestellungen.length;
            badge.textContent = anzahl + ' Bestellung' + (anzahl !== 1 ? 'en' : '');

            // Wenn noch keine Bestellungen
            if (anzahl === 0) {
                liste.innerHTML = '<div class="tagesuebersicht-leer">Noch keine Bestellungen heute</div>';
                return;
            }

            let html = '';

            // Zeige jede Bestellung (nur Produkte, kein Zeitstempel)
            aktuellerBenutzer.tagesbestellungen.forEach(bestellung => {
                const produkteText = bestellung.produkte.map(p =>
                    p.menge > 1 ? `${p.menge}× ${p.name}` : p.name
                ).join(', ');

                html += `
                    <div class="tages-bestellung">
                        <div class="tages-bestellung-produkte">${produkteText}</div>
                    </div>
                `;
            });

            liste.innerHTML = html;
        }

        /* ========================================
           MELDUNGEN ANZEIGEN
           
           Zeigt Erfolgs- oder Fehler-Meldungen
           für 5 Sekunden an.
           ======================================== */
        
        function meldungAnzeigen(text, typ) {
            const meldungDiv = document.getElementById('meldung');
            meldungDiv.className = 'meldung ' + typ;
            meldungDiv.innerHTML = text;
            meldungDiv.style.display = 'block';
            
            // Verstecke nach 5 Sekunden
            setTimeout(() => {
                meldungDiv.style.display = 'none';
            }, 5000);
        }

        /* ========================================
           BACKUP & RESTORE
           
           Ermöglicht das Sichern und Wiederherstellen
           ALLER Daten (Benutzer, Guthaben, Preise, etc.)
           
           VERWENDUNG:
           - Backup erstellen: Im Verwaltungsbereich
           - Backup wiederherstellen: Im Verwaltungsbereich
           - Bei App-Update: Backup → Update → Restore
           ======================================== */

        function backupErstellen() {
            // Erstelle Backup-Objekt mit ALLEN Daten dieser Abteilung
            const backup = {
                abteilungId: aktuelleAbteilungId,
                abteilungName: aktuelleAbteilung.name,
                abteilungKurzname: aktuelleAbteilung.kurzname,
                datum: new Date().toLocaleString('de-DE'),
                version: "3.0",  // Version 3.0 = Multi-Tenant System
                benutzer: benutzer,
                produktKategorien: produktKategorien,
                einkaufsliste: einkaufsliste,
                abendessenBestellungen: abendessenBestellungen
            };

            // Wandle in JSON-Text um
            const jsonString = JSON.stringify(backup, null, 2);
            
            // Erstelle Download-Datei mit Abteilungs-ID im Namen
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const dateiname = `kantine-backup-${aktuelleAbteilung.kurzname}-${new Date().toISOString().split('T')[0]}.json`;
            
            // Download starten
            const a = document.createElement('a');
            a.href = url;
            a.download = dateiname;
            a.style.display = 'none';
            document.body.appendChild(a);
            
            try {
                a.click();
                
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
                
                meldungAnzeigen(
                    `✅ Backup für ${aktuelleAbteilung.name} erfolgreich erstellt!<br>` +
                    `Datei: ${dateiname}`,
                    'erfolg'
                );
            } catch (error) {
                console.error('Backup-Fehler:', error);
                meldungAnzeigen('❌ Backup-Download fehlgeschlagen. Siehe Browser-Konsole.', 'fehler');
            }
        }

        function backupWiederherstellen() {
            // Bestätigung einholen
            if (!confirm(`⚠️ ACHTUNG!\n\nDas Wiederherstellen überschreibt ALLE aktuellen Daten von:\n${aktuelleAbteilung.name}\n\n- Alle Benutzer und Guthaben\n- Alle Produktpreise\n- Die Einkaufsliste\n\nMöchtest du wirklich fortfahren?`)) {
                return;
            }

            // Erstelle verstecktes Datei-Input Element
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                // Lese Datei
                const reader = new FileReader();
                reader.onload = function(event) {
                    try {
                        // Parse JSON
                        const backup = JSON.parse(event.target.result);
                        
                        // Validierung
                        if (!backup.benutzer || !backup.produktKategorien) {
                            throw new Error('Ungültiges Backup-Format');
                        }
                        
                        // WICHTIG: Prüfe ob Backup zur angemeldeten Abteilung passt
                        if (backup.abteilungId && backup.abteilungId !== aktuelleAbteilungId) {
                            const backupAbteilungName = backup.abteilungName || backup.abteilungId;
                            const warnung = confirm(
                                `⚠️ WARNUNG!\n\n` +
                                `Sie sind angemeldet als:\n${aktuelleAbteilung.name} (${aktuelleAbteilungId})\n\n` +
                                `Das Backup gehört zu:\n${backupAbteilungName} (${backup.abteilungId})\n\n` +
                                `Dies wird die Daten von ${aktuelleAbteilung.name} mit den Daten von ${backupAbteilungName} überschreiben!\n\n` +
                                `Wirklich fortfahren?`
                            );
                            
                            if (!warnung) {
                                meldungAnzeigen('❌ Wiederherstellung abgebrochen.', 'fehler');
                                return;
                            }
                        }
                        
                        // Stelle Daten wieder her
                        benutzer = backup.benutzer;
                        produktKategorien = backup.produktKategorien;
                        if (backup.einkaufsliste) {
                            einkaufsliste = backup.einkaufsliste;
                        }
                        if (backup.abendessenBestellungen) {
                            abendessenBestellungen = backup.abendessenBestellungen;
                        }
                        
                        // Aktualisiere flache Produktliste
                        alleProdukteFlach = [];
                        produktKategorien.forEach(kategorie => {
                            alleProdukteFlach = alleProdukteFlach.concat(kategorie.produkte);
                        });
                        
                        // Speichere alles
                        datenSpeichern();
                        
                        // Erfolg!
                        meldungAnzeigen(
                            `✅ Backup erfolgreich wiederhergestellt!<br>` +
                            `📅 Backup-Datum: ${backup.datum || 'Unbekannt'}<br>` +
                            `Abteilung: ${aktuelleAbteilung.name}<br>` +
                            `Seite wird neu geladen...`,
                            'erfolg'
                        );
                        
                        // Seite neu laden nach 2 Sekunden
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                        
                    } catch (error) {
                        console.error('Restore-Fehler:', error);
                        meldungAnzeigen(
                            '❌ Fehler beim Wiederherstellen!<br>' +
                            'Stelle sicher, dass die Datei ein gültiges Backup ist.',
                            'fehler'
                        );
                    }
                };
                
                reader.onerror = function() {
                    meldungAnzeigen('❌ Fehler beim Lesen der Datei!', 'fehler');
                };
                
                reader.readAsText(file);
            };
            
            // Öffne Dateiauswahl
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        }

        /* ========================================
           APP START
           
           Wird aufgerufen wenn die Seite geladen
           wird. Prüft Login und lädt Daten.
           ======================================== */
        
        window.onload = function() {
            console.log('🍽️ Kantinen-App gestartet!');
            console.log('📝 Multi-Tenant Version 3.0');
            
            // Prüfe ob bereits eingeloggt
            const eingeloggt = pruefeLogin();
            
            if (!eingeloggt) {
                console.log('ℹ️ Nicht eingeloggt - zeige Login-Screen');
            } else {
                console.log(`✅ Eingeloggt als: ${aktuelleAbteilung.name}`);
            }
        };

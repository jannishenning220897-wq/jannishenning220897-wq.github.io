        /* ========================================
           JAVASCRIPT - HIER BEGINNT DIE LOGIK
           ======================================== */

        // ===== KONFIGURATION =====
        const ADMIN_PASSWORT = "admin123"; // WICHTIG: Ändere das Passwort hier!

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
                    { id: 8, name: "Normal", preis: 6.00, typ: "abendessen_normal" },
                    { id: 9, name: "Vegetarisch", preis: 6.00, typ: "abendessen_vegetarisch" }
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
           - istPlatzhalter: true = Leerer Platz (nur bei Gästen/Notarzt/Azubi)
           
           KATEGORIEN:
           - wachabteilung: Feste Personen mit Namen
           - bdienst: Feste Personen mit Namen
           - notarzt: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           - azubi: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           - gaeste: 12 Platzhalter (Namen werden bei Bedarf eingegeben)
           
           NEUE PERSON HINZUFÜGEN (bei Wachabteilung/B-Dienst):
           1. Neue id vergeben (z.B. "w28", "b30")
           2. Name, guthaben: 0.00, tagesbestellungen: [] einfügen
           3. In die richtige Kategorie eintragen
           
           HINWEIS: Bei Notarzt/Azubi/Gäste werden Namen zur
           Laufzeit eingegeben - hier nichts ändern!
        */
        let benutzer = {
            wachabteilung: [
                { id: "w1", name: "Stüwe", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w2", name: "Wilhelmi", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w3", name: "Ridder", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w4", name: "Felker", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w5", name: "Propenauer", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w6", name: "Wunderlich", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w7", name: "Nahrup", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w8", name: "Henning", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w9", name: "Fries", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w10", name: "Nelle", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w11", name: "Lechelt", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w12", name: "Schiefer", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w13", name: "Lewandrowska", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w14", name: "Klauke", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w15", name: "Baake", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w16", name: "Grundkötter", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w17", name: "Petrich", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w18", name: "Augustin", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w19", name: "Bertram", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w20", name: "Bücker", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w21", name: "Bulla", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w22", name: "Ebbing", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w23", name: "Pankratz", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w24", name: "Stegemann", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w25", name: "Reckendrees", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w26", name: "Rohrbach", guthaben: 0.00, tagesbestellungen: [] },
                { id: "w27", name: "Thies", guthaben: 0.00, tagesbestellungen: [] }
                
            ],
            bdienst: [
                { id: "b1", name: "Henning", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b2", name: "Leitlof", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b3", name: "König", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b4", name: "Gräfe", guthaben: 0.000 },
                { id: "b5", name: "Hülsmann", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b6", name: "Hüsemann", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b7", name: "Schilp", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b8", name: "Vornholt", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b9", name: "Graf", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b10", name: "Pyka", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b11", name: "Neuhaus", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b12", name: "Hüttmann", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b13", name: "Güldner", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b14", name: "Dörk", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b15", name: "Hansmeyer", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b16", name: "Gehle", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b17", name: "Tente", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b18", name: "Kiunke", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b19", name: "Helmig", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b20", name: "Woydak", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b21", name: "Pieper", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b22", name: "Arens", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b23", name: "Juckel", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b24", name: "Haase", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b25", name: "Röhren", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b26", name: "Epp", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b27", name: "Zoller", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b28", name: "Bartsch", guthaben: 0.00, tagesbestellungen: [] },
                { id: "b29", name: "Eichstädt", guthaben: 0.00, tagesbestellungen: [] }
            ],

            notarzt: [
                // 12 leere Platzhalter für Gäste
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
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ],

            azubi: [
                // 12 leere Platzhalter für Gäste
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
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] },
                { name: "", guthaben: 0.00, istPlatzhalter: true, tagesbestellungen: [] }
            ],

            gaeste: [
                // 12 leere Platzhalter für Gäste
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

            // Speichere alles als JSON-Text im Browser
            localStorage.setItem('benutzer', JSON.stringify(benutzer));
            localStorage.setItem('produktKategorien', JSON.stringify(produktKategorien));
            localStorage.setItem('einkaufsliste', JSON.stringify(einkaufsliste));
            
            console.log('✅ Daten wurden gespeichert!');
        }

        function datenLaden() {
            // Lade gespeicherte Daten aus dem Browser
            const gespeicherteBenutzer = localStorage.getItem('benutzer');
            const gespeicherteKategorien = localStorage.getItem('produktKategorien');
            const gespeicherteEinkaufsliste = localStorage.getItem('einkaufsliste');

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
            
            console.log('✅ Daten wurden geladen!');
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
        
        function alleBereicheVerstecken() {
            // Verstecke ALLE Bereiche der App
            // Diese Funktion wird vor jedem Seitenwechsel aufgerufen
            // Danach wird der gewünschte Bereich wieder eingeblendet
            document.getElementById('startseite').classList.add('hidden');
            document.getElementById('benutzer-auswahl').classList.add('hidden');
            document.getElementById('bestell-bereich').classList.add('hidden');
            document.getElementById('koch-bereich').classList.add('hidden');
            document.getElementById('guthaben-login').classList.add('hidden');
            document.getElementById('guthaben-kategorie').classList.add('hidden');
            document.getElementById('guthaben-personen').classList.add('hidden');
            document.getElementById('preisverwaltung').classList.add('hidden');
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
            
            // Name-Eingabe nur bei Kategorien mit Platzhaltern anzeigen (Gäste, Notarzt, Azubi)
            const platzhalterKategorien = ['gaeste', 'notarzt', 'azubi'];
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

            // SCHRITT 2: Berechne Gesamtsumme aller Produkte
            const summe = warenkorb.reduce((total, item) => total + (item.preis * item.menge), 0);

            // SCHRITT 3: Ziehe Summe vom Guthaben ab
            // (Guthaben kann negativ werden = Schulden)
            aktuellerBenutzer.guthaben -= summe;

            // SCHRITT 4: Aktualisiere Einkaufsliste
            // Nur Produkte mit passendem "typ" werden gezählt
            // "sonstiges" wird NICHT gezählt
            warenkorb.forEach(item => {
                if (einkaufsliste.hasOwnProperty(item.typ)) {
                    einkaufsliste[item.typ] += item.menge;
                }
            });

            // SCHRITT 5: Speichere Bestellung in Benutzer-Tagesübersicht
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

            // SCHRITT 6: Speichere alle Änderungen im Browser
            datenSpeichern();

            // SCHRITT 7: Zeige Erfolgsmeldung
            meldungAnzeigen(
                `Bestellung erfolgreich! Summe: ${summe.toFixed(2)} €<br>Neues Guthaben: ${aktuellerBenutzer.guthaben.toFixed(2)} €`,
                'erfolg'
            );

            // SCHRITT 8: Leere Warenkorb und aktualisiere Anzeigen
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
            alleBereicheVerstecken();
            document.getElementById('koch-bereich').classList.remove('hidden');
            
            schuldenBerechnen();
            einkaufslisteAnzeigen();
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
           TAGESABSCHLUSS
           
           Setzt Einkaufsliste auf 0.
           
           ======================================== */
        
        function tagesabschluss() {
            if (!confirm('Wirklich Tagesabschluss durchführen?\n\n- Einkaufsliste wird auf 0 gesetzt\n- Alle Tagesübersichten werden geleert\n- Backup wird heruntergeladen\n- Bestätigen mit LADEN')) {
                return;
            }

            // Erstelle Backup-Objekt
            const backup = {
                datum: new Date().toLocaleString('de-DE'),
                benutzer: benutzer,
                einkaufsliste: {...einkaufsliste}
            };

            // Wandle in Text um
            const jsonString = JSON.stringify(backup, null, 2);
            
            // Erstelle Download für iOS/Edge kompatibel
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const dateiname = 'tagesabschluss-' + new Date().toISOString().split('T')[0] + '.json';
            
            // Versuche Download mit mehreren Methoden (für iOS/Edge)
            const a = document.createElement('a');
            a.href = url;
            a.download = dateiname;
            a.style.display = 'none';
            document.body.appendChild(a);
            
            // iOS Safari braucht einen Klick-Event
            try {
                a.click();
                
                // Aufräumen nach kurzer Verzögerung
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            } catch (error) {
                // Fallback: Zeige den JSON-Text zum Kopieren
                alert('Download fehlgeschlagen. Kopiere den folgenden Text und speichere ihn manuell:\n\n' + jsonString.substring(0, 200) + '...');
                console.log('Backup-Daten:', jsonString);
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

            datenSpeichern();
            einkaufslisteAnzeigen();

            meldungAnzeigen('Tagesabschluss durchgeführt! Einkaufsliste und alle Tagesübersichten auf 0 gesetzt.', 'erfolg');
        }

        /* ========================================
           GUTHABEN-VERWALTUNG
           
           MIT PASSWORT GESCHÜTZT!
           Hier können Guthaben aufgeladen werden.
           ======================================== */
        
        function guthabenVerwaltungLoginOeffnen() {
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
                    const platzhalterKategorien = ['gaeste', 'notarzt', 'azubi'];
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
           APP START
           
           Wird aufgerufen wenn die Seite geladen
           wird. Lädt gespeicherte Daten.
           ======================================== */
        
        window.onload = function() {
            datenLaden();
            console.log('🍽️ Kantinen-App gestartet!');
            console.log('📝 Tipp: Öffne die Browser-Konsole (F12) um Code-Hinweise zu sehen');
        };

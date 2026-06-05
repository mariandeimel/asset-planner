# Pflichtenheft – Portfolio Planner & Fair Value Screener

**Version:** 1.0  
**Stand:** 2025  
**Projekttyp:** Web-Applikation (Solo-Projekt / MVP-First)  
**Zielgruppe:** KI-gestützte Implementierung

---

## 1. Projektziel & Scope

### 1.1 Kurzbeschreibung

Eine moderne Web-Applikation zur Planung, Analyse und Bewertung von Investment-Portfolios. Nutzer können Portfolios mit Aktien, ETFs und Krypto-Assets zusammenstellen und erhalten automatisch berechnete Kennzahlen, Analysen und (später) Fair-Value-Bewertungen.

**Kein Echtzeit-Depot-Tracking.** Die App ist ein "Was wäre, wenn"-Planungswerkzeug, keine Anlageberatung.

### 1.2 Zwei Hauptbereiche

| Bereich | Beschreibung | Priorität |
|---|---|---|
| Portfolio Planner | Portfolio-Verwaltung, Holdings, Kennzahlen, Analysen | Phase 1–2 |
| Fair Value Screener | Unterbewertete Aktien identifizieren via Score | Phase 3–4 |

### 1.3 Phasenplan

| Phase | Inhalt | Ziel |
|---|---|---|
| 1 | Portfolio MVP (CRUD, Holdings, localStorage) | Erster nutzbarer Prototyp |
| 2 | Portfolio Analytics (Charts, Allocation, Dividenden) | Mehrwert für Nutzer |
| 3 | Fair Value Engine (Datenquellen, Scoring) | Fundament für Analyse |
| 4 | Fair Value Screener (Filter, Ranking, Watchlist) | Vollständiger Screener |
| 5 | Backend (Go API, DB, Caching, Cron Jobs) | Skalierbarkeit |
| 6 | Benutzerkonten (Auth, Sync, Cloud Storage) | Produktionsreife |

---

## 2. Technologie-Stack

### 2.1 Frontend

| Technologie | Version | Zweck |
|---|---|---|
| SvelteKit | latest | Framework (SSR + SPA) |
| TypeScript | 5.x | Typsicherheit |
| TailwindCSS | 3.x | Styling |
| shadcn-svelte | latest | UI-Komponenten |
| TanStack Query | 5.x | Server-State, Caching |
| ECharts | 5.x | Charts & Visualisierungen |

### 2.2 Datenspeicherung (Phase 1)

- **localStorage** für alle Portfolio-Daten
- Zugriff **ausschließlich** über ein `PortfolioRepository`-Interface (Abstraktionsschicht)
- Das Repository-Interface muss später ohne UI-Änderungen auf IndexedDB oder Backend-API umstellbar sein

```typescript
// Repository-Interface (zwingend einzuhalten)
interface PortfolioRepository {
  getAll(): Promise<Portfolio[]>;
  getById(id: string): Promise<Portfolio | null>;
  create(data: CreatePortfolioDto): Promise<Portfolio>;
  update(id: string, data: UpdatePortfolioDto): Promise<Portfolio>;
  delete(id: string): Promise<void>;
  addHolding(portfolioId: string, holding: CreateHoldingDto): Promise<Holding>;
  updateHolding(portfolioId: string, holdingId: string, data: UpdateHoldingDto): Promise<Holding>;
  removeHolding(portfolioId: string, holdingId: string): Promise<void>;
}
```

### 2.3 Backend (Phase 5, optional für frühe Phasen)

| Technologie | Zweck |
|---|---|
| Go | API-Server, Fair Value Engine |
| PostgreSQL | Persistente Datenspeicherung |
| Redis | Caching (Aktienkurse, Fair Values) |
| Cron Job | Tägliche Datenaktualisierung |

---

## 3. Datenmodell

### 3.1 Portfolio

```typescript
type Portfolio = {
  id: string;                  // UUID v4
  name: string;                // max. 100 Zeichen
  description?: string;        // max. 500 Zeichen, optional
  tags?: string[];             // z. B. ["Dividende", "ETF", "Value"]
  currency: string;            // ISO 4217, z. B. "EUR"
  createdAt: string;           // ISO 8601
  updatedAt: string;           // ISO 8601
  holdings: Holding[];
};
```

### 3.2 Holding

```typescript
type Holding = {
  id: string;                  // UUID v4
  symbol: string;              // Ticker-Symbol, z. B. "AAPL", "BTC"
  name: string;                // Anzeigename, z. B. "Apple Inc."
  assetType: "stock" | "etf" | "crypto";
  quantity: number;            // Stückzahl (Dezimalzahlen erlaubt)
  buyPrice: number;            // Kaufpreis pro Einheit
  currency: string;            // ISO 4217
  buyDate: string;             // ISO 8601 Datum
  exchange?: string;           // Börsenplatz, z. B. "XETRA", "NYSE"
  isin?: string;               // optional, für Aktien/ETFs
};
```

### 3.3 Berechnete Felder (nicht persistiert)

Diese Felder werden zur Laufzeit berechnet und nicht gespeichert:

```typescript
type HoldingWithMetrics = Holding & {
  currentPrice: number;        // Tagesaktuell aus Cache
  currentValue: number;        // quantity * currentPrice
  totalReturn: number;         // currentValue - (quantity * buyPrice)
  totalReturnPercent: number;
  dividendYield?: number;      // Nur bei Aktien/ETFs
  annualDividend?: number;     // Hochgerechnet
  weightInPortfolio: number;   // Prozentualer Anteil
};

type PortfolioMetrics = {
  totalValue: number;
  totalCost: number;
  totalReturn: number;
  totalReturnPercent: number;
  ytdReturn?: number;
  weightedDividendYield: number;
  annualDividendIncome: number;
  monthlyDividendIncome: number;
  assetAllocation: AllocationBreakdown;
};

type AllocationBreakdown = {
  byAssetType: Record<string, number>;    // stock/etf/crypto → %
  bySector: Record<string, number>;       // Technologie, Energie, etc. → %
  byRegion: Record<string, number>;       // US, Europa, Asien, etc. → %
  byCurrency: Record<string, number>;     // EUR, USD, etc. → %
};
```

### 3.4 Fair Value (Phase 3–4)

```typescript
type FairValueScore = {
  symbol: string;
  currentPrice: number;
  fairValue: number;
  discount: number;            // (fairValue - currentPrice) / fairValue * 100
  score: number;               // 0–100
  components: {
    dcf: number;               // 40 % Gewichtung
    graham: number;            // 20 % Gewichtung
    peComparison: number;      // 20 % Gewichtung
    fcfMultiple: number;       // 20 % Gewichtung
  };
  lastUpdated: string;         // ISO 8601
  rating: "undervalued" | "fair" | "overvalued";
};
```

---

## 4. UI-Struktur & Seiten

### 4.1 Navigation

```
/ (Root)
├── /dashboard               # Startseite mit Gesamtübersicht
├── /portfolios              # Portfolio-Liste
│   ├── /portfolios/new      # Neues Portfolio erstellen
│   └── /portfolios/[id]     # Portfolio-Detail
│       └── /portfolios/[id]/edit   # Portfolio bearbeiten
└── /screener                # Fair Value Screener (Phase 4)
    └── /screener/[symbol]   # Aktien-Detail
```

### 4.2 Dashboard (`/dashboard`)

**Anzuzeigende Elemente:**

| Element | Beschreibung |
|---|---|
| Gesamt-Portfolio-Wert | Summe aller Portfolios in Basiswährung |
| YTD-Performance | Rendite seit Jahresbeginn in % und absolut |
| Portfolio-Karten | Liste aller Portfolios mit Kurzinfo |
| Top-Performer | Die 3 besten Holdings über alle Portfolios |
| Top Fair-Value-Chancen | 3 Aktien mit höchstem Discount (Phase 4) |
| Letzte Änderungen | Letzte hinzugefügte/geänderte Holdings |

**Daten-Stand-Hinweis** (Pflicht): Timestamp der letzten Kurs-Aktualisierung sichtbar anzeigen. Kurse als "ca." kennzeichnen.

### 4.3 Portfolio-Liste (`/portfolios`)

| Element | Beschreibung |
|---|---|
| Portfolio-Karten | Name, Wert, Performance, Holdings-Anzahl, Tags |
| Erstellen-Button | Öffnet Formular für neues Portfolio |
| Sortierung | Nach Wert, Name, Erstellungsdatum |

### 4.4 Portfolio-Detail (`/portfolios/[id]`)

**Bereiche (Tabs oder Scrollsections):**

**Tab 1: Übersicht**

- Portfolio-Gesamtwert (groß)
- Rendite absolut und in %
- Performance-Chart (Linienchart, Zeitraum wählbar: 1W, 1M, 3M, 1J, YTD)
- Asset-Allocation (Donut-Chart: nach Asset-Typ, nach Sektor, nach Region)

**Tab 2: Holdings**

- Tabelle/Liste aller Positionen
- Spalten: Symbol, Name, Typ, Stück, Kaufpreis, Aktueller Kurs, Wert, Rendite %, Gewichtung %
- Aktionen: Bearbeiten, Löschen
- Button: "Holding hinzufügen"
- Klumpenrisiko-Warnung, wenn eine Position > 25 % Gewichtung hat

**Tab 3: Dividenden** (nur relevant bei stocks/ETFs)

- Erwartete Jahresdividende (brutto)
- Erwartete Monatsdividende (brutto)
- Optional: Netto nach Abgeltungssteuer (25 % + Soli, Sparerpauschbetrag 1.000 € / 2.000 € verheiratet)
- Dividenden-Cashflow-Chart: Monatliche Ausschüttungen übers Jahr (Balkendiagramm)
- Yield on Cost (Dividendenrendite auf Basis des Kaufpreises)

**Tab 4: Prognose**

- Hochrechnung über X Jahre (1–30, Slider)
- Parameter:
  - Monatliche Sparrate (€)
  - Dividendenwachstum pro Jahr (%)
  - Kurswachstum pro Jahr (%)
  - Wiederanlage Ja/Nein
- Ergebnis: Liniendiagramm + Endwert-Karte

### 4.5 Holding hinzufügen / bearbeiten (Modal oder eigene Seite)

**Formularfelder:**

| Feld | Typ | Validierung |
|---|---|---|
| Symbol / Suche | Text-Suche mit Autocomplete | Pflichtfeld |
| Asset-Typ | Select: stock / etf / crypto | Pflichtfeld |
| Stückzahl | Number | > 0, Dezimalzahlen erlaubt |
| Kaufpreis pro Stück | Number | > 0 |
| Währung | Select (ISO 4217) | Pflichtfeld |
| Kaufdatum | Date Picker | ≤ heute |
| Börsenplatz | Text, optional | — |
| ISIN | Text, optional | Format-Validierung |

**Autocomplete-Suche:**

- Sucht nach Ticker-Symbol oder Unternehmensname
- Datenquelle: API-Cache (Backend, Phase 5) oder öffentliche API
- Zeigt: Symbol, Name, Börse, Typ

### 4.6 Fair Value Screener (`/screener`, Phase 4)

**Filter-Panel:**

| Filter | Typ | Optionen |
|---|---|---|
| Markt | Multi-Select | US, Europa, DACH, Asien, Global |
| Branche | Multi-Select | Technologie, Energie, Finanzen, etc. |
| Marktkapitalisierung | Range-Slider | Small / Mid / Large / Mega Cap |
| Dividendenrendite | Range-Slider | 0 % – 15 % |
| Fair-Value-Score | Range-Slider | 0 – 100 |
| Bewertung | Multi-Select | Unterbewertet / Fair / Überbewertet |

**Ergebnisliste:**

| Spalte | Beschreibung |
|---|---|
| Unternehmen | Logo, Name, Symbol |
| Aktueller Kurs | Mit Währung |
| Fair Value | Berechneter Wert |
| Discount | In % (positiv = unterbewertet) |
| Score | 0–100, farblich kodiert |
| Dividendenrendite | In % |
| KGV | Price-Earnings-Ratio |

**Sortierung:** Höchster Discount, Höchster Score, Höchste Dividendenrendite, Alphabetisch

---

## 5. Berechnungslogik

### 5.1 Portfolio-Wert

```
portfolioValue = Σ (holding.quantity × holding.currentPrice × exchangeRate)
```

### 5.2 Rendite

```
totalReturn = portfolioValue - Σ (holding.quantity × holding.buyPrice × exchangeRate_at_buy)
totalReturnPercent = totalReturn / costBasis × 100
```

### 5.3 Gewichtete Dividendenrendite

```
weightedDividendYield = Σ (holding.weight × holding.dividendYield)
annualDividendIncome = Σ (holding.currentValue × holding.dividendYield)
monthlyDividendIncome = annualDividendIncome / 12
```

### 5.4 Netto-Dividende (optional)

```
sparerpauschbetrag = 1000 (single) | 2000 (verheiratet)
steuerpflichtig = max(0, annualDividendIncome - sparerpauschbetrag)
steuer = steuerpflichtig × 0.25 × 1.055 (Soli)
netDividend = annualDividendIncome - steuer
```

### 5.5 Prognose-Berechnung (Compound Growth)

```
for each year i from 1 to n:
  dividendIncome[i] = portfolioValue[i-1] × dividendYield × (1 + dividendGrowthRate)^i
  if reinvest: portfolioValue[i] = (portfolioValue[i-1] + monthlySavings × 12 + dividendIncome[i]) × (1 + capitalGrowthRate)
  else:        portfolioValue[i] = (portfolioValue[i-1] + monthlySavings × 12) × (1 + capitalGrowthRate)
```

### 5.6 Fair Value Score (Phase 3)

```
fairValueScore = (dcfValue × 0.4) + (grahamValue × 0.2) + (peValue × 0.2) + (fcfValue × 0.2)

discount = (fairValue - currentPrice) / fairValue × 100

score (0–100):
  > 30 % discount  → score 80–100 (stark unterbewertet)
  10–30 % discount → score 60–80 (unterbewertet)
  -10–10 %         → score 40–60 (fair bewertet)
  < -10 %          → score 0–40  (überbewertet)
```

---

## 6. Datenquellen & API-Integration

### 6.1 Aktienkurse & Fundamentaldaten

**Anforderungen:**
- Tagesaktuell (nicht Echtzeit)
- Kurs, Dividendenrendite, KGV, Free Cashflow, EPS
- Abdeckung: US, Europa, DACH

**Mögliche APIs (zu evaluieren):**

| API | Eignung | Kosten |
|---|---|---|
| Financial Modeling Prep (FMP) | Gut, hohe Abdeckung | Freemium |
| Alpha Vantage | Ausreichend für MVP | Freemium |
| Yahoo Finance (inoffiziell) | Riskant, kein stabiles API | Kostenlos |
| Polygon.io | Professionell | Freemium |

### 6.2 Krypto-Kurse

| API | Eignung |
|---|---|
| CoinGecko | Kostenlos, gute Abdeckung |
| CoinMarketCap | Freemium |

### 6.3 Caching-Strategie

```
Ablauf:
  00:00 Uhr: Cron Job startet
  ├── Aktienkurse abrufen (für alle gecachten Symbole)
  ├── Krypto-Kurse abrufen
  ├── Fundamentaldaten abrufen (wöchentlich, nicht täglich)
  ├── Fair Value berechnen (Phase 3)
  ├── Ergebnisse in Redis/DB speichern
  └── TTL: 24 Stunden

Frontend:
  ├── Lädt nur aus Cache (niemals direkt externe APIs)
  ├── Zeigt Timestamp der letzten Aktualisierung
  └── Kennzeichnet alle Kurse als "ca." / "Stand: [Datum]"
```

**Phase 1 (ohne Backend):** Direkter API-Call aus dem Browser für Kurse beim Laden der App. Symbol-Liste kommt aus den Holdings des Nutzers.

---

## 7. Design-System & Komponenten

### 7.1 Designprinzipien

- Orientierung: TradingView, Linear, Stripe, Vercel
- Viel Weißraum, klare Typographie-Hierarchie
- Dark Mode optional (ab Phase 2)
- Mobile-first Responsive Design
- Fokus auf Datenvisualisierung statt rohen Tabellen

### 7.2 Farb-System

| Token | Verwendung |
|---|---|
| `--color-primary` | Hauptaktion, Links |
| `--color-success` | Positiv, Gewinn, unterbewertet |
| `--color-danger` | Negativ, Verlust, überbewertet |
| `--color-warning` | Warnung, Klumpenrisiko |
| `--color-neutral` | Sekundärtext, Borders |
| `--color-surface` | Karten-Hintergrund |
| `--color-background` | Seitenhintergrund |

### 7.3 Kern-Komponenten

| Komponente | Beschreibung |
|---|---|
| `PortfolioCard` | Karte mit Kurzinfo zu einem Portfolio |
| `HoldingRow` | Tabellenzeile für eine Holding-Position |
| `MetricCard` | Kennzahl-Karte (Wert + Label + Trend) |
| `AllocationChart` | Donut-Chart für Asset-Allocation |
| `PerformanceChart` | Linienchart für Portfolio-Verlauf |
| `DividendCalendar` | Monatlicher Cashflow-Balkendiagramm |
| `ForecastChart` | Prognose-Linienchart mit Parametern |
| `ScoreBadge` | Farblich kodierter Fair-Value-Score |
| `DiscountBadge` | Discount/Premium in % mit Farbe |
| `SearchInput` | Autocomplete-Suche für Aktien/Krypto |
| `RiskWarning` | Klumpenrisiko-Hinweis-Banner |
| `DataFreshness` | Timestamp der letzten Datenaktualisierung |
| `Disclaimer` | Rechtlicher Hinweis (keine Anlageberatung) |

---

## 8. Validierungen & Fehlerbehandlung

### 8.1 Formular-Validierungen

| Feld | Regel |
|---|---|
| Portfolio-Name | Pflicht, 1–100 Zeichen, unique pro Nutzer |
| Holding-Symbol | Pflicht, muss in Datenquelle vorhanden sein |
| Stückzahl | Pflicht, > 0, max. 10 Dezimalstellen |
| Kaufpreis | Pflicht, > 0 |
| Kaufdatum | Pflicht, ≤ heute |
| ISIN (optional) | Regex: `[A-Z]{2}[A-Z0-9]{9}[0-9]` |

### 8.2 Fehlerszenarien

| Szenario | Verhalten |
|---|---|
| API nicht erreichbar | Toast-Fehlermeldung, gecachte Daten nutzen |
| Symbol nicht gefunden | Inline-Fehler im Suchfeld |
| localStorage voll | Fehlermeldung mit Hinweis auf Löschen alter Daten |
| Währungsumrechnung fehlt | Wert in Originalwährung anzeigen, Hinweis |

---

## 9. Rechtliche Anforderungen (Pflicht)

### 9.1 Disclaimer

**Zwingend sichtbar** auf Dashboard und Screener:

> "Alle Angaben ohne Gewähr. Dies ist kein Anlageberatungsdienst. Alle Berechnungen basieren auf historischen und geschätzten Daten und stellen keine Empfehlung dar."

### 9.2 Datenschutz (Phase 6)

- Datenschutzerklärung (DSGVO-konform)
- Impressum
- Cookie-Hinweis (falls Tracking-Tools)
- Sichere Datenspeicherung (bcrypt für Passwörter, HTTPS)

### 9.3 Datenquellen kennzeichnen

- Quelle und Stand jeder Kennzahl sichtbar machen
- API-Nutzungsbedingungen der Datenquellen einhalten (Redistribution prüfen)

### 9.4 Werbung & Affiliate

- Display-Werbung klar als "Werbung" kennzeichnen
- Affiliate-Links (Broker) klar als "Partnerlink" kennzeichnen

---

## 10. Monetarisierung (technische Anforderungen)

### 10.1 Phase 1–2: Kostenlos, kein Login

- 1 Portfolio, ausschließlich localStorage
- Kein Server-seitiger Nutzerdaten-Speicher

### 10.2 Phase 6: Kostenpflichtige Konten

| Feature | Anforderung |
|---|---|
| Registrierung / Login | E-Mail + Passwort, OAuth optional |
| Mehrere Portfolios | Ab Plan "Pro" (kostenpflichtig) |
| Zahlungsabwicklung | Stripe Integration |
| Datenspeicherung | Cloud (PostgreSQL via Backend) |
| Datenschutz | DSGVO, Datenlöschung auf Anfrage |

### 10.3 Affiliate-Links

- Broker-Links (Trade Republic, Scalable Capital, etc.) im Footer oder in Holding-Detail
- Tracking via UTM-Parameter

---

## 11. Performance-Anforderungen

| Metrik | Ziel |
|---|---|
| First Contentful Paint | < 1,5 s |
| Time to Interactive | < 3 s |
| Lighthouse Score | > 85 |
| API-Antwortzeit (Backend) | < 200 ms (gecacht) |
| Chart-Rendering | < 100 ms |
| localStorage-Ladezeit | < 50 ms |

---

## 12. Lokale Entwicklungsumgebung

### 12.1 Setup

```bash
# Projekt initialisieren
npx sv create portfolio-planner
cd portfolio-planner
npm install

# Dependencies
npm install @tanstack/svelte-query echarts tailwindcss
npx svelte-add@latest tailwindcss
npm install -D shadcn-svelte
```

### 12.2 Projektstruktur

```
src/
├── lib/
│   ├── components/          # Wiederverwendbare UI-Komponenten
│   │   ├── ui/              # shadcn-svelte Basiskomponenten
│   │   ├── charts/          # ECharts-Wrapper
│   │   └── portfolio/       # Domain-spezifische Komponenten
│   ├── repositories/        # Datenzugriff-Abstraktion
│   │   ├── portfolio.repository.ts
│   │   └── holding.repository.ts
│   ├── services/            # Business-Logik
│   │   ├── portfolio.service.ts     # Berechnungen
│   │   ├── market-data.service.ts   # API-Calls
│   │   └── fair-value.service.ts    # Scoring (Phase 3)
│   ├── stores/              # Svelte Stores
│   │   └── portfolio.store.ts
│   ├── types/               # TypeScript-Typen
│   │   └── index.ts
│   └── utils/               # Hilfsfunktionen
│       ├── formatters.ts    # Zahlen, Währung, Datum
│       └── calculations.ts  # Berechnungslogik
└── routes/
    ├── +layout.svelte       # Root-Layout mit Navigation
    ├── dashboard/
    ├── portfolios/
    │   ├── +page.svelte     # Liste
    │   └── [id]/
    │       └── +page.svelte # Detail
    └── screener/            # Phase 4
```

---

## 13. Offene Entscheidungen (vor Implementierung klären)

| Entscheidung | Optionen | Empfehlung |
|---|---|---|
| Primäre Daten-API | FMP vs. Alpha Vantage vs. Polygon | FMP für Einstieg |
| Krypto-API | CoinGecko vs. CoinMarketCap | CoinGecko (kostenlos) |
| Währungsumrechnung | Fixer.io vs. Open Exchange Rates | Fixer.io Freemium |
| Chart-Library | ECharts vs. Recharts vs. Chart.js | ECharts (mächtiger) |
| Zustandsmanagement | TanStack Query + Stores vs. nur Stores | TanStack Query |
| Dark Mode | Ab Phase 1 vs. Phase 2 | Phase 2 |
| Mehrsprachigkeit | DE only vs. DE + EN | DE only für MVP |

---

## 14. Nicht in Scope (explizite Ausschlüsse)

- Kein Echtzeit-Kurs-Tracking (kein WebSocket)
- Keine direkte Depot-Anbindung (kein Broker-API)
- Keine steuerliche Beratung (nur grobe Näherungswerte)
- Kein Social-Trading oder Community-Features
- Kein Backtesting mit echten historischen Daten (erst später)
- Kein nativer Mobile-App (Web-App reicht)

---

*Dieses Pflichtenheft beschreibt den technischen Soll-Zustand. Alle Angaben zur Steuersimulation sind Näherungswerte und keine steuerliche Beratung.*

# AERISK Report — v1.1.0

**Raport PRO de evaluare a riscului climatic** — renderer oficial al platformei AERISK.

Aplicație React standalone care generează și afișează rapoarte PDF structurate pe **5 pagini funcționale** pentru asigurători și analiști agricoli.

Deployed at: **[report.aerisk.io](https://report.aerisk.io)**

---

## 🎯 Scop

```text
aerisk-ui  →  buton "Raport PRO"  →  aerisk-report (URL params)  →  raport PDF 5 pagini
```

- Randează un raport structurat și auditabil din parametrii URL
- Proiectat pentru subscriere și evaluarea riscului agricol
- Suportă printare / export PDF via `react-to-print`
- Comunică LIVE cu `aerisk-backend` pentru EP Curve, metrici validare și funcția de daună
- Terminologie exclusiv în română (`Subscriere`, `Pierdere Anuală Medie`, `Valoare la Risc`)

---

## 📄 Structură Raport (5 Pagini Funcționale — v1.1.0)

| Pagina | Titlu                                | Conținut principal                                                            |
|--------|--------------------------------------|-------------------------------------------------------------------------------|
| 1      | Sumar Executiv                       | Copertă AERISK, metadate analiză, locație, activ asigurat, scor risc         |
| 2      | Analiza Biologică                    | Calendar BBCH (14 stadii), matrice vulnerabilitate 5 culturi, praguri LT50    |
| 3      | Distribuția Statistică a Riscului    | EP Curve LIVE, perioade revenire, PAM/ha, proiecție solvabilitate 3 ani       |
| 4      | Reziliență și Atenuarea Riscului     | Scenarii critice A+B, măsuri atenuare (aspersiune/IoT/asigurare), recomandări|
| 5      | Metodologie și Audit SHA-256         | Procesul 8 pași, surse de date, metrici validare, sigiliu criptografic        |

> **v1.0.0 → v1.1.0:** structura a fost consolidată de la 8 pagini la 5 pagini funcționale.
> Pages 6, 7, 8 au fost înghețate. Conținutul lor a fost fuzionat în Page4 și Page5.

---

## 🌿 Culturi și Stadii Fenologice Acoperite (v1.1.0)

Toate cele 5 culturi au reguli de vulnerabilitate complete în `aerisk-engine`:

| Cultură    | Stadii BBCH | LT50 Înflorire | Sensibilitate    |
|------------|-------------|----------------|------------------|
| Piersic    | 14          | −1,0°C         | MAXIM            |
| Cireș      | 14          | −1,0°C         | RIDICAT          |
| Prun       | 14          | −1,8°C         | RIDICAT          |
| Măr        | 14          | −1,8°C         | MODERAT          |
| Viță de vie| 14          | −0,5°C         | SCĂZUT           |

---

## 📦 Structura Proiectului

```
aerisk-report/
├── src/
│   ├── components/
│   │   ├── Page1.tsx   # Sumar Executiv — copertă, locație, scor risc
│   │   ├── Page2.tsx   # Analiza Biologică — BBCH calendar, LT50, matrice vulnb.
│   │   ├── Page3.tsx   # Distribuție Statistică — EP Curve LIVE, VaR, PAM/ha, solvabilitate
│   │   ├── Page4.tsx   # Reziliență — scenarii A+B, atenuare risc, recomandări fermier
│   │   ├── Page5.tsx   # Metodologie + Audit SHA-256 — 8 pași, surse, validare, sigiliu
│   │   ├── Page6.tsx   # ❄️ ÎNGHEȚAT (conținut fuzionat în Page4)
│   │   ├── Page7.tsx   # ❄️ ÎNGHEȚAT (conținut fuzionat în Page4)
│   │   └── Page8.tsx   # ❄️ ÎNGHEȚAT (conținut fuzionat în Page5)
│   ├── config/
│   │   └── reportParams.ts   # Parser parametri URL (toate datele raportului)
│   └── main.tsx              # Punct de intrare aplicație
│
├── public/
├── vite.config.ts
├── package.json
├── tsconfig.app.json
├── vercel.json
└── Dockerfile
```

---

## 🔗 Flux de Date — Parametri URL

`aerisk-report` primește **toate datele din parametrii URL** injectați de `aerisk-ui` la click pe "Raport PRO".

`reportParams.ts` parsează query string-ul complet și expune date tipizate tuturor componentelor. Datele pre-computate vin în URL; datele LIVE (EP Curve, metrici validare) vin prin fetch la `aerisk-backend`.

**Exemplu URL:**
```
https://report.aerisk.io?request_id=abc123&location=Purcari&hazard=FROST
  &risk_score=0.71&risk_level=HIGH&aal=4200&aal_per_ha=336
  &pml95=32000&var99=48000&currency=EUR&area_ha=12.5
  &crop=cherry&phenophase=flowering
  &sha256=abc123...&engine_version=1.0.0&timestamp=2026-04-01T...
```

### Endpoint-uri Backend LIVE (folosite în raport)

| Pagina | Endpoint                          | Metodă | Descriere                          |
|--------|-----------------------------------|--------|------------------------------------|
| 3      | `/api/analytics/ep-curve`         | POST   | Monte Carlo 10K iterații → EP Curve|
| 5      | `/api/analytics/backtesting`      | GET    | Metrici validare model frost_v1.0  |

---

## 🛠️ Tech Stack

| Tehnologie        | Versiune   | Rol                                   |
|-------------------|------------|---------------------------------------|
| React             | 19.2.4     | Randare UI                            |
| TypeScript        | 5.9.3      | Siguranță tipuri                      |
| Vite              | 8.0.0      | Build tool                            |
| Recharts          | 3.8.0      | Grafice distribuție pierdere          |
| lucide-react      | 0.577.0    | Iconițe                               |
| html2pdf.js       | 0.14.0     | Generare PDF                          |
| react-to-print    | 3.3.0      | Printare browser / export PDF         |
| Web Crypto API    | Browser    | SHA-256 audit (client-side, zero deps)|

---

## 🚀 Dezvoltare Locală

```bash
npm install
npm run dev
```

Default: `http://localhost:5174`

Testare cu date: adăugați parametrii URL conform formatului din `reportParams.ts`.

---

## 🏗️ Build Producție

```bash
npm run build
```

---

## 🐳 Docker

```bash
docker build -t aerisk-report:1.1.0 .
docker run -p 5174:5174 aerisk-report:1.1.0
```

---

## ☁️ Deployment

- **Platformă**: Vercel
- **URL**: `https://report.aerisk.io`
- **Trigger**: Automat la push pe `main`
- **Config**: `vercel.json`

---

## 🔒 Audit și Integritate (Page 5)

Fiecare raport include pe Pagina 5:

- **Hash SHA-256** — calculat client-side via Web Crypto API din payload complet (context + metrici + parametri + ID raport + timestamp)
- **ID Raport** — format `AERISK-YYYYMMDD-REGION-HZ`
- **Versiune motor** — AERISK ENGINE v1.0.0 (frozen)
- **Surse date** — ERA5 / ECMWF, FAO, INCDH Pitești, KU Leuven
- **Timestamp** — UTC formatat în română

Orice modificare a datelor produce un hash complet diferit — SHA-256 este standard NIST FIPS 180-4.

---

## ↔️ Relație cu aerisk-ui

| aerisk-ui                           | aerisk-report                        |
|-------------------------------------|--------------------------------------|
| Colectează input, rulează evaluarea | Randează raportul PRO oficial        |
| Afișează rezultate inline (dashboard)| Raport PDF 5 pagini structurat      |
| Butonul "Raport PRO" deschide →     | report.aerisk.io cu parametri URL    |
| Conține PdfGenerator.ts (inactiv)   | Generare activă PDF via print        |

> Butonul export PDF din `aerisk-ui` a fost eliminat (commit f4abbea, 31 Mar 2026).
> Toate rapoartele PDF oficiale sunt generate de `aerisk-report`.

---

## 🧊 Status

| Feature                             | Status      |
|-------------------------------------|-------------|
| Structură 5 pagini funcționale      | ✅ DONE      |
| Terminologie 100% română            | ✅ DONE      |
| EP Curve LIVE (POST /ep-curve)      | ✅ DONE      |
| Analiza biologică 5 culturi × 14 BBCH| ✅ DONE    |
| PAM per hectar (area_ha funcțional) | ✅ DONE      |
| Proiecție solvabilitate 3 ani       | ✅ DONE      |
| Scenarii reziliență A+B             | ✅ DONE      |
| Audit SHA-256 (Web Crypto API)      | ✅ DONE      |
| Metrici validare LIVE               | ✅ DONE      |
| Deployment Vercel                   | ✅ LIVE      |
| i18n (RO / EN)                      | 🔄 PLANNED  |
| GIS / DTM Copernicus DEM v2.0       | 🔄 PLANNED  |

---

© AERISK — Infrastructură de Risc Climatic

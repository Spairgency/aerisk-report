

# AERISK-ENGINE — CONTRACT OUTPUT (v1)

## Scop
Acest document definește **contractul oficial de output** al AERISK-ENGINE.
Orice modificare care rupe acest contract este interzisă după versiunea v1.0.0.

ENGINE produce **doar rezultate financiare determinate**, pe baza inputului primit.
ENGINE nu adaugă interpretări de domeniu (agricol, meteo, etc.).

---

## Principii Fundamentale

- Output-ul este **determinist și auditabil**
- Structura este **strictă** (fără câmpuri dinamice)
- Toate valorile sunt **explicite**
- ENGINE este **agnostic** față de sursa datelor
- Orice degradare este **marcată explicit**

---

## Structura Generală

```json
{
  "engine_mode": "normal | degraded",
  "summary": {},
  "hazard": {},
  "vulnerability": {},
  "monte_carlo": {},
  "metadata": {}
}
```

---

## 1. engine_mode

Indică starea de funcționare a ENGINE în momentul calculului.

Valori permise:
- `normal`
- `degraded`

ENGINE este `degraded` când:
- inputul este incomplet
- valorile sunt extreme
- apare o eroare internă recuperabilă

---

## 2. summary

Rezumat executiv, destinat consumului rapid (dashboard, raport).

```json
{
  "risk_score": 0.0,
  "risk_level": "LOW | MEDIUM | HIGH | EXTREME"
}
```

- `risk_score` ∈ [0,100]
- `risk_level` este derivat exclusiv din scor

---

## 3. hazard

Rezultatul agregării probabilistice a hazardului.

```json
{
  "overall_probability": 0.25,
  "components": [
    {
      "hazard_type": "FROST",
      "probability": 0.25,
      "severity_level": "LOW | MEDIUM | HIGH"
    }
  ]
}
```

ENGINE **nu validează semnificația hazardului** — doar îl propagă.

---

## 4. vulnerability

Descrie impactul procentual estimat asupra expunerii.

```json
{
  "loss_ratio_min": 0.1,
  "loss_ratio_mode": 0.25,
  "loss_ratio_max": 0.5
}
```

Reguli:
- `0 ≤ min ≤ mode ≤ max ≤ 1`
- În mod `degraded`, ENGINE folosește `loss_ratio_max`

---

## 5. monte_carlo

Rezultatele simulării financiare.

```json
{
  "total_insured_value": 10000,
  "aal": 750,
  "var_90": 1200,
  "var_95": 1500,
  "var_99": 2200,
  "pml_90": 3000,
  "pml_95": 4000,
  "pml_99": 5000
}
```

Definiții:
- **AAL** – Annual Average Loss
- **VaR** – Value at Risk
- **PML** – Probable Maximum Loss

Toate valorile sunt în aceeași monedă ca `exposure_value`.

---

## 6. metadata

Informații de audit și trasabilitate.

```json
{
  "engine_version": "1.0.0",
  "model_version": "v1",
  "timestamp": "2025-03-01T12:00:00Z"
}
```

---

## Reguli de Compatibilitate

- Câmpurile NU se elimină în versiunile viitoare
- Se pot adăuga câmpuri **doar opțional**
- Semantica câmpurilor existente NU se schimbă

---

## Status Contract

- Versiune: **v1**
- Status: **STABLE**
- Modificări permise: **doar additive**

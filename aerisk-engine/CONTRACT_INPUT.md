
# AERISK-ENGINE — CONTRACT INPUT (v1.0)

## Rolul acestui document

Acest document definește **contractul strict de intrare** pentru AERISK-ENGINE.
Orice input care nu respectă acest contract este **respins** sau **ignorat explicit**.

ENGINE este:

- determinist
- auditabil
- agnostic față de sursa datelor

ENGINE **NU interpretează** datele. Le validează și le folosește exact așa cum sunt primite.

---

## Structura INPUT acceptată

ENGINE acceptă **doar următoarele câmpuri**:

### 1. hazard_probability

- Tip: `float`
- Interval valid: `[0.0, 1.0]`
- Semnificație: probabilitatea pură ca evenimentul să se producă
- Observații:
  - nu este calculată de ENGINE
  - nu este ajustată sau corectată

---

### 2. loss_ratio_min

- Tip: `float`
- Constrângere: `>= 0`
- Semnificație: pierderea minimă relativă posibilă (worst-case lower bound)

---

### 3. loss_ratio_mode

- Tip: `float`
- Constrângere: `>= loss_ratio_min`
- Semnificație: pierderea cea mai probabilă (modul distribuției)

---

### 4. loss_ratio_max

- Tip: `float`
- Constrângere: `>= loss_ratio_mode`
- Semnificație: pierderea maximă posibilă (upper bound)

---

### 5. exposure_value

- Tip: `float`
- Constrângere: `> 0`
- Semnificație: valoarea financiară expusă riscului (ex: sumă asigurată)

---

## Reguli de validare (FAIL-FAST)

ENGINE aplică următoarele reguli stricte:

- orice câmp lipsă → **Validation Error**
- orice câmp în afara constrângerilor → **Validation Error**
- orice câmp suplimentar → **respins sau ignorat explicit**
- ENGINE **nu corectează** datele primite
- ENGINE **nu completează** date lipsă

---

## Comportament la input invalid

La input invalid:

- request-ul este respins
- se returnează cod HTTP `400`
- mesajul de eroare este explicit și determinist
- nu se expune stacktrace intern

---

## Exemplu INPUT VALID

```json
{
  "hazard_probability": 0.3,
  "loss_ratio_min": 0.1,
  "loss_ratio_mode": 0.25,
  "loss_ratio_max": 0.5,
  "exposure_value": 10000
}
```

---

## Exemplu INPUT INVALID

```json
{
  "hazard_probability": 1.4,
  "loss_ratio_min": 0.2,
  "loss_ratio_mode": 0.1,
  "loss_ratio_max": 0.5,
  "exposure_value": -100
}
```

Motiv:

- probabilitate invalidă
- ordine incorectă a loss_ratio
- exposure_value negativ

---

## Garanții

Dacă acest contract este respectat:

- ENGINE produce rezultate deterministe
- ENGINE este stabil
- ENGINE este sigur pentru integrare cu orice LAB

---

## Versionare

- Contract: `INPUT v1.0`
- Orice modificare viitoare:
  - NU rupe compatibilitatea
  - se face doar prin versiune nouă

---

✔ Acest contract este **SIGILAT**.


# AERISK-ENGINE — RUNBOOK (v1.0)

## Scop

Acest document descrie **cum rulezi, verifici, debugezi și operezi** AERISK-ENGINE în mod sigur.
ENGINE este un motor determinist de calcul de risc. Nu colectează date și nu conține AI/ML.

---

## 1. Pornire Locală (Dev)

### Cerințe

- Python 3.13
- Poetry
- Docker (opțional)

### Instalare

```bash
poetry install
poetry shell
```

### Rulare locală

```bash
uvicorn engine.services.api:app --host 0.0.0.0 --port 8000
```

### Verificare

```bash
curl http://localhost:8000/health
```

---

## 2. Rulare cu Docker (Prod-like)

### Build imagine

```bash
docker build -t aerisk-engine:1.0.0 .
```

### Run container

```bash
docker run -p 8000:8000 aerisk-engine:1.0.0
```

 Verificare

```bash
curl http://localhost:8000/health
```

---

## 3. Endpoint-uri Critice

### Health

- `GET /health`
- `GET /health/engine`
- `GET /health/contracts`
- `GET /health/config`

Toate trebuie să răspundă rapid (<50ms).

### Risk

- `POST /risk`

Payload minim acceptat:

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

## 4. Moduri de Operare ENGINE

### Normal

- input valid
- valori în intervale rezonabile

### Degraded

Activat automat dacă:

- hazard_probability > 0.8
- loss_ratio_mode > 0.5
- eroare internă recuperabilă

În acest caz:

- se folosește `loss_ratio_max`
- output conține:

```json
"engine_mode": "degraded"
```

ENGINE NU se oprește.

---

## 5. Error Handling

### Tipuri

- `validation_error` → HTTP 400
- `computation_error` → HTTP 422
- `internal_error` → HTTP 500

### Reguli

- niciodată stacktrace către client
- mesaje clare, scurte
- toate erorile sunt logate

---

## 6. Audit & Trasabilitate

ENGINE poate rula cu audit activ.
Audit-ul:

- salvează input + output
- timestamp UTC
- engine_version

Folosit pentru:

- debugging
- explicații către asiguratori
- validare legală

---

## 7. Testare

### Rulare completă teste

```bash
pytest
```

### Ce garantează testele

- contract input stabil
- contract output stabil
- rezultate deterministe
- Monte Carlo reproductibil (seed fix)

Dacă un test „golden sample” pică → CONTRACT SPART.

---

## 8. Performance & Stress

ENGINE este testat pentru:

- 1k / 10k / 50k request-uri
- inputuri extreme
- rulare Monte Carlo repetată

Așteptări:

- timp constant
- fără memory leak
- fără crash

---

## 9. Securitate de Bază

Activ:

- rate limiting
- input size limit
- validări stricte

Nu există:

- autentificare
- user management
- execuție dinamică

---

## 10. Ce NU se face în ENGINE

NU:

- se adaugă ML
- se adaugă logică de business agricol
- se adaugă colectare date
- se modifică contractele fără versionare

---

## 11. Versionare

Versiune curentă: **v1.0.0**

Regulă:

- ENGINE este „înghețat”
- modificările viitoare NU sparg contractele
- orice schimbare → versiune nouă

---

## Final

Dacă acest RUNBOOK este respectat:

- ENGINE este stabil
- ENGINE este auditabil
- ENGINE este gata să fie alimentat de AERISK-LAB

ENGINE este fundația sistemului.

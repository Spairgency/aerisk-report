# AERISK ENGINE — v1.0.0

## Purpose

AERISK Engine is a **pure, deterministic risk computation engine**.

It evaluates **financial risk consequences** based on probabilistic inputs, without ingesting or interpreting real‑world data itself.

The engine is designed to be:

- deterministic
- reproducible
- audit‑ready
- contract‑driven
- production‑safe

This is a **core backend product**, not an experiment.

---

## What the Engine DOES

- Computes expected financial loss using Monte Carlo simulation
- Aggregates risk into deterministic scores (LOW / MEDIUM / HIGH)
- Produces a stable, versioned output contract
- Supports degraded mode for extreme or weak inputs
- Exposes a minimal HTTP API for orchestration

---

## What the Engine DOES NOT Do

- ❌ ingest climate or sensor data  
- ❌ perform ML / AI training  
- ❌ apply domain logic (agriculture, insurance, etc.)  
- ❌ manage users or authentication  
- ❌ render UI, dashboards, PDFs  
- ❌ auto‑correct bad input  

All intelligence lives **outside** the engine.

---

## Architecture Principles

- Single frozen output contract: `RiskResultV1`
- Engine logic fully isolated from API layer
- Fail‑fast validation
- Deterministic Monte Carlo (fixed seed)
- Explicit degraded mode
- Full auditability

---

## Project Structure

```
aerisk-engine/
├── app/                        # FastAPI adapter (thin HTTP layer)
│   ├── main.py                 # App entrypoint
│   ├── api/
│   │   └── routes.py           # Route definitions → /risk/v1, /health, /version
│   ├── schemas/                # Pydantic API schemas (input_v1, output, metadata_v1)
│   └── services/
│       └── engine_dummy.py     # Stub service for API layer
│
├── engine/                     # CORE ENGINE (pure computation)
│   ├── contracts/              # Frozen output contract: RiskResultV1
│   ├── orchestrator/           # RiskPipelineV1 — main execution pipeline
│   │   ├── risk_pipeline.py
│   │   └── risk_pipeline_core.py
│   ├── monte_carlo/            # Monte Carlo simulation (10,000 iterations)
│   │   ├── monte_carlo_v1.py
│   │   ├── output_v1.py
│   │   └── plots_v1.py
│   ├── risk_aggregation/       # AAL, VaR 90/95/99, PML → risk score
│   │   └── risk_scoring_v1.py
│   ├── hazard/                 # Hazard probability models
│   │   ├── base.py             # Abstract HazardModel base class
│   │   ├── frost_v1.py         # Frost probability model (BBCH-aware)
│   │   ├── baseline.py         # Baseline fallback
│   │   ├── features_frost.py   # Feature engineering for frost
│   │   └── calibration_frost.py
│   ├── vulnerability/          # Vulnerability (loss ratio) models
│   │   └── vulnerability_model.py
│   ├── services/               # Internal service layer
│   │   ├── hazard_service.py
│   │   ├── vulnerability_service.py
│   │   ├── monte_carlo_engine.py
│   │   └── api.py
│   ├── data_providers/         # External data adapters (weather, meteo)
│   │   ├── meteo_provider.py
│   │   └── open_meteo_provider.py
│   ├── calibration/            # Scenario calibration & runners
│   │   ├── scenario_runner.py
│   │   └── scenarios/
│   ├── data_fusion/            # Data fusion layer (stub)
│   ├── hazard_models/          # Hazard model registry
│   ├── audit/                  # Audit events & replay logger
│   ├── config/                 # Business thresholds, risk profiles, settings
│   ├── exceptions.py           # Domain exceptions
│   ├── engine_settings.py      # Engine runtime settings
│   └── version.py              # Single source of truth: v1.0.0 (FROZEN)
│
├── examples/                   # Golden samples (requests, responses, scenarios)
├── tests/                      # Integration & golden-sample tests
├── conftest.py
├── pytest.ini
├── CONTRACT_INPUT.md           # Input contract documentation
├── CONTRACT_OUTPUT.md          # Output contract documentation
├── RUNBOOK.md                  # Operational runbook
├── Dockerfile
└── README.md
```

---

## Running Locally

### Requirements

- Python >= 3.11
- Optional: `aerisk-lab` running on `localhost:8000`

### Setup

```bash
cd aerisk-engine
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Run

```bash
uvicorn app.main:app --reload --port 8002
```

API base: `http://127.0.0.1:8002`

Health check: `http://127.0.0.1:8002/health`
Swagger UI: `http://127.0.0.1:8002/docs`

---

## Running with Docker

```bash
docker build -t aerisk-engine:1.0.0 .
docker run -p 8000:8000 aerisk-engine:1.0.0
```

---

## Health & Versioning

### Healthcheck

GET /health

### Engine Version

GET /version

The engine refuses to start if:

- configuration is invalid
- contracts are missing
- critical checks fail

---

## Risk Computation API

POST /risk/v1

- Input: strict validated contract
- Output: `RiskResultV1` (frozen)

Breaking changes require **new version only**.

---

## Contract Discipline

- `engine/contracts/output_v1.py` is the single source of truth
- API schemas mirror engine contracts
- No silent changes
- No backward‑breaking patches

---

## Audit & Reproducibility

- Each run can be logged
- Monte Carlo is replayable
- Outputs are traceable and explainable

---

## Release Policy

- v1.0.0 is frozen
- No behavioral changes allowed
- New logic = new major version

---

## Production Guarantee

If input is valid:

- output is deterministic
- output is reproducible
- output respects the contract

---

## 🧊 Status

| Component                        | Status       |
|----------------------------------|--------------|
| Monte Carlo simulation (v1)      | ✅ DONE       |
| Risk aggregation (AAL, VaR, PML) | ✅ DONE       |
| Frost hazard model (v1)          | ✅ DONE       |
| Vulnerability model              | ✅ DONE       |
| Orchestrator pipeline            | ✅ DONE       |
| Audit & replay                   | ✅ DONE       |
| Data providers (meteo)           | ✅ DONE       |
| FastAPI adapter                  | ✅ DONE       |
| Calibration scenarios            | ✅ DONE       |
| Heat / Drought hazard models     | 🔄 PLANNED    |
| Auth / Multi-tenant              | ❌ N/A (MVP)  |

---

**AERISK Engine is an industrial foundation, not a prototype.**

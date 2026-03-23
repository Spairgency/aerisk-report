from fastapi import FastAPI, HTTPException, Request
from engine.orchestrator.risk_pipeline import RiskPipelineV1
from app.schemas.input_v1 import RiskRequestV1
from engine.config.settings import load_risk_profiles
from fastapi.responses import JSONResponse
from engine.exceptions import EngineValidationError

import os
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        load_risk_profiles()
        RiskPipelineV1()
    except Exception as exc:
        raise RuntimeError(f"Startup validation failed: {exc}")
    yield


app = FastAPI(title="AERISK Engine API", lifespan=lifespan)
ENGINE_VERSION = os.getenv("AERISK_ENGINE_VERSION", "1.0.0")

RATE_LIMIT = int(os.getenv("AERISK_RATE_LIMIT", "100"))
RATE_WINDOW_SECONDS = int(os.getenv("AERISK_RATE_WINDOW_SECONDS", "60"))

app.state.rate_counter = {}

@app.exception_handler(EngineValidationError)
async def engine_validation_error_handler(request: Request, exc: EngineValidationError):
    return JSONResponse(
        status_code=400,
        content={
            "error": {
                "type": "ENGINE_VALIDATION_ERROR",
                "message": str(exc),
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": "INTERNAL_ERROR",
                "message": "Internal engine error",
            }
        },
    )

@app.middleware("http")
async def rate_limit_guard(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    # Exclude health endpoints from rate limiting
    if request.url.path.startswith("/health"):
        return await call_next(request)

    bucket = request.app.state.rate_counter.setdefault(
        client_ip, {"count": 0, "reset_at": now + RATE_WINDOW_SECONDS}
    )

    if now > bucket["reset_at"]:
        bucket["count"] = 0
        bucket["reset_at"] = now + RATE_WINDOW_SECONDS

    bucket["count"] += 1

    if bucket["count"] > RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={
                "error": {
                    "type": "RATE_LIMIT_EXCEEDED",
                    "message": "Too many requests",
                }
            },
        )

    return await call_next(request)

@app.get("/version")
def version():
    return {"version": ENGINE_VERSION}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "engine_version": ENGINE_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/health/engine")
def health_engine():
    try:
        RiskPipelineV1()
        return {
            "engine": "ready",
            "version": ENGINE_VERSION,
        }
    except Exception:
        return JSONResponse(
            status_code=500,
            content={
                "engine": "error",
            },
        )

@app.get("/health/config")
def health_config():
    try:
        load_risk_profiles()
        return {"config": "ok"}
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"config": "error"},
        )

@app.get("/health/contracts")
def health_contracts():
    try:
        from app.schemas.input_v1 import RiskRequestV1
        from engine.contracts.output_v1 import RiskResultV1

        _ = RiskRequestV1
        _ = RiskResultV1

        return {"contracts": "ok"}
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"contracts": "error"},
        )

@app.post("/risk")
def compute_risk(payload: RiskRequestV1):
    profiles = load_risk_profiles()

    if payload.profile not in profiles:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown risk profile: {payload.profile}",
        )

    pipeline = RiskPipelineV1(profile_name=payload.profile)

    return pipeline.run(
        hazard_probability=payload.hazard_probability,
        loss_ratio_min=payload.loss_ratio_min,
        loss_ratio_mode=payload.loss_ratio_mode,
        loss_ratio_max=payload.loss_ratio_max,
        exposure_value=payload.exposure_value,
    )

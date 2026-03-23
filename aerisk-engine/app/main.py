"""
AERISK ENGINE API
Thin FastAPI adapter over the AERISK Engine.
ETAPA 15 – Product Hardening
"""

from fastapi import FastAPI
from app.schemas.input import RiskComputationRequest
from app.schemas.output import ComputeRiskResponse
from engine.orchestrator.risk_pipeline import RiskPipelineV1

app = FastAPI(
    title="AERISK Engine API",
    version="1.0.0",
    description="API adapter for the AERISK climate risk engine",
)

pipeline = RiskPipelineV1()


@app.get("/health")
def healthcheck():
    return {
        "status": "ok",
        "engine": "AERISK_ENGINE",
        "version": "1.0.0",
    }


@app.post(
    "/v1/compute-risk",
    response_model=ComputeRiskResponse,
)
def compute_risk(request: RiskComputationRequest):
    return pipeline.run(
        hazard_probability=request.hazard_probability,
        loss_ratio_min=request.loss_ratio_min,
        loss_ratio_mode=request.loss_ratio_mode,
        loss_ratio_max=request.loss_ratio_max,
        exposure_value=request.exposure_value,
    )
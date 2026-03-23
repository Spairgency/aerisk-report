from pydantic import BaseModel, Field
from typing import Optional


class RiskComputationRequest(BaseModel):
    hazard_probability: float = Field(..., ge=0.0, le=1.0)

    loss_ratio_min: float = Field(..., ge=0.0, le=1.0)
    loss_ratio_mode: float = Field(..., ge=0.0, le=1.0)
    loss_ratio_max: float = Field(..., ge=0.0, le=1.0)

    exposure_value: float = Field(..., gt=0)
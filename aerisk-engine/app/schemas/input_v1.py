"""
ETAPA 14.1 – API Input Contract V1
Stable request schema for AERISK API.
"""

from pydantic import BaseModel, Field, model_validator
from typing import Optional, Literal


class RiskRequestV1(BaseModel):
    """
    Risk computation request – V1
    """
    hazard_probability: float = Field(..., ge=0.0, le=1.0)
    loss_ratio_min: float = Field(..., ge=0.0, le=1.0)
    loss_ratio_mode: float = Field(..., ge=0.0, le=1.0)
    loss_ratio_max: float = Field(..., ge=0.0, le=1.0)
    exposure_value: float = Field(..., gt=0.0)

    profile: Optional[Literal["default", "conservative", "aggressive"]] = "default"
    debug: bool = False

    source: Optional[str] = Field(default=None, description="Upstream system generating the request (e.g. aerisk-lab)")
    request_id: Optional[str] = Field(default=None, description="Correlation / audit id")

    @model_validator(mode="after")
    def check_loss_ratios_order(cls, values):
        if not (values.loss_ratio_min <= values.loss_ratio_mode <= values.loss_ratio_max):
            raise ValueError("loss ratios must satisfy: min <= mode <= max")
        return values

    class Config:
        extra = "forbid"

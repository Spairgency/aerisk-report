"""
ETAPA 13.4 – Output Contract V1
Stable, versioned output schema consumed by external systems.
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, model_validator
from pydantic import ConfigDict
from engine import __version__ as ENGINE_VERSION
from enum import Enum


class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class EngineModeEnum(str, Enum):
    NORMAL = "normal"
    DEGRADED = "degraded"


class HazardTypeEnum(str, Enum):
    FROST = "FROST"
    DROUGHT = "DROUGHT"
    FLOOD = "FLOOD"
    HEAT = "HEAT"


class SeverityLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class MetadataV1(BaseModel):
    engine_version: str = ENGINE_VERSION
    model_version: str
    timestamp: datetime
    computation_time_ms: Optional[int] = None

    model_config = ConfigDict(extra="forbid")


class HazardComponentV1(BaseModel):
    hazard_type: HazardTypeEnum
    probability: float = Field(ge=0.0, le=1.0)
    severity_level: SeverityLevelEnum
    return_period_years: Optional[float] = None

    model_config = ConfigDict(extra="forbid")


class HazardAssessmentV1(BaseModel):
    overall_probability: float = Field(ge=0.0, le=1.0)
    components: List[HazardComponentV1] = []

    model_config = ConfigDict(extra="forbid")


class VulnerabilityAssessmentV1(BaseModel):
    loss_ratio_min: Optional[float] = None
    loss_ratio_mode: Optional[float] = None
    loss_ratio_max: Optional[float] = None
    notes: Optional[str] = None

    @model_validator(mode="after")
    def validate_loss_ratios(self):
        if None not in (self.loss_ratio_min, self.loss_ratio_mode, self.loss_ratio_max):
            if not (self.loss_ratio_min <= self.loss_ratio_mode <= self.loss_ratio_max):
                raise ValueError(
                    "loss_ratio_min <= loss_ratio_mode <= loss_ratio_max must hold"
                )
        return self

    model_config = ConfigDict(extra="forbid")


class MonteCarloMetricsV1(BaseModel):
    total_insured_value: float
    aal: float
    var_90: Optional[float] = None
    var_95: Optional[float] = None
    var_99: Optional[float] = None
    pml_90: Optional[float] = None
    pml_95: Optional[float] = None
    pml_99: Optional[float] = None
    loss_distribution_sample: Optional[List[float]] = None

    @model_validator(mode="after")
    def validate_var_pml_consistency(self):
        if self.aal is None:
            raise ValueError("aal is mandatory")
        for lvl in ("90", "95", "99"):
            var = getattr(self, f"var_{lvl}")
            pml = getattr(self, f"pml_{lvl}")
            if var is not None and pml is not None and pml < var:
                raise ValueError(f"pml_{lvl} must be >= var_{lvl}")
        return self

    model_config = ConfigDict(extra="forbid")


class RiskSummaryV1(BaseModel):
    risk_score: float
    risk_level: RiskLevelEnum

    model_config = ConfigDict(extra="forbid")


class RiskResultV1(BaseModel):
    engine_mode: EngineModeEnum = EngineModeEnum.NORMAL
    summary: RiskSummaryV1
    hazard: HazardAssessmentV1
    vulnerability: VulnerabilityAssessmentV1
    monte_carlo: MonteCarloMetricsV1
    metadata: MetadataV1

    @property
    def engine_version(self) -> str:
        return self.metadata.engine_version

    @property
    def aal(self) -> float:
        return self.monte_carlo.aal

    @property
    def var_95(self) -> float:
        return self.monte_carlo.var_95

    @property
    def pml_95(self) -> float:
        return self.monte_carlo.pml_95

    @property
    def risk_level(self) -> str:
        return self.summary.risk_level

    @property
    def risk_score(self) -> float:
        return self.summary.risk_score

    model_config = ConfigDict(extra="forbid")

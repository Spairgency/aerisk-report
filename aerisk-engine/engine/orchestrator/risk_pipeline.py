from datetime import datetime, timezone
import uuid
from enum import Enum

from engine.orchestrator.risk_pipeline_core import (
    RiskPipelineCore,
    HazardCoreResult,
    VulnerabilityCoreResult,
)
from engine.risk_aggregation.risk_scoring_v1 import RiskScoringV1
from engine.config.settings import RiskProfile, load_risk_profiles
from engine.version import ENGINE_VERSION
from engine.contracts.output_v1 import (
    RiskResultV1,
    RiskSummaryV1,
    HazardAssessmentV1,
    HazardComponentV1,
    VulnerabilityAssessmentV1,
    MonteCarloMetricsV1,
    MetadataV1,
)
from engine.audit.logger_v1 import AuditLoggerV1
from engine.audit.event_v1 import AuditEventV1
from engine.exceptions import EngineValidationError


class RiskPipelineV1:
    class EngineMode(str, Enum):
        NORMAL = "normal"
        DEGRADED = "degraded"

    version = ENGINE_VERSION

    def __init__(
        self,
        profile_name: str = "default",
        audit_logger: AuditLoggerV1 | None = None,
    ) -> None:
        self.core = RiskPipelineCore()
        profiles = load_risk_profiles()
        self.scorer = RiskScoringV1(profile=profiles[profile_name])
        self.audit_logger = audit_logger

    def run(
        self,
        hazard_probability: float,
        loss_ratio_min: float,
        loss_ratio_mode: float,
        loss_ratio_max: float,
        exposure_value: float,
    ) -> RiskResultV1:
        engine_mode = self.EngineMode.NORMAL
        if not (0.0 <= hazard_probability <= 1.0):
            raise EngineValidationError("hazard_probability must be between 0 and 1")

        if not (0.0 <= loss_ratio_min <= loss_ratio_mode <= loss_ratio_max <= 1.0):
            raise EngineValidationError(
                "loss ratios must satisfy 0 <= min <= mode <= max <= 1"
            )

        if exposure_value <= 0:
            raise EngineValidationError("exposure_value must be > 0")

        engine_mode = self.EngineMode.NORMAL
        if hazard_probability > 0.8 or loss_ratio_mode > 0.5:
            engine_mode = self.EngineMode.DEGRADED

        try:
            mc_result = self.core.run(
                hazard=HazardCoreResult(
                    overall_probability=hazard_probability,
                ),
                vulnerability=VulnerabilityCoreResult(
                    loss_ratio_min=loss_ratio_min,
                    loss_ratio_mode=loss_ratio_mode,
                    loss_ratio_max=loss_ratio_max,
                ),
                exposure_value=exposure_value,
            )

            score = self.scorer.score(mc_result, exposure_value=exposure_value)

        except Exception as exc:
            engine_mode = self.EngineMode.DEGRADED
            raise EngineValidationError(
                f"RiskPipeline execution failed: {exc}"
            ) from exc

        result_v1 = RiskResultV1(
            engine_mode=engine_mode.value,
            summary=RiskSummaryV1(
                risk_score=score.risk_score,
                risk_level=score.risk_level,
            ),
            hazard=HazardAssessmentV1(
                overall_probability=hazard_probability,
                components=[
                    HazardComponentV1(
                        hazard_type="FROST",
                        probability=hazard_probability,
                        severity_level="MEDIUM",
                    )
                ],
            ),
            vulnerability=VulnerabilityAssessmentV1(
                loss_ratio_min=loss_ratio_min,
                loss_ratio_mode=loss_ratio_mode,
                loss_ratio_max=loss_ratio_max,
            ),
            monte_carlo=MonteCarloMetricsV1(
                total_insured_value=exposure_value,
                aal=mc_result.aal,
                var_90=mc_result.var_90,
                var_95=mc_result.var_95,
                var_99=mc_result.var_99,
                pml_90=mc_result.pml_90,
                pml_95=mc_result.pml_95,
                pml_99=mc_result.pml_99,
                loss_distribution_sample=getattr(mc_result, "losses", None),
            ),
            metadata=MetadataV1(
                engine_version=self.version,
                model_version="v1",
                timestamp=datetime.now(timezone.utc),
            ),
        )

        if self.audit_logger is not None:
            event = AuditEventV1(
                event_id=str(uuid.uuid4()),
                engine_version=self.version,
                timestamp=datetime.now(timezone.utc),
                request={
                    "hazard_probability": hazard_probability,
                    "loss_ratio_min": loss_ratio_min,
                    "loss_ratio_mode": loss_ratio_mode,
                    "loss_ratio_max": loss_ratio_max,
                    "exposure_value": exposure_value,
                },
                response={**result_v1.model_dump(mode="json"), "engine_mode": result_v1.engine_mode},
                profile=self.scorer.profile.__class__.__name__,
                debug=bool(result_v1.monte_carlo.loss_distribution_sample),
            )
            self.audit_logger.log(event)

        return result_v1

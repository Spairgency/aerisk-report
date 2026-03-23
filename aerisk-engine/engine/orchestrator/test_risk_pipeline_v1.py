from engine.orchestrator.risk_pipeline import RiskPipelineV1
from engine.contracts.output_v1 import RiskResultV1
from engine.audit.logger_v1 import AuditLoggerV1
from pathlib import Path


def test_risk_pipeline_v1_end_to_end_with_audit(tmp_path: Path):
    audit_dir = tmp_path / "audit"
    logger = AuditLoggerV1(storage_path=str(audit_dir))

    pipeline = RiskPipelineV1(audit_logger=logger)

    result = pipeline.run(
        hazard_probability=0.3,
        loss_ratio_min=0.1,
        loss_ratio_mode=0.25,
        loss_ratio_max=0.5,
        exposure_value=10000.0,
    )

    assert isinstance(result, RiskResultV1)

    assert result.engine_version is not None
    assert result.aal >= 0.0
    assert result.var_95 >= 0.0
    assert result.pml_95 >= 0.0

    assert result.risk_level in {"LOW", "MEDIUM", "HIGH"}
    assert result.risk_score == result.aal

    log_file = audit_dir / "events.log"
    assert log_file.exists()
    assert log_file.read_text().strip() != ""

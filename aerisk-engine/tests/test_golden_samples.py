import json
from pathlib import Path

from engine.contracts.output_v1 import RiskResultV1


BASE_DIR = Path(__file__).resolve().parents[1]
REQUEST_PATH = BASE_DIR / "examples" / "requests" / "compute_risk_orchard_frost_md.json"
RESPONSE_PATH = BASE_DIR / "examples" / "responses" / "compute_risk_orchard_frost_md_dummy.json"


def test_golden_sample_response_schema():
    """
    Golden Sample Contract Test (ENGINE).
    If this test fails, RiskResultV1 contract has been broken.
    """

    assert RESPONSE_PATH.exists(), "Golden response file missing"
    assert REQUEST_PATH.exists(), "Golden request file missing"

    with open(RESPONSE_PATH, "r") as f:
        response_payload = json.load(f)

    # STRICT contract validation
    model = RiskResultV1.model_validate(response_payload)

    # Minimal semantic sanity checks
    assert model.summary.risk_score >= 0
    assert model.summary.risk_level in {"LOW", "MEDIUM", "HIGH"}
    assert model.hazard.overall_probability >= 0
    assert model.monte_carlo.aal >= 0

from fastapi.testclient import TestClient
from engine.services.api import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"


def test_risk_endpoint_v1_default_profile():
    payload = {
        "hazard_probability": 0.3,
        "loss_ratio_min": 0.1,
        "loss_ratio_mode": 0.25,
        "loss_ratio_max": 0.5,
        "exposure_value": 10000.0,
        "profile": "default",
        "debug": False,
    }

    response = client.post("/risk", json=payload)
    assert response.status_code == 200

    data = response.json()

    assert "metadata" in data
    assert "engine_version" in data["metadata"]

    assert "summary" in data
    assert "risk_level" in data["summary"]
    assert "risk_score" in data["summary"]

    assert "monte_carlo" in data
    assert "aal" in data["monte_carlo"]
    assert "var_95" in data["monte_carlo"]
    assert "pml_95" in data["monte_carlo"]

    assert data["summary"]["risk_level"] in {"LOW", "MEDIUM", "HIGH"}
    assert data["summary"]["risk_score"] == data["monte_carlo"]["aal"]

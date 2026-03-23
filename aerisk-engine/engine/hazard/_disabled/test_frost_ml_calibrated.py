import pytest

from engine.hazard.features_frost import FrostFeatures
from engine.hazard.frost_v1 import FrostHazardModelV1


def test_frost_ml_with_calibration():
    model = FrostHazardModelV1()

    X = [
        FrostFeatures(-7.0, 10.0, 30.0, 0.0, 4.0, 85.0, 0.2),
        FrostFeatures(-2.0, 2.0, 4.0, 2.0, 1.5, 60.0, 0.8),
        FrostFeatures(-5.0, 6.0, 18.0, 1.0, 3.0, 75.0, 0.4),
        FrostFeatures(-1.0, 1.0, 1.5, 3.0, 1.0, 55.0, 0.9),
    ]
    y = [1, 0, 1, 0]

    # fit ML model
    model.fit(X, y)

    # collect raw probabilities
    raw_probs = [model.predict_proba(x) for x in X]

    # fit calibrator on raw probabilities
    model.fit_calibrator(raw_probs, y)

    # calibrated probabilities
    calibrated_probs = [model.predict_proba(x) for x in X]

    assert len(calibrated_probs) == len(raw_probs)

    for p in calibrated_probs:
        assert isinstance(p, float)
        assert 0.0 <= p <= 1.0

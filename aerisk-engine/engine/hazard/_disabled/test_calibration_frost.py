import pytest

from engine.hazard.calibration_frost import FrostProbabilityCalibrator


def test_frost_probability_calibration():
    calibrator = FrostProbabilityCalibrator()

    y_proba = [0.1, 0.2, 0.8, 0.9]
    y_true = [0, 0, 1, 1]

    # calibrate before fit should fail
    with pytest.raises(RuntimeError):
        calibrator.calibrate(y_proba)

    result = calibrator.fit(y_proba, y_true)

    assert result.fitted is True
    assert result.method == "isotonic"

    calibrated = calibrator.calibrate(y_proba)

    assert isinstance(calibrated, list)
    assert len(calibrated) == len(y_proba)
    for p in calibrated:
        assert 0.0 <= p <= 1.0

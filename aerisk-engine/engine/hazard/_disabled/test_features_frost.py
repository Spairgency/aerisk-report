

import pytest

from engine.hazard.features_frost import FrostFeatures
from engine.hazard.frost_v1 import FrostHazardModelV1


def test_frost_features_to_model_integration():
    features = FrostFeatures(
        min_temperature_c=-5.0,
        hours_below_zero=6.0,
        frost_degree_hours=18.0,
        soil_temperature_c=1.0,
        wind_speed_ms=2.5,
        relative_humidity=85.0,
        phenological_stage=0.3,
    )

    model = FrostHazardModelV1()

    # predict before fit should fail
    with pytest.raises(RuntimeError):
        model.predict_proba(features)

    # fit with correct feature list
    model.fit([features], [1])

    prob = model.predict_proba(features)

    assert isinstance(prob, float)
    assert 0.0 <= prob <= 1.0
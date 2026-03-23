import pytest

from engine.hazard.frost_v1 import FrostHazardModelV1


def test_frost_hazard_model_contract():
    model = FrostHazardModelV1()

    X = [1, 2, 3]
    y = [0, 1, 0]

    # predict before fit should fail
    with pytest.raises(RuntimeError):
        model.predict_proba(X)

    # fit should work
    model.fit(X, y)

    prob = model.predict_proba(X)

    assert isinstance(prob, float)
    assert 0.0 <= prob <= 1.0
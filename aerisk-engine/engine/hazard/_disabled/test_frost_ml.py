

import numpy as np

from engine.hazard.features_frost import FrostFeatures
from engine.hazard.frost_v1 import FrostHazardModelV1


def test_frost_ml_sanity():
    model = FrostHazardModelV1()

    X = [
        FrostFeatures(-6.0, 8.0, 24.0, 0.5, 3.0, 80.0, 0.2),
        FrostFeatures(-1.0, 1.0, 2.0, 2.0, 1.0, 60.0, 0.8),
    ]
    y = [1, 0]

    model.fit(X, y)

    p1 = model.predict_proba(X[0])
    p2 = model.predict_proba(X[1])

    assert isinstance(p1, float)
    assert isinstance(p2, float)
    assert 0.0 <= p1 <= 1.0
    assert 0.0 <= p2 <= 1.0
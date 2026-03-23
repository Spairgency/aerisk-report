from engine.hazard.baseline import BaselineHazardModel


def test_baseline_hazard_model():
    model = BaselineHazardModel()

    X = [1, 2, 3, 4]          # dummy features (ignorate)
    y = [0, 1, 1, 0]          # 50% hazard

    model.fit(X, y)
    prob = model.predict_proba(X)

    assert 0.0 <= prob <= 1.0
    assert abs(prob - 0.5) < 1e-6
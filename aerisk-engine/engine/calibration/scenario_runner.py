import json
from pathlib import Path
from typing import Dict, Any, List

from engine.orchestrator.risk_pipeline import RiskPipeline
from app.schemas.input import RiskComputationRequest
from app.schemas.output import ComputeRiskResponse


class ScenarioRunner:
    """
    Rulează scenarii canonice (golden) prin RiskPipeline
    și validează output-ul la nivel structural + logic de bază.
    """

    def __init__(self):
        self.pipeline = RiskPipeline()

    def load_scenario(self, path: Path) -> Dict[str, Any]:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def run_scenario(self, scenario_path: Path) -> ComputeRiskResponse:
        scenario_file = self.load_scenario(scenario_path)

        # Format canonic:
        # {
        #   "description": "...",
        #   "rules_version": "...",
        #   "scenarios": [
        #       { "id": "...", "request": {...}, "expected": {...} }
        #   ]
        # }

        if "scenarios" in scenario_file:
            scenario = scenario_file["scenarios"][0]
            request_payload = scenario["request"]
        else:
            # fallback pentru golden samples simple
            request_payload = scenario_file.get("request", scenario_file)

        request = RiskComputationRequest.model_validate(request_payload)
        response = self.pipeline.run(request)

        if isinstance(response, ComputeRiskResponse):
            return response

        return ComputeRiskResponse.model_validate(response)

    def run_all(self, scenarios_dir: Path) -> List[ComputeRiskResponse]:
        results = []

        for scenario_file in sorted(scenarios_dir.glob("*.json")):
            print(f"▶ Running scenario: {scenario_file.name}")
            result = self.run_scenario(scenario_file)
            results.append(result)
            print("  ✔ OK")

        return results


if __name__ == "__main__":
    scenarios_path = Path("examples/scenarios")
    runner = ScenarioRunner()
    runner.run_all(scenarios_path)
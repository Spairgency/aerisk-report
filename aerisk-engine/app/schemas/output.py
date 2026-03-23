"""
DEPRECATED – DO NOT USE AS SOURCE OF TRUTH

This file exists ONLY as an API adapter layer.
The single source of truth for output is:
engine/contracts/output_v1.py (RiskResultV1)

DO NOT define business logic or duplicate schemas here.
"""

from engine.contracts.output_v1 import RiskResultV1

# API Response Alias (Thin Adapter)
ComputeRiskResponse = RiskResultV1

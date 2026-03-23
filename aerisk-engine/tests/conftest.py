"""
Pytest configuration for AERISK Engine.

Scop:
- Asigură că root-ul proiectului este în PYTHONPATH
- Permite importuri de tip `app.*` și `engine.*` în teste
"""

import sys
from pathlib import Path

# Root-ul proiectului (aerisk-engine)
PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

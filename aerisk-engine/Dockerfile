# ================================
# AERISK-ENGINE — Production Image
# ================================

FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (minimal)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc curl \
    && rm -rf /var/lib/apt/lists/*

# Copy source
COPY engine /app/engine
COPY app /app/app
COPY tests /app/tests
COPY pytest.ini /app/
COPY README.md /app/

# Install runtime deps explicitly
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    pydantic \
    numpy \
    scipy \
    matplotlib \
    python-json-logger \
    PyYAML

# Expose API
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD curl -f http://127.0.0.1:8000/health || exit 1

# Run engine
CMD ["uvicorn", "engine.services.api:app", "--host", "0.0.0.0", "--port", "8000"]
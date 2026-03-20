# ================================
# AERISK PRO LAB — Dev Image (Vite)
# ================================
# Build context: aerisk-pro-lab/
#
# VITE_API_TARGET env var overrides the default proxy backend URL.
# In docker-compose it is set to http://aerisk-backend:8000.

FROM node:22-alpine

WORKDIR /app

# Install deps first (layer cache optimization)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 5174

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
    CMD wget -qO- http://127.0.0.1:5174/ > /dev/null 2>&1 || exit 1

# --host 0.0.0.0 is required to expose Vite outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

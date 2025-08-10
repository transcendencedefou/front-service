FROM node:20-bullseye-slim

WORKDIR /app

# Éviter binaire natif Rollup + compat multi-arch
ENV ROLLUP_SKIP_NODE_NATIVE=1
ENV ROLLUP_SKIP_NODE_NATIVE=true

# Packages de base + netcat
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git build-essential python3 netcat-openbsd \
  && rm -rf /var/lib/apt/lists/*

# Copier uniquement package.json (pas le lock pour régénération selon l'architecture arm/x64)
COPY package.json ./
# S'assurer qu'aucun ancien lock ne traîne
RUN rm -f package-lock.json

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./

# Installation propre (sans audit) + déduplication
RUN npm install --no-audit --no-fund && npm dedupe \
  && node -e "console.log('Arch:',process.arch,'Platform:',process.platform)" \
  && node -e "try{require('@rollup/rollup-linux-arm64-gnu');console.log('Binary rollup arm64 présent')}catch{console.log('Binary rollup arm64 absent -> fallback JS')}" || true

# Copier le code source
COPY src/ ./src/
COPY index.html ./
COPY docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./docker-entrypoint.sh"]

FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY src/ ./src/
COPY index.html ./
COPY docker-entrypoint.sh ./

# Rendre le script exécutable
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3004

ENTRYPOINT ["./docker-entrypoint.sh"]

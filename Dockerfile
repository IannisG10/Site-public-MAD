# ============================================================
# Stage 1 — Builder
# Installe toutes les dépendances et compile l'application Angular SSR
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances en premier (cache Docker)
COPY package.json package-lock.json ./

# Installer toutes les dépendances (dev inclus, nécessaires pour ng build)
RUN npm ci

# Copier le reste du code source
COPY . .

# Compiler l'application en mode production
# Génère dist/site-public/browser/ et dist/site-public/server/
RUN npm run build

# ============================================================
# Stage 2 — Runner
# Image finale légère avec uniquement le dist + dépendances de prod
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Copier uniquement les manifests de dépendances
COPY package.json package-lock.json ./

# Installer uniquement les dépendances de production (Express, etc.)
RUN npm ci --omit=dev

# Copier le dossier dist compilé depuis le stage builder
COPY --from=builder /app/dist ./dist

# Exposer le port utilisé par le serveur Express
EXPOSE 4000

# Variable d'environnement pour le port (peut être surchargée au runtime)
ENV PORT=4000

# Lancer le serveur SSR
CMD ["node", "dist/site-public/server/server.mjs"]

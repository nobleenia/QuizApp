# Build React frontend
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

ENV npm_config_registry=https://registry.npmjs.org/ \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_progress=false

COPY frontend/package.json ./
RUN npm install --no-audit --no-fund

COPY frontend ./
RUN npm run build


# Production backend
FROM node:20-alpine AS production

WORKDIR /app/backend

ENV NODE_ENV=production \
    npm_config_registry=https://registry.npmjs.org/ \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_progress=false

COPY backend/package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY backend ./
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 5000
EXPOSE 10000

CMD ["node", "index.js"]

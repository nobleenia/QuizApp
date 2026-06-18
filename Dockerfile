# Multi-stage Docker build for QuizApp
# Stage 1: build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: production API + static frontend
FROM node:20-alpine AS production
WORKDIR /app/backend
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --omit=dev
RUN mkdir -p node_modules/hasown \
    && echo '{"name":"hasown","version":"2.0.2","main":"index.js"}' > node_modules/hasown/package.json \
    && printf "'use strict';\nmodule.exports = Function.call.bind(Object.prototype.hasOwnProperty);\n" > node_modules/hasown/index.js
COPY backend ./
COPY --from=frontend-build /app/frontend/build ./public
EXPOSE 10000
CMD ["node", "index.js"]

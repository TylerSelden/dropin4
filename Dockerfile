FROM node:22-slim AS build
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN npm ci

COPY . .
RUN npm run build
RUN npm prune --omit=dev


FROM node:22-slim
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
COPY --from=build /app/node_modules ./node_modules

COPY backend ./backend
COPY shared ./shared
COPY --from=build /app/frontend/dist ./frontend/dist

CMD ["npm", "start"]

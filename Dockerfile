# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0
ARG PORT=3001

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Tahap build
FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Tahap runtime minimal
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=${PORT}
ENV HOST=0.0.0.0

COPY --from=build /app/.output /app/.output
# Jika butuh node_modules tersisa (biasanya tidak), tambahkan:
# COPY --from=build /app/node_modules ./node_modules

EXPOSE ${PORT}
CMD ["node", ".output/server/index.mjs"]

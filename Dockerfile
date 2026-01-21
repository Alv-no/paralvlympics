FROM node:25-alpine AS build

WORKDIR /app
RUN npm install -g --force corepack
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build


FROM nginx:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/entry-point.sh /docker-entrypoint.d/

EXPOSE 80

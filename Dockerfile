FROM node:25-alpine AS build

WORKDIR /app
RUN npm install -g --force corepack
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build


FROM nginx:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

# Email allowlist gate + SPA history fallback
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

ENV ASSET_DIR=/usr/share/nginx/html
ENV APP_PREFIX=PREFIX_
# Copy the runtime injection script into the container
COPY env.sh /docker-entrypoint.d/env.sh
RUN dos2unix /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Let Docker run your script before starting Nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80

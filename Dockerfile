FROM public.ecr.aws/docker/library/node:16-alpine

ARG NODE_ENV=dev
ARG VERSION=dev

RUN apk add --no-cache ca-certificates tzdata curl && \
    update-ca-certificates && \
    cp /usr/share/zoneinfo/Asia/Singapore /etc/localtime

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

COPY . /app

RUN cd /app && \
    cp -rf ./dist/standalone/.next ./.next && \
    cp -rf ./dist/standalone/package.json ./package.json && \
    cp -rf ./dist/standalone/node_modules ./node_modules && \
    cp -rf ./dist/static ./.next/static && \
    rm -rf ./dist

WORKDIR /app

ENV TZ=Asia/Singapore \
    NODE_ENV=$NODE_ENV \
    HOST=0.0.0.0 \
    PORT=8080 \
    VERSION=$VERSION

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -fs http://localhost:8080/status/index.html || exit 1

CMD ["node", "server.js"]

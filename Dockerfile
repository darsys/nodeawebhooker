# This stage installs our modules
FROM node:latest as dev
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:17-alpine as prod

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app
COPY --from=0 /app .
COPY . .
CMD ["node", "server.js"]
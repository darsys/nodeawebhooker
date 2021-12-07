ARG VARIANT="16"
FROM mhart/alpine-node:${VARIANT}

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python3
# RUN apk add --no-cache openssh-client
RUN apk add --no-cache tini

# This stage installs our modules
WORKDIR /app
COPY package.json ./

RUN yarn install --prod

# Then we copy over the modules from above onto a `slim` image
FROM mhart/alpine-node:slim-${VARIANT}

# If possible, run your container using `docker run --init`
# Otherwise, you can use `tini`:
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

EXPOSE 3000

WORKDIR /app
COPY --from=0 /app .
COPY . .
CMD ["node", "server.js"]
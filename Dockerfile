FROM   ghcr.io/puppeteer/puppeteer:23.11.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /src

COPY  package*.json ./
RUN npm ci
COPY  . .
CMD [ "node","dist/Server.js" ]
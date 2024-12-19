# Use a base image that supports Chrome installation
FROM ghcr.io/puppeteer/puppeteer:16.1.0

# Install dependencies and Chrome


# Set the PUPPETEER_EXECUTABLE_PATH environment variable
ENV  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

CMD ["node", "dist/Server.js"]

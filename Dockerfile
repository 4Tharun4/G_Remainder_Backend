# Use a base image that supports Chrome installation
FROM node:18-slim

# Install dependencies and Chrome
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libnss3 \
    libxss1 \
    xdg-utils \
    google-chrome-stable \
    --no-install-recommends

# Set the PUPPETEER_EXECUTABLE_PATH environment variable
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

CMD ["node", "dist/Server.js"]

FROM ghcr.io/puppeteer/puppeteer:23.11.0

# Install necessary dependencies for running puppeteer in a headless environment
RUN apt-get update && \
    apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libnss3 \
    libxss1 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy the package.json and package-lock.json first to leverage Docker's cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN npm run build

# Start the app
CMD ["node", "dist/Server.js"]

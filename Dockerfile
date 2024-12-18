FROM ghcr.io/puppeteer/puppeteer:23.11.0

# Install necessary dependencies for Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libnss3 \
  libxss1 \
  xdg-utils \
  --no-install-recommends

# Download and install Chrome manually
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
  dpkg -i google-chrome-stable_current_amd64.deb && \
  apt-get install -f

# Set the correct executable path for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies and build the project
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Start the application
CMD ["node", "dist/Server.js"]

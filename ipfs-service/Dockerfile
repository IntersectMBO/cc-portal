# Use the official Node.js 22 image as the base image
FROM node:22

# Install build dependencies for native modules
RUN apt-get update && \
    apt-get install -y build-essential cmake && \
    rm -rf /var/lib/apt/lists/*

# Upgrade npm to the latest version
RUN npm install -g npm@latest

# Set the memory limit and max listeners
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the ports that the application will run on
EXPOSE 3001
EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 5001
EXPOSE 8080

# Build the application
RUN npm run build

# Start the application
CMD [ "npm", "run", "start:dev" ]

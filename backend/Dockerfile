# Stage 1: Build
FROM node:20-alpine as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# If you use yarn, uncomment the next line
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# If you use yarn, replace the above RUN command with:
# RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build
# If you use yarn, replace the above RUN command with:
# RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

# Create app directory and set as workdir
WORKDIR /home/node/app

# Ensure all files and folders under /home/node are owned by 'node' user
# Adjust ownership and permissions
USER root
RUN mkdir -p /home/node/app && \
    chown -R node:node /home/node

# Copy build artifacts and package.json from builder stage
# Ensure files are owned by 'node' user
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
# If you use yarn, you also need to copy yarn.lock:
# COPY --from=builder --chown=node:node /usr/src/app/yarn.lock ./

# Install only production dependencies
RUN npm install --only=production
# If you use yarn, replace the above RUN command with:
# RUN yarn install --production --frozen-lockfile

# Set user to non-root 'node'
USER node

# Open desired port
EXPOSE 3000

# Run your app
CMD ["npm", "run", "start:prod"]

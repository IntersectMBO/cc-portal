# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

EXPOSE 5432
EXPOSE 6379

RUN npm run build

# Start the application
# Removed start:prod because dist/main doesn't exist
CMD [ "npm", "run", "start:dev" ] 
# Build the application


# Set the environment variables
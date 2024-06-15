# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY . .

RUN rm -rf node_modules
RUN rm -rf package-lock.json

# Install the project dependencies
RUN npm install

RUN npm install --build-from-source node-datachannel


# Expose the port that the application will run on
EXPOSE 3001
EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 5001
EXPOSE 8080

RUN npm run build

# Start the application
CMD [ "npm", "run", "start:dev" ]

# 🚀 Backend setup

## Table of content:

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Tech stack](#tech-stack)
- [Running locally](#running-locally)
- [Running using docker compose](#running-using-docker-compose)
- [Directory structure](#directory-structure)
- [API documentation](#api-documentation)

## Introduction

This document provides instructions for setting up and running the backend part of the application. The backend is developed using Strapi, a headless CMS that leverages Node.js for server-side operations. Strapi offers an easily manageable admin panel alongside RESTful or GraphQL API capabilities. For this project, we are specifically using PostgreSQL as our database due to its robustness, scalability, and reliability. The following setup instructions will guide you through configuring Strapi to work seamlessly with PostgreSQL, ensuring a solid foundation for your application's data management needs.

## Prerequisites

- Node.js installed - [Download link](https://nodejs.org/en/download/).
- PostgreSQL installed (if running locally without Docker) - [Download link](https://www.postgresql.org/).
- Docker and Docker Compose installed (for Docker environment) - [Download link](https://docs.docker.com/get-started/)

## Tech stack:

**Server:** [Node](https://nodejs.org/en/about/), [Strapi](https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html)

**Database:** [PostgreSQL](https://www.postgresql.org/)

**Container:** [Docker](https://docs.docker.com/get-started/)

## Running locally

To get your Strapi backend up and running locally, follow these steps:

1. **Navigate to the backend directory:**

   - Open a terminal and change your current directory to the backend part of your application using `cd backend`.

2. **Install dependencies:**

   - Run `npm install` to install all required dependencies. This command reads the `package.json` file and installs all the libraries and packages listed under dependencies and devDependencies.

3. **Configure environment variables:**

   - Create a `.env` file in the root directory of your backend. This file should contain all the necessary environment configurations for your project. Use the `.env.example` as a template if your project includes one. For a Strapi project using PostgreSQL, you should at least configure the following variables:
     - `DATABASE_HOST`: The hostname of your PostgreSQL server.
     - `DATABASE_PORT`: The port on which your PostgreSQL server is running (typically 5432).
     - `DATABASE_NAME`: The name of your PostgreSQL database.
     - `DATABASE_USERNAME`: Your database user's username.
     - `DATABASE_PASSWORD`: The password for your database user.
   - Make sure your PostgreSQL database is accessible with these credentials.

4. **Run strapi in development mode:**

   - Use `npm run develop` to start your Strapi backend in development mode. This mode activates the auto-reload feature, allowing you to see changes in real-time without manually restarting the server.
   - Once Strapi is running, you can access the admin panel by navigating to `http://localhost:1337/admin` in your web browser. Here, you'll be prompted to create an admin user on your first visit.

5. **Start the backend in production mode (Optional):**
   - If you need to simulate a production environment locally, you can start your backend using `npm run start`. This command runs Strapi without the development mode's auto-reload feature, simulating how your application will run in a production environment.

### Important notes:

- Before running your Strapi backend, ensure that your PostgreSQL database is set up and that the `.env` file correctly points to this database.
- In development mode, you might encounter additional prompts to migrate or update your database schema, especially after making changes to your content types through the Strapi admin panel. Follow the on-screen instructions to complete these updates.

By following these steps, you can effectively run and develop your Strapi backend with a PostgreSQL database on your local machine.

## Running using docker compose

Docker Compose facilitates the running of multi-container Docker applications. By using a `docker-compose.yaml` file, you can configure your application’s services, networks, and volumes in a single file, then start all services with a single command. For our Strapi backend, which uses PostgreSQL as the database, Docker Compose simplifies the process of starting the backend alongside the database and any other services your application might need.

### Prerequisites:

- Docker and Docker Compose installed on your machine.
- Basic knowledge of Docker concepts.

### Steps to run:

1. **Locate the `docker-compose.yaml` File:**

   - Ensure you are in the project's root directory, where the `docker-compose.yaml` file resides. This file orchestrates the setup of the entire application, including the Strapi backend service, the PostgreSQL database service, and the Next.js frontend service. By defining these services, the `docker-compose.yaml` file facilitates an integrated environment where each component of the application—backend, database, and frontend—can operate cohesively.

2. **Review and update the docker compose configuration:**

   - Open the `docker-compose.yaml` file and review the configurations. Make sure the Strapi service has the correct volume mappings to persist data and is configured to communicate with the PostgreSQL service. The PostgreSQL service should have environment variables (`POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD`) that match those expected by your Strapi application.

3. **Environment variables:**

   - If your Strapi application requires specific environment variables, ensure they are defined within the Docker Compose file under the `environment` section of the Strapi service or through an `.env` file referenced in the compose file.

4. **Starting the services:**

   - From the terminal, run `docker-compose up` to start all services defined in the `docker-compose.yaml` file. If you prefer to run the services in the background, use `docker-compose up -d`.

5. **Accessing the strapi admin panel:**
   - Once the services are up and running, you can access the Strapi admin panel by navigating to `http://localhost:1337/admin` on your web browser. The first time you access it, you'll be prompted to create an admin user.

### Shutting down services:

- To stop and remove all the running services, use `docker-compose down`. If you want to preserve the data in your volumes, make sure not to use the `-v` flag with this command.

By following these steps, you can smoothly run your Strapi backend with PostgreSQL and any other necessary services using Docker Compose, ensuring a consistent and isolated environment for development and testing.

## Directory structure

The `backend` folder of a Strapi v4 project contains several important directories and files that structure the application. Here is an overview of some of the key components:

- **`api/`**: This directory houses the models, services, and controllers for your application's various entities. Each subdirectory within `api/` corresponds to a specific content type created in Strapi, containing files that define the structure (models), business logic (services), and the API endpoints (controllers).

- **`config/`**: Contains configuration files for various aspects of your Strapi application. This includes database settings, plugin configurations, middleware settings, and more. Key files include `database.js` for database configuration, `server.js` for server settings, and `plugin.js` for plugin configuration.

- **`extensions/`**: Used for extending or overriding the default behavior of Strapi's core functionalities and plugins. Any customizations to the admin panel or modifications to plugin logic are placed here.

- **`.env`**: An environment variables file where you can store sensitive or environment-specific settings, such as database credentials, API keys, or other configuration options that shouldn't be hard-coded into your application files.

- **`public/`**: This directory is meant for static files that need to be publicly accessible. Files placed here can be accessed directly via the web server without any processing by Strapi.

- **`node_modules/`**: Houses all the npm packages and dependencies your project needs, installed based on the `package.json` file.

- **`package.json`**: Defines the project dependencies, scripts, and general metadata about the project. This includes scripts for starting the server, installing dependencies, and other command-line tasks.

## API documentation

Our project leverages the Strapi Documentation plugin to automatically generate comprehensive API documentation. This documentation provides an in-depth look at all available API endpoints, including request methods, expected parameters, and response formats, facilitating easier integration and use of the API.

### Accessing the documentation

To access the API documentation:

1. **Ensure the documentation plugin is installed and configured:**

   - The Documentation plugin should already be part of your Strapi project. If it's not, you can add it by running `npm install @strapi/plugin-documentation` and restarting your Strapi server.

2. **Navigate to the documentation URL:**

   - Once the plugin is installed, Strapi automatically generates the documentation and serves it at a URL path relative to your API's base URL. By default, this path is `/documentation`.

3. **Using Swagger UI:**

   - The Strapi Documentation plugin utilizes Swagger UI for presenting the documentation. When you navigate to the documentation URL, you will see a Swagger interface that allows you to explore different API endpoints, their request methods, parameters, and responses. You can also try out API calls directly from this interface.

4. **Customizing your documentation:**
   - The Documentation plugin offers customization options to tailor the generated documentation to your needs. You can configure things like the documentation's title, description, and version, as well as more detailed settings for each endpoint. These customizations can be made within the plugin's configuration file.

### Benefits of using strapi documentation plugin

- **Automated documentation:** Automatically generates up-to-date documentation for your API, saving time and reducing errors.
- **Interactive exploration:** Allows developers to interact with the API directly from the documentation, facilitating testing and integration.
- **Customizable:** Offers options to customize the documentation to fit the branding and specific needs of your project.

Remember to regularly update your documentation as you modify your API to ensure that it accurately reflects the latest changes and capabilities.

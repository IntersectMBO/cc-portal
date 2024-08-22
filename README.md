# Constitution Committee Portal

Welcome to the official repository for the Constitution Committee Portal.

The primary purpose of the solution is to host the Cardano Constitution and allow anyone to get familiar with it and follow its evolution over time. It also serves as the single point of truth for the Cardano Community members to see how Constitutional Committee members voted on a specific Governance Action, with the inclusion of their rationale. For members of the Constitutional Committee, it serves as a portal to add reasoning to their votes and prepare it as an off-chain resource to be attached to on-chain governance actions.

## Table of content:

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Environment Variables](#environment-variables) 
- [API Documentation](#api-documentation)
- [License](#license)

## Introduction

This document serves as a comprehensive guide for setting up the full stack of our application, which includes the Frontend, Backend, Database, Caching, Worker and IPFS components.

## Prerequisites

- Node.js installed - [Download link](https://nodejs.org/en/download/).
- Docker and Docker Compose installed - [Download link](https://docs.docker.com/get-started/)

## Tech stack:

**Frontend:** [Next.js](https://nextjs.org/)

**Backend:** [Node](https://nodejs.org/en/about/), [Nest.js](https://nestjs.com/)

**Database:** [PostgreSQL](https://www.postgresql.org/)

**Caching service:** [Redis](https://redis.io/docs)

**Worker service:** [Nest.js](https://nestjs.com/)

**Helia IPFS/IPNS node:** [Helia](https://github.com/ipfs/helia), [Nest.js](https://nestjs.com/)

### Frontend

The Frontend is developed with Next.js, a React framework that allows for server-side rendering and static site generation. This choice enables us to create fast, SEO-friendly web pages that integrate seamlessly with our Nest.js backend.

The instructions that follow will guide you through setting up each component of our application stack, ensuring a cohesive development and deployment process.

### Backend

Our Backend is powered by Nest.js on Node.js. It offers REST APIs with a publicly available OpenAPI specification. IIt handles all requests coming from the Frontend.

### Database

For data persistence, we utilize PostgreSQL, known for its robustness, scalability, and reliability. This choice ensures that our application's data layer is secure, efficient, and capable of handling growth. It contains the main object data required for operation such as CC members (users), Governance Action Proposals and voting data.

### Caching service

We utilize Redis service to reduce the load on a Backend database by caching responses for quick retrieval.

### Worker service

The Worker service is powered by Nest.js on Node.js. It is used to synchronize with on-chain data changes, specifically governance actions. It is also used to monitor CC members' voting activity on governance actions. It is used to keep track of reasoning URLs that are attached to the CC vote to synchronize the information with the blockchain. Moreover, it is used to rely on it to track CC voting activities.

### IPFS/IPNS Helia node

The IPFS node is powered by Nest.js with Helia JS library. This service is used to store the Constitution. IPFS relies on hashes of the document to generate URLs, so each revision has a unique hash by default, while IPNS always points to the hash of the latest revision and acts as a regular web domain. The Constitution Page contains a cached version of what is on IPFS as IPFS is good as an immutable store of data but slow for a high number of concurrent users.

## Getting started

Before you begin setting up the application, you'll need to clone the repository from GitHub to get a local copy of the code. Follow these steps to clone the repository and start setting up the application components:

1. **Clone the Repository:**

   - Open a terminal on your computer.
   - Navigate to the directory where you want to store the project.
   - Run the following command to clone the repository:
     ```
     git clone https://github.com/IntersectMBO/cc-portal.git
     ```

2. **Navigate to the Project Directory:**

   - After cloning, change into the project's root directory:
     ```
     cd cc-portal
     ```
     This directory contains all the files you need to set up the application, including the Docker Compose file and the separate directories for the frontend, backend, ipfs and worker components.

3. **Configure Environment Variables:**

   - Navigate to the `backend` directory and run the following command:
     ```
     cp example.env .env
     ```
     Edit the .env file to reflect your local settings. Env variables description can be found [below](#environment-variables).
   - Run this command within folders: `frontend`, `worker-service`, `ipfs-service` to configure environment variables for all these services. Edit every .env file to reflect your local settings.
     Important: for `worker-service` environment variables ensure the right credentials for connection to DB-SYNC Database 

4. **Docker Setup:**

   - Change your directory to the root of your project where the `docker-compose.yaml` file is located.
   - Execute the following command to start up all the services as defined in your `docker-compose.yaml` file.
     ```
     docker-compose up --build -d
     ```

5. **Database migration:**

   - Run the following commands:
     1. Navigate to the backend docker container
     ```
     docker container exec -it backend bash
     ```
     2. Run script for migrations
     ```
     npm run typeorm:run-migrations
     ```
     3. Exit from the backend docker container
     ```
     exit
     ```

6. **Create Super Admin**
   A Super Admin should be created manually. To do that, run the following SQL queries on the Backend PostgreSQL database:
   1. Create super admin user with valid email address
   ```
   INSERT INTO users (email, status, role_id) VALUES ('your@email.com', 'active', (SELECT r.id FROM roles r WHERE r.code='super_admin'));
   ```
   2. Add permissions to super admin
   ```
   INSERT INTO user_permissions(user_id, permission_id)
   SELECT users.id, permissions.id
   FROM permissions
   INNER join users on users.email 
   IN ('your@email.com')
   WHERE code IN ('manage_admins', 'manage_cc_members', 'add_constitution_version');
   ```

## Usage

If the installation process passes successfully, the CC Portal is ready to use.
   - Frontend should be available on the URL: `http://localhost:3000`.
   - Backend shoul be available on the URL: `http://localhost:1337`.

## Environment Variables

Below is a description of the environment variables used in the `.env` file:

1. **Frontend:**

   - `NEXT_PUBLIC_API_URL`: Url of the Backend service. Example: `http://localhost:1337`.

2. **Backend:**

   - `POSTGRES_DB`: The name of the PostgreSQL database. Example: `cc-portal`.
   - `POSTGRES_HOST`: The hostname for the PostgreSQL database. Example: `postgres`
   - `POSTGRES_PORT`: The port number for the PostgreSQL database. Example: `5432`.
   - `POSTGRES_USERNAME`: Username for accessing the PostgreSQL database. Example: `postgres`.
   - `POSTGRES_PASSWORD`: Password for the PostgreSQL database user. Example: `postgres`.
   - `ENVIRONMENT`: Defines the environment. Example: `local`, `dev`, `stage`, `prod`.
   - `DISPLAY_SWAGGER_API`: Defines whether Swagger will be displayed. Example: `true`, `false`.
   - `BASE_URL`: Domain of the Backend service. Example: `http://locahost:1337`.
   - `MAGIC_LOGIN_SECRET`: Secret key for Magic Login link.
   - `MAGIC_LOGIN_LINK_EXPIRES_IN`: Expiration time for Magic Login link. Example: `5m`.
   - `MAGIC_REGISTER_SECRET`: Secret key for Magic Register link.
   - `MAGIC_REGISTER_LINK_EXPIRES_IN`: Expiration time for Magic Register link. Example: `7d`
   - `ACCESS_SECRET`: Secret key for access tokens.
   - `REFRESH_SECRET`: Secret key for refresh tokens.
   - `JWT_ACCESS_TOKEN_EXPIRES_IN`: Expiration time for JWT access tokens. Example: `15m`.
   - `JWT_REFRESH_TOKEN_EXPIRES_IN`: Expiration time for JWT refresh tokens. Example: `7d`.
   - `REDIS_HOST`: Hostname for Redis. Example `cache`.
   - `REDIS_PORT`: Port number for Redis. Example `6379`.
   - `REDIS_PASSWORD`: Password for Redis. Example `password`.
   - `AWS_ACCESS_KEY_ID`: AWS SES access key id.
   - `AWS_SECRET_ACCESS_KEY`: AWS SES secret access key.
   - `AWS_REGION`: AWS SES region.
   - `EMAIL_FROM`: Email of sender.
   - `NAME_FROM`: Name of sender.
   - `MINIO_ENDPOINT`: Endpoint for Minio. Example: `localhost`.
   - `MINIO_PORT`: Port number for Minio. Example: `9000`.
   - `MINIO_ACCESS_KEY`: Access key for Minio.
   - `MINIO_SECRET_KEY`: Secret key for Minio.
   - `MINIO_USE_SSL`: Dedines whether Minio use SSL. Example `true`, `false`.
   - `MINIO_BUCKET`: Bucket name for Minio.
   - `IPFS_SERVICE_URL`: URL of the IPFS service.Example `http://localhost:3001`.
   - `FE_LOGIN_CALLBACK_URL`: Frontend login callback URL. Example `http://localhost:3000/en/verify/login`.
   - `FE_REGISTER_CALLBACK_URL`: Frontend register callback URL. Example `http://localhost:3000/en/verify/register`.

3. **IPFS service**

   - `LISTEN_TCP_ADDRESS`: Define where the IPFS node should expect and accept connections from other peers over TCP protocol.
   - `LISTEN_WS_ADDRESS`: WebSocket address over TCP protocol.
   - `LISTEN_QUIC_ADDRESS`: Quic-v1 address over UDP protocol.
   - `IPFS_PUBLIC_URL`: The base of public IPFS URL. Example `https://ipfs.io/ipfs/`.
   - `IPNS_PUBLIC_URL`: The base of public IPNS URL. Example `https://ipfs.io/ipns/`.
   - `IPNS_CONSTITUTION_KEY_NAME`: Key name used to generate IPNS peer ID. Example `some-random-string`.

4. **Worker service**

   - `BE_POSTGRES_DB`: The name of the Backend PostgreSQL database. Example: `cc-portal`.
   - `BE_POSTGRES_HOST`: The hostname for the Backend PostgreSQL database. Example: `postgres`
   - `BE_POSTGRES_PORT`: The port number for the Backend PostgreSQL database. Example: `5432`.
   - `BE_POSTGRES_USERNAME`: Username for the Backend PostgreSQL database. Example: `postgres`.
   - `BE_POSTGRES_PASSWORD`: Password for the Backend PostgreSQL database user. Example: `postgres`.
   - `DB_SYNC_POSTGRES_DB`: The name of the Backend PostgreSQL database. Example: `db-sync`.
   - `DB_SYNC_POSTGRES_SCHEMA`: The schema of the DB-Sync PostgreSQL database. Example: `public`
   - `DB_SYNC_POSTGRES_HOST`: The hostname for the DB-Sync PostgreSQL database. Example: `localhost`
   - `DB_SYNC_POSTGRES_PORT`: The port number for the DB-Sync PostgreSQL database. Example: `5432`.
   - `DB_SYNC_POSTGRES_USERNAME`: Username for the DB-Sync PostgreSQL database. Example: `db-sync-user`.
   - `DB_SYNC_POSTGRES_PASSWORD`: Password for the DB-Sync PostgreSQL database user. Example: `db-sync-password`.
   - `REDIS_HOST`: Hostname for Redis. Example `cache`.
   - `REDIS_PORT`: Port number for Redis. Example `6379`.
   - `REDIS_PASSWORD`: Password for Redis. Example `password`.
   - `HOT_ADDRESSES_PER_PAGE`: Password for the DB-Sync PostgreSQL database user. Example: `10`.
   - `GOV_ACTION_PROPOSALS_PER_PAGE`: Password for the DB-Sync PostgreSQL database user. Example: `10`.
   - `VOTES_JOB_FREQUENCY`: Frequency of the job that retrieves votes. Example: `*/30 * * * * *`.
   - `GOV_ACTION_PROPOSALS_JOB_FREQUENCY`: Frequency of the job that retrieves Governance Action Proposals. Example: `0 * * * * *`.

## API Documentation

Access the API documentation at: [http://localhost:1337/api-docs](http://localhost:1337/api-docs).

## License

This project is licensed under the MIT License.
## Description

This is a Worker microservice used for retrieving data from the Cardano db-sync service.
This Worker runs on the NestJS framework and utilizes the Task Scheduler and Queues.

IMPORTANT: Redis is required for the service to work properly.

## ENV Configuration

Copy and paste all content from the example.env file into newly created .env file

## Installation

```bash
$ npm install
```

## Running the service

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
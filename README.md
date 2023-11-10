<p align="center">
  <a href="https://monkeyradio.fr/" target="blank"><img src="https://avatars.githubusercontent.com/u/120142506?s=200&v=4" width="200" alt="Monkey Logo" /></a>
</p>

  <h1 align="center">MonkeyRadio NestJs API</h1>
  <p align="center">

## Description

[Nest](https://github.com/nestjs/nest) framework based API.

Where all the Monkey data passes

## [API Documentation](https://api.monkeyradio.fr/v2/api-doc)

It is very very very import to you to document your work and all the API endpoints

Please read and take notes : [Nest OpenAPI Documentation](https://docs.nestjs.com/openapi/introduction)

## Development

- Clone this repo

- Install node_modules and nest to help your ide
  ```bash
  $ npm install
  # May be run with sudo
  $ npm install @nestjs/cli -g
  ```

- Provide Environment variables by creating a .env file (inspire yourself with .env.example)

  If you copy the example to .env it will do the trick (but please do not use this in production)

- Use Dockerized development environment (with hotreload)
  ```bash
  $ make up
  ```

- To Create a new resource (enpoint)
  ```bash
  $ nest g resource <resourceName>
  ```

- To Create a new migration
  ```bash
  $ make cli
  cli$ npx migrate create <name>
  ```

  Please read the Makefile, you should find many interested things

  Enjoy :)

## Test

### Running entire testsuite

```bash
# unit tests
$ npm run test
```

### Create a test

In this project, we use mongodb and redis so we have to adopt a specific testing strategy so you can use the Makefile to create your ready to use tests files

```bash
$ make create-test
```

## Running the app in Production Mode

You must create a .env file (inspire yourself with .env.example)

Then You can use the docker-compose example

```yaml
version: '3.8'

services:

  cache:
    image: redis:6.2-alpine
    restart: always
    networks:
      - api
    command: redis-server --loglevel warning --requirepass ${REDIS_PASSWORD}

  mongodb:
    image: mongo
    restart: always
    ports:
      - "${EXPOSED_DB_PORT}:27017"
    volumes:
      - monkeyradio-db:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: ${MONGO_DB}
    networks:
      - api

  api:
    image: ghcr.io/MonkeyRadio/Monkey_API:main
    ports:
      - "${EXPOSED_API_PORT}:3000"
    env_file:
      - .env
    depends_on:
      - mongodb
    networks:
      - api

networks:
  api:

volumes:
  monkeyradio-db:
```

```bash
# Using local docker compose with builtin database and cache service
$ docker compose up

# Using prebuilded docker image (you must provide env with mongo and redis connection) 
$ docker run ghcr.io/MonkeyRadio/Monkey_API:<env>
# env can be [main, staging, develop]

# local mode <not recommended> (you must provide env with mongo and redis connection) 
$ npm run start:prod
```

## Migrations

In Production using the ghcr.io/MonkeyRadio/Monkey_API image, the migration is automatically played on startup

```bash
# Using dockerized app
$ make migrate

# Locally
$ npm run migrate
```

## License

Monkey API is Private

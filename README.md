# Kube Pilot Server

## Description

Kube Pilot Server is a server that allows you to deploy your application to a Kubernetes cluster.

## Build Docker Image for Development

```bash
$ docker-compose -f docker-compose.dev.yaml build
```

## Running the app in development mode

```bash
# development
$ docker-compose -f docker-compose.dev.yaml up
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

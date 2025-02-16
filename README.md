# Kube Pilot Server

## Description

Kube Pilot Server is a server that allows you to deploy your application to a Kubernetes cluster.

## Build Image for Development

```bash
$ docker build -f Dockerfile.dev -t
kube-pilot-server .
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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

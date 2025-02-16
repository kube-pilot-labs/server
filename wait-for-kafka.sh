#!/bin/sh
echo "Waiting for Kafka container to be ready..."
while ! nc -z kafka 9092; do
  sleep 5
done
echo "Kafka is ready"
exec "$@" 
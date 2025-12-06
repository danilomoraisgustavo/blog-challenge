#!/bin/bash
set -e

echo "Starting deployment..."

cd ~/blog-challenge/infra

echo "Pulling updated images..."
docker-compose pull

echo "Recreating containers..."
docker-compose up -d

echo "Deployment completed."
docker ps

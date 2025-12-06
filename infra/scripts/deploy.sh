#!/bin/bash
set -euo pipefail

echo "[deploy] Starting deployment..."

# Garante que estamos na pasta infra (onde está o docker-compose.yml)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}/.."

echo "[deploy] Working directory: $(pwd)"
echo "[deploy] Using docker-compose.yml from here."

echo "[deploy] Stopping existing containers..."
docker-compose down || echo "[deploy] No containers to stop (continuing)."

echo "[deploy] Pulling latest images..."
docker-compose pull

echo "[deploy] Starting new containers..."
docker-compose up -d

echo "[deploy] Deployment completed."
echo
echo "[deploy] Current containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

#!/bin/bash
set -e

echo "Initializing EC2 environment..."

sudo apt update -y
sudo apt install -y docker.io docker-compose-plugin git

sudo systemctl enable docker
sudo systemctl start docker

sudo usermod -aG docker ubuntu

echo "Cloning repository..."
git clone https://github.com/danilomoraisgustavo/blog-challenge.git

echo "Setup completed. Review infra/.env before starting services."

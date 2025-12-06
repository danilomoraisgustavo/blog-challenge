# Auto-Generated Blog Platform

Full-Stack • AI Integration • Docker • AWS EC2 • CodeBuild • ECR

A production-oriented blog platform that autonomously generates and publishes articles using AI.  
This project demonstrates full-stack engineering, DevOps practices, cloud deployment, container orchestration, and AI-assisted content creation.

## 1. Live Demo & Repository

**Live Application (EC2):**  
http://56.124.99.8/

**GitHub Repository:**  
https://github.com/danilomoraisgustavo/blog-challenge

## 2. Video Summary (Submission Requirement)

Your final video (30–120 seconds) should include:

- Quick personal intro
- System architecture overview
- Demonstration of automatic article generation
- Explanation of technical decisions
- Improvements you would make with more time

## 3. Project Overview

The platform automatically generates new AI-powered articles every 8 hours.

Technologies used:

- **React + Nginx** (frontend)
- **Node.js + Express + Cron** (backend)
- **PostgreSQL** (database)
- **HuggingFace Inference API** (AI generation)
- **AWS EC2 + Docker Compose** (hosting)
- **AWS CodeBuild + ECR** (CI pipeline)

## 4. Features

### Application Features

- Automatic article generation every 8 hours
- Responsive frontend
- Article listing and detailed view
- AI integration with fallback mode
- Health-check endpoint
- Extensible architecture

### Infrastructure Features

- Full containerization
- Multi-stage Docker builds
- Automated ECR image creation via CodeBuild
- EC2 deployment using docker-compose
- Environment variable configuration

## 5. Architecture Diagram

```
                   ┌──────────────────────────┐
                   │      Frontend (Nginx)     │
                   │  React / Vite build       │
                   └──────────────┬────────────┘
                                  │
                           REST API Calls
                                  │
                   ┌──────────────▼────────────┐
                   │      Backend (Node.js)     │
                   │ Express, Cron, AI Requests │
                   └──────────────┬────────────┘
                                  │
                         PostgreSQL Queries
                                  │
                   ┌──────────────▼────────────┐
                   │        PostgreSQL DB       │
                   └────────────────────────────┘
```

## 6. Repository Structure

```
backend/
  Dockerfile
  src/
    routes/
    services/
    db/
    index.js

frontend/
  Dockerfile
  src/

infra/
  buildspec.yml
  docker-compose.yml
  scripts/
    deploy.sh
    init-ec2.sh

docs/
  ARCHITECTURE.md
```

## 7. Backend API

| Method | Route         | Description       |
| ------ | ------------- | ----------------- |
| GET    | /articles     | List all articles |
| GET    | /articles/:id | Article details   |
| GET    | /health       | Health-check      |

## 8. Cron Job (AI Article Generator)

Runs every 8 hours:

```
0 */8 * * *
```

Pipeline:

1. Requests AI generation
2. Formats response
3. Saves to PostgreSQL
4. Logs operation

Fallback mode ensures reliability when AI API fails.

## 9. Database Schema

### `articles` table:

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| title      | TEXT      |
| content    | TEXT      |
| category   | TEXT      |
| featured   | BOOLEAN   |
| created_at | TIMESTAMP |

## 10. Local Development

### Start

```bash
docker-compose up --build
```

### Access

- Frontend → http://localhost
- Backend → http://localhost:4000

### Stop

```bash
docker-compose down
```

## 11. Deployment on EC2

### SSH

```bash
ssh ubuntu@56.124.99.8
```

### Pull New Images

```bash
cd ~/blog-challenge/infra
docker-compose pull
```

### Restart Services

```bash
docker-compose up -d
docker ps
```

### Health Check

```
http://56.124.99.8/health
```

## 12. Automated CI/CD (GitHub Actions → CodeBuild → EC2)

Pipeline steps:

1. GitHub push
2. CodeBuild builds and pushes images to ECR (latest tag)
3. GitHub Actions deploys by SSH into EC2 and running deploy.sh

### CI/CD Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to EC2 via CodeBuild

on:
  push:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Trigger CodeBuild
        uses: aws-actions/aws-codebuild-run-build@v1
        with:
          project-name: ${{ secrets.CODEBUILD_PROJECT_NAME }}

      - name: Wait for 25 seconds (ECR sync)
        run: sleep 25

      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/blog-challenge/infra
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

## 13. Testing

### Check article list:

```bash
curl http://56.124.99.8/articles
```

### Check logs:

```bash
docker logs -f blog-backend
```

Expected log:

```
Job de artigo (a cada 8 horas)...
Artigo criado: <uuid>
```

## 14. Future Enhancements

- Admin dashboard
- SEO metadata
- Pagination
- HTTPS (Nginx + Certbot)
- Full CI/CD automation
- CloudWatch monitoring
- Redis caching
- Blue/Green deployment strategy

## 15. Challenge Requirement Checklist

| Requirement                | Status |
| -------------------------- | ------ |
| React frontend             | ✔      |
| Node.js backend            | ✔      |
| AI-generated articles      | ✔      |
| Auto generation (8h)       | ✔      |
| PostgreSQL storage         | ✔      |
| Dockerized services        | ✔      |
| EC2 deployment             | ✔      |
| CodeBuild pipeline         | ✔      |
| ECR image hosting          | ✔      |
| GitHub Actions deploy      | ✔      |
| Minimum 3 initial articles | ✔      |
| Public live URL            | ✔      |

## 16. Author

**Danilo de Morais**  
Senior Software Engineer — Full-Stack, Cloud & DevOps  
Brazil  
Contact available upon request.

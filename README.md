# Auto-Generated Blog Platform

Full-Stack • AI Integration • Docker • AWS EC2 • ECR • CodeBuild • GitHub Actions

A production-oriented blog platform that autonomously generates and publishes articles using AI.  
The system was created as part of a technical challenge and demonstrates full-stack engineering, DevOps practices, cloud deployment, CI/CD automation, container orchestration, and AI-assisted content creation.

The platform uses React, Node.js, PostgreSQL, Docker, AWS EC2, AWS CodeBuild, AWS ECR, HuggingFace Inference API — and now **GitHub Actions for automated deployment**.

---

# 1. Live Demo & Repository

**Live Application (EC2):**  
http://56.124.99.8/

**GitHub Repository:**  
https://github.com/danilomoraisgustavo/blog-challenge

---

# 2. Video Summary (for challenge submission)

The video (30–120 seconds) should cover:

- Brief personal introduction
- High-level system architecture
- Demonstration of automatic AI article generation
- Technical reasoning behind Docker, EC2, ECR, CodeBuild, cron jobs, and the AI model
- What would be improved with additional time

---

# 3. Project Overview

The platform automatically generates new AI-based articles **every 8 hours** and publishes them to a modern, fully responsive interface.

Core stack:

- **Frontend:** React + Vite + Nginx
- **Backend:** Node.js + Express + Cron
- **Database:** PostgreSQL
- **AI Model:** HuggingFace Inference API
- **Infrastructure:** Docker Compose on EC2
- **Image Pipeline:** AWS CodeBuild → AWS ECR
- **Deployment Automation:** GitHub Actions + SSH deploy script

The design favors simplicity, robustness, and cloud best practices.

---

# 4. Features

## Application Features

- Automatic article creation every 8 hours
- AI-powered long-form content generation
- Fully responsive UI
- Article listing and detail view
- Health-check endpoint
- Fallback article generator (in case AI API fails)
- Minimal but extensible schema

## Infrastructure Features

- Fully containerized (frontend, backend, DB)
- Multi-stage Docker builds for production images
- Automated image builds via AWS CodeBuild
- Images stored in AWS ECR (`:latest` tag)
- Auto-deployment via GitHub Actions
- EC2 host uses `docker-compose` orchestration
- Zero-downtime container refresh with `up -d`

---

# 5. Architecture Overview

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

Everything runs inside Docker on a single EC2 instance.

---

# 6. Repository Structure

backend/
src/
routes/
services/
db/
index.js
Dockerfile

frontend/
src/
Dockerfile

infra/
buildspec.yml
docker-compose.yml
scripts/
deploy.sh
init-ec2.sh

.github/
workflows/
deploy.yml

docs/
ARCHITECTURE.md

README.md

yaml
Copiar código

---

# 7. Backend API

| Method | Route           | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/articles`     | List all articles     |
| GET    | `/articles/:id` | Retrieve an article   |
| GET    | `/health`       | Health-check endpoint |

---

# 8. Cron Job (Article Generation)

The backend uses **node-cron** to generate new AI articles every 8 hours:

0 _/8 _ \* \*

yaml
Copiar código

Each execution:

1. Calls HuggingFace for title + content
2. Formats and validates the response
3. Stores article in PostgreSQL
4. Logs job execution

If the AI API fails, fallback mode produces consistent placeholder content.

---

# 9. AI Integration

Using:

Model: deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
Provider: HuggingFace Inference API

yaml
Copiar código

Reasons:

- Free-tier friendly
- Good coherence for long-form text
- Fast inference
- Avoids GPU requirements
- Meets challenge constraints

---

# 10. Database Schema

### Table: `articles`

| Field      | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | UUID      | Primary key        |
| title      | TEXT      | Article title      |
| content    | TEXT      | Full content       |
| category   | TEXT      | Optional category  |
| featured   | BOOLEAN   | Highlight flag     |
| created_at | TIMESTAMP | Creation timestamp |

---

# 11. Running Locally

### Requirements

- Docker
- Docker Compose

### Start everything

```bash
docker-compose up --build
Access
Frontend → http://localhost

Backend → http://localhost:4000

Stop
bash
Copiar código
docker-compose down
12. Deployment on AWS EC2
SSH into instance
bash
Copiar código
ssh ubuntu@56.124.99.8
Pull latest images
bash
Copiar código
cd ~/blog-challenge/infra
docker-compose pull
Restart environment
bash
Copiar código
docker-compose up -d
docker ps
Health-check
arduino
Copiar código
http://56.124.99.8/health
13. Automated CI/CD (GitHub Actions → CodeBuild → EC2)
The automated pipeline performs:

Step 1 — GitHub Push
You push code to main.

Step 2 — CodeBuild
Builds backend image (blog-backend:latest)

Builds frontend image (blog-frontend:latest)

Pushes both to ECR

Step 3 — GitHub Actions (deploy)
SSHs into EC2

Executes /infra/scripts/deploy.sh

Refreshes containers with zero downtime

Example workflow file: .github/workflows/deploy.yml
yaml
Copiar código
# GitHub Actions - CI/CD Pipeline for MyWorlds Blog
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

      - name: Wait for 25 seconds (ECR sync time)
        run: sleep 25

      - name: Deploy on EC2
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
14. Testing
Check articles:
bash
Copiar código
curl http://56.124.99.8/articles
View backend logs:
bash
Copiar código
docker logs -f blog-backend
Expected:

css
Copiar código
Job de artigo (a cada 8 horas)...
Artigo criado: <uuid>
15. Possible Future Enhancements
Admin login and dashboard

SEO metadata and tags

Pagination and search

HTTPS via Nginx + Certbot

Full CI/CD with GitHub Actions (no CodeBuild)

CloudWatch logging

Redis caching

Automated migrations with Prisma or Knex

Blue/Green deployments

16. Challenge Requirement Checklist
Requirement	Status
React frontend	Completed
Node.js backend	Completed
AI-generated articles	Completed
Automatic daily generation	Completed (8h schedule)
Database storage	Completed
Dockerized	Completed
Deploy on EC2	Completed
CodeBuild pipeline	Completed
ECR registry	Completed
GitHub Actions deployment	Completed
At least 3 initial articles	Completed
Public live URL	Completed

17. Author
Danilo de Morais
Senior Software Engineer — Full-Stack, Cloud & DevOps
Brazil
Contact available upon request.
```

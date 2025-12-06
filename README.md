# Auto-Generated Blog Platform

Full-Stack • AI Integration • Docker • AWS EC2 • CodeBuild • ECR

A production-oriented blog platform that autonomously generates and publishes articles using AI.  
The system was designed to demonstrate full-stack engineering, DevOps practices, cloud deployment, container orchestration, and AI-assisted content creation.

This challenge was completed using React, Node.js, PostgreSQL, Docker, AWS EC2, AWS CodeBuild, AWS ECR, and HuggingFace Inference API.

---

# 1. Live Demo & Repository

**Live Application (EC2):**  
http://56.124.99.8/

**GitHub Repository:**  
https://github.com/danilomoraisgustavo/blog-challenge

---

# 2. Video Summary (for the final submission)

The video (30–120 seconds) will cover:

- A brief personal introduction
- Overview of the system architecture
- Demonstration of automatic article generation
- Explanation of technical decisions (Docker, EC2, ECR, CodeBuild, AI model)
- What could be improved with more time

This summary is included here for reference and will appear alongside the final video link.

---

# 3. Project Overview

The platform automatically generates new AI-based articles **every 8 hours** and publishes them to a fully responsive frontend.

The stack includes:

- **React + Nginx** (frontend)
- **Node.js + Express + Cron** (backend)
- **PostgreSQL** (persistent storage)
- **HuggingFace Inference API** (text generation)
- **AWS EC2** hosting using **Docker Compose**
- **AWS CodeBuild + ECR** automated image builds

The architecture emphasizes clarity, maintainability, and alignment with production best practices—while intentionally remaining simple, as required by the challenge.

---

# 4. Features

### Application Features

- Automatic generation of a new article every 8 hours
- AI-generated long-form content (HuggingFace model)
- Article listing page and full article view
- Fully responsive UI
- Health-check endpoint
- Strict backend error logging and fallback mode
- Minimal but extensible database schema

### Infrastructure Features

- Frontend, backend, and DB fully containerized
- Multi-stage Docker builds
- Automated pipelines with AWS CodeBuild
- Images stored in AWS ECR with timestamp tags
- EC2 instance running docker-compose
- Environment-driven configuration
- Lightweight, low-cost architecture

---

# 5. Architecture Overview

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

All components run inside Docker containers on a single EC2 instance.

---

# 6. Repository Structure

```
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

docs/
  ARCHITECTURE.md

README.md
```

---

# 7. Backend API

### Routes

| Method | Route           | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/articles`     | List all articles     |
| GET    | `/articles/:id` | Retrieve an article   |
| GET    | `/health`       | Health-check endpoint |

---

# 8. Cron Job (Article Generation)

The backend uses **node-cron** to schedule AI article creation every 8 hours:

```
0 */8 * * *
```

Each execution:

1. Calls HuggingFace to generate a title/content
2. Formats the response
3. Persists the article in PostgreSQL
4. Logs creation details

If the AI API fails, a fallback generator ensures the schedule is **never** interrupted.

---

# 9. AI Integration

Model used:

```
deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
```

Reasons:

- Free-tier availability
- Good for long-form coherent text
- Fast inference
- No GPU required
- Meets the “max $5 API usage” requirement

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

### Start all services

```bash
docker-compose up --build
```

### Services

- Frontend: http://localhost
- Backend: http://localhost:4000

### Stop all services

```bash
docker-compose down
```

---

# 12. Deployment on AWS EC2

### 1. Access EC2

```bash
ssh ubuntu@56.124.99.8
```

### 2. Pull updated images

```bash
cd ~/blog-challenge/infra
docker-compose pull
```

### 3. Relaunch environment

```bash
docker-compose up -d
docker ps
```

### 4. Validate health

```
http://56.124.99.8/health
```

---

# 13. CI/CD (CodeBuild → ECR → EC2)

The pipeline performs:

1. Clone repository
2. Build backend Docker image
3. Build frontend Docker image
4. Tag with timestamp (`YYYYMMDDHHMMSS`)
5. Push images to ECR
6. Generate `imageDetail.json`

This ensures reproducibility and unambiguous image versioning.

---

# 14. Testing the System

### Check article list:

```bash
curl http://56.124.99.8/articles
```

### Check backend logs:

```bash
docker logs -f blog-backend
```

Expected log:

```
Job de artigo (a cada 8 horas)...
Artigo criado: <uuid>
```

---

# 15. Improvements with More Time

- Admin portal with authentication
- Tags, pagination, and search
- SEO optimization for article metadata
- Full CI/CD via GitHub Actions or CodePipeline
- HTTPS via Nginx + Certbot or ALB
- CloudWatch logging and dashboards
- Test suite (Jest, integration tests)
- Cleanup/automation scripts for EC2

---

# 16. Challenge Requirement Checklist

| Requirement                   | Status                  |
| ----------------------------- | ----------------------- |
| React frontend                | Completed               |
| Node.js backend               | Completed               |
| AI-generated articles         | Completed               |
| Automatic daily generation    | Completed (8h interval) |
| Database storage              | Completed               |
| Dockerized                    | Completed               |
| Deploy on EC2                 | Completed               |
| CodeBuild pipeline            | Completed               |
| ECR registry                  | Completed               |
| At least 3 articles initially | Completed               |
| Public live URL               | Completed               |

---

# 17. Author

**Danilo de Morais**  
Senior Software Engineer — Full-Stack, Cloud, DevOps  
Brazil  
LinkedIn and contact available upon request.

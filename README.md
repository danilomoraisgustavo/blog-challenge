# Auto-Generated Blog Platform

A full-stack application capable of autonomously generating and publishing new blog articles using an AI model.  
Built with React, Node.js, PostgreSQL, Docker, and deployed on AWS using EC2, ECR, and CodeBuild.

The project was developed as part of a technical challenge focused on demonstrating full-stack engineering, DevOps practices, containerization, CI/CD, and integration with AI text-generation services.

# 1. Overview

This system automatically generates new blog articles every 8 hours using the HuggingFace Inference API.  
All components run as isolated Docker containers on a single EC2 instance.  
The application includes:

- A responsive React frontend served via Nginx
- A Node.js backend with scheduled tasks and AI integration
- A PostgreSQL database for persistent storage
- A complete CI pipeline using AWS CodeBuild
- Deployment based on pulling ECR images to EC2

The solution follows a pragmatic design: simple, maintainable, and optimized for clarity and reliability.

# 2. Features

### Core Features

- Automatically generates 1 article every 8 hours using an AI model
- Stores all content in PostgreSQL
- Fully responsive frontend
- Article listing and article detail view
- Backend REST API
- Health-check endpoint
- Deterministic cron scheduler running inside the backend container

### DevOps & Infrastructure Features

- Dockerized frontend, backend, and database
- Multi-stage Docker builds for optimized image size
- Automated builds in AWS CodeBuild
- Images pushed to AWS ECR
- Deployment executed on EC2 using docker-compose
- Environment-specific configuration via `.env`
- Logs and observability managed directly via Docker

# 3. Architecture

```
                   ┌────────────────────────┐
                   │      Frontend (Nginx)   │
                   │ React / Vite build      │
                   └───────────┬────────────┘
                               │
                        HTTP/REST API
                               │
                   ┌───────────▼────────────┐
                   │      Backend (Node.js) │
                   │ Express, Cron, AI Job  │
                   └───────────┬────────────┘
                               │
                     PostgreSQL Connection
                               │
                   ┌───────────▼────────────┐
                   │     PostgreSQL DB      │
                   └────────────────────────┘
```

Everything runs inside Docker on a single EC2 instance.

# 4. Repository Structure

```
backend/
  src/
    routes/
    services/
      aiClient.js
      articleJob.js
    db/
      init.js
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

# 5. Backend Technical Details

### Endpoints

| Method | Route           | Description             |
| ------ | --------------- | ----------------------- |
| GET    | `/articles`     | List all articles       |
| GET    | `/articles/:id` | Retrieve a full article |
| GET    | `/health`       | Health-check endpoint   |

### Scheduled Tasks

The backend uses **node-cron**.  
The job runs every 8 hours:

```
0 */8 * * *
```

Each execution calls:

- `aiClient.js` → generates article content
- `articleJob.js` → persists the article
- `initDb()` ensures schema is ready at startup

# 6. AI Integration

The system uses:

```
Model: deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
Provider: HuggingFace Inference API
```

Reasons for this choice:

- Free-tier availability
- Good text coherence for long-form content
- Fast inference times
- No local GPU requirement

The backend includes a **fallback mode** that generates placeholder content in case of API failure, ensuring the cron always produces an entry.

# 7. Database Structure

### Table: `articles`

| Field      | Type      | Description           |
| ---------- | --------- | --------------------- |
| id         | UUID      | Primary key           |
| title      | TEXT      | Article title         |
| content    | TEXT      | Full content          |
| category   | TEXT      | Category for grouping |
| featured   | BOOLEAN   | Mark as featured      |
| created_at | TIMESTAMP | Insert timestamp      |

### Table: `tournaments`

Included for future extensibility; not required by the challenge but implemented for completeness.

# 8. Running Locally

### Requirements

- Docker
- Docker Compose

### Start services

```bash
docker-compose up --build
```

Services will be available:

- Frontend: http://localhost
- Backend: http://localhost:4000

Stop services:

```bash
docker-compose down
```

# 9. Deployment Guide (EC2)

### Step 1: Connect to EC2

```bash
ssh ubuntu@<your-ec2-ip>
```

### Step 2: Pull updates

```bash
cd ~/blog-challenge/infra
docker-compose pull
```

### Step 3: Relaunch services

```bash
docker-compose up -d
docker ps
```

### Step 4: Validate health

```
http://<ec2-ip>/health
```

# 10. CI/CD Pipeline (CodeBuild)

### Buildspec does the following:

1. Logs into AWS ECR
2. Builds backend image
3. Builds frontend image
4. Tags images with timestamp
5. Pushes both images to ECR
6. Generates `imageDetail.json` for traceability

This ensures deterministic and reproducible builds.

# 11. How to Test the Application

### Functional Tests

- Open the frontend and verify articles load
- Click an article to view the details
- Check database for new entries every 8 hours

### Backend Tests (manual)

```bash
curl http://<ec2-ip>:4000/articles
```

### Cron Validation

Watch logs:

```bash
docker logs -f blog-backend
```

You should see:

```
Job de artigo (a cada 8 horas)...
Artigo criado: <uuid>
```

# 12. Next Improvements (If more time were available)

- Add authentication for admin users
- Implement tagging and SEO metadata
- Improve prompt engineering for more varied articles
- Add pagination and search
- Implement continuous deployment (CodePipeline or GitHub Actions)
- Add CloudFront or ALB for HTTPS termination
- Add migration tooling (Prisma or Knex)
- Introduce unit tests and integration tests

# 13. How This Project Meets the Challenge Requirements

| Requirement                  | Status    | Notes                   |
| ---------------------------- | --------- | ----------------------- |
| React frontend               | Completed | Deployed with Nginx     |
| Node.js backend              | Completed | Express + Cron + DB     |
| AI-based article generation  | Completed | HuggingFace API         |
| Storage                      | Completed | PostgreSQL              |
| At least 3 starting articles | Completed | Auto-generated          |
| 1 new article per day (8h)   | Completed | Scheduled cron job      |
| Dockerized                   | Completed | Multi-stage builds      |
| AWS EC2 deployment           | Completed | All services running    |
| CodeBuild pipeline           | Completed | Fully automated builds  |
| ECR image hosting            | Completed | Timestamp-tagged images |
| Public live URL              | Completed | Hosted on EC2           |

# 14. Author

Developed by **Danilo de Morais**  
Senior Software Engineer — Full-Stack & DevOps  
Contact available upon request.

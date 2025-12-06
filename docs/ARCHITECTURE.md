# Architecture Documentation

Auto-Generated Blog Platform  
React • Node.js • PostgreSQL • Docker • AWS EC2 • ECR • CodeBuild

## 1. Introduction

This document describes the architecture of the Auto-Generated Blog Platform, detailing the structure of the system, key design decisions, deployment model, data storage strategy, CI/CD pipeline, and operational concerns.

The project’s goal is to create a lightweight but production-aligned infrastructure using Docker and AWS services, while keeping the architecture simple, auditable, and maintainable.  
Despite being deployed on a single EC2 instance, the system follows service isolation and containerization best practices.

## 2. High-Level Architecture Overview

The system consists of three primary services:

- **Frontend (React + Nginx)**  
  Provides the user interface, handles routing, and fetches data from the backend.

- **Backend (Node.js + Express)**  
  Exposes REST APIs, manages scheduled article generation, and integrates with an AI text-generation model.

- **Database (PostgreSQL)**  
  Stores articles and related metadata.

All three services run as Docker containers inside an EC2 instance. The Docker images are built by AWS CodeBuild and stored in AWS ECR.

### System Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                           AWS EC2                             │
│                                                              │
│  ┌──────────────────┐   REST API    ┌──────────────────────┐ │
│  │    Frontend      │ ─────────────▶│       Backend        │ │
│  │  React + Nginx   │◀──────────────│ Node.js + Cron Jobs  │ │
│  └──────────────────┘               └─────────┬────────────┘ │
│                                               │              │
│                                           SQL Queries        │
│                                               │              │
│                               ┌───────────────▼────────────┐ │
│                               │        PostgreSQL           │ │
│                               └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

The architecture intentionally avoids unnecessary complexity such as ECS, Kubernetes, load balancers, or distributed systems.  
This decision aligns with the challenge guidelines and optimizes cost, observability, and ease of deployment.

## 3. Components and Responsibilities

### 3.1 Frontend (React + Nginx)

- Built using Vite for fast compilation.
- Delivered via Nginx using a lightweight configuration.
- Calls backend through REST interface (`/articles`, `/articles/:id`).
- Stateless by design; depends entirely on backend for dynamic content.

### 3.2 Backend (Node.js + Express)

The backend layer handles:

- REST API for articles
- AI article generation using HuggingFace Inference API
- Scheduled jobs using `node-cron`
- Database initialization (schema creation on startup)
- Logging and error propagation

The decision to place cron jobs inside the backend container rather than at EC2 level ensures:

- Portability
- Versioning of cron behavior
- Isolation
- Easier debugging and local reproduction

### 3.3 PostgreSQL

Chosen for reliability, familiarity, SQL support, and ability to scale vertically if needed.

Schema is intentionally minimal:

```
articles (
  id UUID PRIMARY KEY,
  title TEXT,
  content TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
)
```

## 4. AI Integration

The backend integrates with the HuggingFace Inference API using the model:

```
deepseek-ai/DeepSeek-R1-Distill-Qwen-32B
```

### Rationale for Selecting HuggingFace

- Available on free-tier
- No GPU infrastructure required
- Predictable API latency
- Suitable for long-form text generation
- Lower operational cost compared to running a local model
- Complies with challenge requirement: “May spend up to $5 or use a free solution”

### Failure Handling

If the API call fails:

1. A fallback generator creates deterministic placeholder content
2. Cron job logs the occurrence
3. Article is still persisted to maintain scheduling contract

This ensures the system _always_ produces a new article every 8 hours.

## 5. CI/CD Pipeline Architecture (CodeBuild → ECR → EC2)

### 5.1 Build Pipeline (CodeBuild)

The `buildspec.yml` implements the following sequence:

1. Checkout repository
2. Authenticate to ECR
3. Build backend Docker image
4. Build frontend Docker image
5. Tag both images with timestamp tag (e.g., `20251206192654`)
6. Push images to ECR
7. Output `imageDetail.json` for tracking

This ensures repeatable builds and decouples infrastructure from local development.

### 5.2 Deployment Flow (EC2)

Deployment is intentionally simple and manual to satisfy challenge requirements:

```
git push → CodeBuild builds images → EC2 pulls tagged images → docker-compose up -d
```

Containers are isolated through Docker networks, and environment variables are injected via `.env`.

## 6. Docker & Containerization Strategy

Each service has its own Dockerfile:

### Backend Dockerfile

- Multi-stage build
- Production dependencies only
- Copies only necessary source code

### Frontend Dockerfile

- Multi-stage (builder → Nginx)
- Eliminates dev dependencies
- Produces a minimal production image

### Database

Runs directly from the official `postgres:16` image.

### docker-compose

Responsible for orchestration on EC2:

- Creates `blog-net` network
- Creates persistent volume for database (`pgdata`)
- Uses environment variables for dynamic image names
- Handles container restarts (`unless-stopped`)

## 7. Scheduling Architecture (Cron Jobs)

The backend includes two scheduled tasks:

### Primary Task — Article Generation

Runs every 8 hours:

```
0 */8 * * *
```

### Why cron _inside the container_?

- Synchronized with the deployed backend version
- Easier to test locally
- Automatically restarts if the container restarts
- Does not depend on host OS cron
- More portable across environments

The schedule calls the `runDailyArticleJob` service, which:

1. Fetches AI-generated content
2. Validates and formats output
3. Persists article into PostgreSQL
4. Logs diagnostic information

## 8. Operational Considerations

### Logging

Docker's default logging driver stores logs on the EC2 instance.  
Logs can be inspected through:

```
docker logs -f blog-backend
docker logs -f blog-frontend
```

### Persistence

Only PostgreSQL volume needs persistency:

```
volumes:
  pgdata:
```

Application images are immutable.

### Scalability

While the system runs on a single EC2 instance, it could evolve to:

- EC2 → ASG
- ECS → Fargate
- RDS for PostgreSQL
- ALB + HTTPS termination
- CloudFront edge caching

This challenge intentionally avoids these for simplicity.

## 9. Security Considerations

- API keys and environment variables are never committed to Git
- HuggingFace API key injected via `.env`
- EC2 security group restricted to HTTP/HTTPS + SSH
- Principle of least privilege applied to IAM roles
- Docker images built from official base images

## 10. Trade-offs and Alternative Designs

### Why not ECS?

Challenge requirements explicitly prohibit ECS.

### Why not orchestrate with Kubernetes?

Unnecessary complexity for this scale.

### Why not run a local AI model?

Running a transformer model inside Docker would require GPU or significant CPU and RAM.  
Using HuggingFace API avoids this overhead.

### Why not implement full CI/CD automation?

Manual deployment was acceptable per challenge guidelines.  
A fully automated system would require:

- CodePipeline
- CodeDeploy
- Hooks for EC2 deployment

## 11. Future Enhancements

If additional time were available, the architecture could be expanded with:

- HTTPS via Let's Encrypt or ALB
- Automatic deploy via CodePipeline
- Redis caching layer
- Pagination and richer metadata for articles
- Full test suite: unit, integration, and cron simulations
- Rollback strategy for failed builds
- Observability with CloudWatch Logs
- Container healthchecks and auto-restart policies

## 12. Conclusion

The architecture is intentionally simple yet robust, leveraging AWS services in a cost-effective manner.  
It demonstrates end-to-end understanding of:

- Frontend and backend development
- CI/CD pipelines
- Docker containerization
- Scheduling systems
- Infrastructure deployment on EC2
- AI service integration
- Database schema design

This document serves as a complete reference for maintainers, reviewers, and architects evaluating the system.

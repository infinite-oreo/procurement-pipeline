# Procurement Pipeline

A cloud-native procurement order management system with fully automated CI/CD deployment to AWS ECS Fargate.

## Tech Stack

- **Backend**: Java 21, Spring Boot
- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Containerization**: Docker (multi-stage build)
- **Registry**: Amazon ECR
- **Orchestration**: Amazon ECS Fargate
- **CI/CD**: GitHub Actions

## Architecture

```
GitHub (push) → GitHub Actions → Docker Build → Amazon ECR → Amazon ECS Fargate
```

Every push to `main` automatically builds a new Docker image, pushes it to ECR, and deploys it to ECS.

## Local Development

### Prerequisites
- Java 21
- Node.js 18+
- Docker + Docker Compose

### One-command startup (recommended)

```bash
docker compose up
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

### Run separately

```bash
# Backend
./mvnw spring-boot:run

# Frontend
cd frontend && npm install && npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/orders` | List all orders |
| POST   | `/orders` | Create a new order |
| PUT    | `/orders/{id}` | Edit an order |
| PATCH  | `/orders/{id}/status` | Approve or reject an order |
| DELETE | `/orders/{id}` | Delete an order |

## CI/CD Pipeline

1. Developer pushes code to `main`
2. GitHub Actions triggers automatically
3. Docker image is built and pushed to Amazon ECR
4. ECS service is updated with the new task definition
5. Rolling deployment with zero downtime

## Deployment

- **Region**: ap-northeast-1 (Tokyo)
- **Cluster**: procurement-cluster
- **Service**: procurement-service
- **Public endpoint**: `http://35.78.226.94:8080`

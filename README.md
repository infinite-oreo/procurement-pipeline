# Procurement Pipeline

A cloud-native procurement order management service with fully automated CI/CD deployment to AWS ECS Fargate.

## Tech Stack

- **Backend**: Java 21, Spring Boot
- **Containerization**: Docker (multi-stage build)
- **Registry**: Amazon ECR
- **Orchestration**: Amazon ECS Fargate
- **CI/CD**: GitHub Actions
- **IaC**: AWS CLI (IAM, ECS, ECR)

## Architecture

GitHub (push) → GitHub Actions → Docker Build → Amazon ECR → Amazon ECS Fargate

Every push to `main` automatically builds a new Docker image, pushes it to ECR, and deploys it to ECS.

## Local Development

### Prerequisites
- Java 21
- Maven
- Docker

### Run locally

```bash
./mvnw spring-boot:run
```

### Run with Docker

```bash
docker build -t procurement .
docker run -p 8080:8080 procurement
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List all orders |
| POST | `/orders` | Create a new order |

### Example

```bash
# Create an order
curl -X POST http://localhost:8080/orders \
  -H "Content-Type: application/json" \
  -d '{"itemName":"laptop","quantity":2}'

# Get all orders
curl http://localhost:8080/orders
```

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
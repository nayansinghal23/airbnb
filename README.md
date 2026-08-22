# Hotel Booking Microservices

A production-oriented hotel booking system built using a microservice architecture with **Node.js, Express, TypeScript, Prisma, MySQL, Redis, RabbitMQ, JWT, bcrypt, and Nodemailer**.

## Architecture

```text
                           ┌──────────────────┐
                           │      Client      │
                           └────────┬─────────┘
                                    │
                              HTTPS / API
                                    │
                           ┌────────▼─────────┐
                           │   Load Balancer  │
                           │   / API Gateway  │
                           └────────┬─────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
             ▼                      ▼                      ▼
      ┌─────────────┐       ┌─────────────┐       ┌──────────────┐
      │    Auth     │       │    Hotel    │       │   Booking    │
      │   Service   │       │   Service   │       │   Service    │
      └──────┬──────┘       └──────┬──────┘       └──────┬───────┘
             │                     │                     │
             ▼                     ▼                     ▼
        ┌─────────┐           ┌─────────┐           ┌─────────┐
        │ Auth DB │           │ Hotel DB│           │Booking DB│
        │  MySQL  │           │  MySQL  │           │  MySQL  │
        └─────────┘           └─────────┘           └────┬────┘
                                                         │
                                              ┌──────────▼──────────┐
                                              │        Redis        │
                                              │      Redlock        │
                                              └─────────────────────┘
                                                         │
                                                         │ Events
                                                         ▼
                                              ┌─────────────────────┐
                                              │      RabbitMQ       │
                                              └──────────┬──────────┘
                                                         │
                                                         ▼
                                              ┌─────────────────────┐
                                              │ Notification Service│
                                              └──────────┬──────────┘
                                                         │
                                                         ▼
                                                       SMTP
```

## Services

### Authentication Service

- User registration and login
- Password hashing with bcrypt
- JWT generation and validation
- Role-based access control (RBAC)
- Authentication middleware

### Hotel Service

- Hotel management
- Room management
- Hotel search
- Room availability
- Hotel details

### Booking Service

- Create and cancel bookings
- Check room availability
- Booking concurrency control
- Booking lifecycle management
- Redis + Redlock distributed locking

### Notification Service

- RabbitMQ event consumer
- Booking confirmation emails
- Booking cancellation notifications
- Nodemailer/SMTP integration

## Technology Stack

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| API | Express.js |
| ORM | Prisma |
| Database | MySQL |
| Authentication | JWT |
| Password Hashing | bcrypt |
| Distributed Locking | Redis + Redlock |
| Message Broker | RabbitMQ |
| Email | Nodemailer |
| Containerization | Docker |
| Cloud | AWS |
| Container Platform | ECS / Fargate |
| Database Hosting | AWS RDS |
| Cache | AWS ElastiCache |
| Secrets | AWS Secrets Manager |
| Logging | CloudWatch |
| CI/CD | GitHub Actions |

## Repository Structure

```text
hotel-booking-microservices/
│
├── auth-service/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── hotel-service/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── booking-service/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── notification-service/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Database Architecture

Each service owns its own database.

```text
Auth Service
     │
     ▼
   auth_db


Hotel Service
     │
     ▼
  hotel_db


Booking Service
     │
     ▼
 booking_db
```

Services should not directly access another service's database.

Instead of:

```text
Booking Service ──→ Hotel DB
```

use:

```text
Booking Service
       │
       │ HTTP
       ▼
Hotel Service
       │
       ▼
Hotel DB
```

This maintains service ownership and allows each service to evolve independently.

## Authentication Flow

```text
Client
  │
  │ POST /auth/login
  ▼
Auth Service
  │
  ├── Verify password using bcrypt
  │
  └── Generate JWT
          │
          ▼
        Client
```

Subsequent requests contain:

```text
Authorization: Bearer <JWT>
```

RBAC is used to restrict protected operations.

Example:

```text
USER
 ├── Search hotels
 ├── Create booking
 └── Cancel own booking

ADMIN
 ├── Create hotel
 ├── Update hotel
 ├── Delete hotel
 └── Manage rooms
```

## Booking Concurrency

Concurrent booking requests can cause double booking if availability is checked and updated without synchronization.

The Booking Service uses Redis + Redlock:

```text
User A
   │
   ▼
Acquire Redis Lock
   │
   ▼
Check availability
   │
   ▼
Create booking
   │
   ▼
Release lock


User B
   │
   ▼
Wait for lock
   │
   ▼
Check availability
```

Redis locking should be combined with database transactions and appropriate database constraints. The database remains the source of truth for persistent booking state.

## Booking Event Flow

When a booking is successfully created:

```text
Booking Service
      │
      │ booking.created
      ▼
   RabbitMQ
      │
      ▼
Notification Service
      │
      ▼
   Nodemailer
      │
      ▼
     SMTP
      │
      ▼
User's Email
```

The Booking Service does not need to wait for email delivery.

Example event:

```json
{
  "eventType": "booking.created",
  "timestamp": "2026-08-22T12:00:00Z",
  "data": {
    "bookingId": 123,
    "userId": 456,
    "hotelId": 789
  }
}
```

Possible events:

```text
booking.created
booking.cancelled
booking.completed
```

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- Docker
- Docker Compose

Verify:

```bash
node --version
npm --version
docker --version
docker compose version
```

### Environment Variables

Each service should have its own environment configuration.

Example:

```env
PORT=3000
DATABASE_URL=mysql://user:password@mysql:3306/auth_db

JWT_SECRET=your-secret

REDIS_URL=redis://redis:6379

RABBITMQ_URL=amqp://user:password@rabbitmq:5672

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASSWORD=your-password
```

Do not commit production secrets to Git.

For production, use AWS Secrets Manager or another dedicated secrets-management system.

### Start Infrastructure

```bash
docker compose up -d
```

### Install Dependencies

Run inside each service:

```bash
npm install
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Development Migrations

```bash
npx prisma migrate dev
```

### Start Services

```bash
npm run dev
```

Example local ports:

```text
Auth Service          http://localhost:3001
Hotel Service         http://localhost:3002
Booking Service       http://localhost:3003
Notification Service  http://localhost:3004
```

## Docker

Build a service:

```bash
docker build -t auth-service ./auth-service
```

Run:

```bash
docker run -p 3001:3000 auth-service
```

Docker Compose can be used to run the entire local ecosystem:

```text
auth-service
hotel-service
booking-service
notification-service
mysql
redis
rabbitmq
```

## Prisma

Generate Prisma Client:

```bash
npx prisma generate
```

Create a development migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Deploy production migrations:

```bash
npx prisma migrate deploy
```

Production deployments should use `prisma migrate deploy` rather than `prisma db push`.

## API Design

Example API structure:

```text
/api
│
├── /auth
│   ├── POST /register
│   └── POST /login
│
├── /hotels
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
│
└── /bookings
    ├── POST /
    ├── GET /:id
    └── DELETE /:id
```

Protected APIs require JWT authentication:

```http
Authorization: Bearer <JWT>
```

## Production Architecture

The production environment is designed around AWS:

```text
                           Internet
                              │
                              ▼
                         Route 53
                              │
                              ▼
                     Application Load Balancer
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
                  Auth      Hotel     Booking
                  ECS       ECS        ECS
                                      │
                                      ├──── Redis
                                      │
                                      └──── RabbitMQ
                                               │
                                               ▼
                                         Notification
                                             ECS
```

Databases:

```text
Auth ECS
   │
   ▼
AWS RDS - Auth DB


Hotel ECS
   │
   ▼
AWS RDS - Hotel DB


Booking ECS
   │
   ▼
AWS RDS - Booking DB
```

## AWS Infrastructure

Recommended production components:

```text
AWS
│
├── VPC
│
├── Application Load Balancer
│
├── ECS / Fargate
│   ├── Auth Service
│   ├── Hotel Service
│   ├── Booking Service
│   └── Notification Service
│
├── ECR
│   ├── auth-service
│   ├── hotel-service
│   ├── booking-service
│   └── notification-service
│
├── RDS MySQL
│   ├── auth_db
│   ├── hotel_db
│   └── booking_db
│
├── ElastiCache
│   └── Redis
│
├── Amazon MQ
│   └── RabbitMQ
│
├── Secrets Manager
│
└── CloudWatch
```

Databases, Redis, and RabbitMQ should be placed in private networking and should not be publicly accessible.

## CI/CD

Deployment pipeline:

```text
Developer
    │
    │ git push
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Install dependencies
    ├── Run tests
    ├── Run lint
    ├── Build TypeScript
    ├── Build Docker image
    └── Push image to ECR
              │
              ▼
          ECS Deploy
              │
              ▼
       Prisma Migration
              │
              ▼
        New Service Version
```

Each service should ideally have an independent deployment pipeline.

If only the Booking Service changes, only the Booking Service should be redeployed.

## Health Checks

Each service exposes:

```http
GET /health
```

Example:

```json
{
  "status": "UP"
}
```

For production, separate endpoints can be used:

```text
GET /health/live
GET /health/ready
```

Liveness checks whether the process is running.

Readiness checks whether the service is ready to accept traffic and, where appropriate, can communicate with required dependencies.

## Logging and Monitoring

Production services should produce structured logs containing fields such as:

```json
{
  "level": "info",
  "service": "booking-service",
  "requestId": "abc-123",
  "bookingId": "booking-123",
  "message": "Booking created"
}
```

Monitor:

- Application logs
- CPU utilization
- Memory utilization
- Request latency
- Error rates
- Database connections
- Redis health
- RabbitMQ queue depth
- Failed messages
- ECS task health

CloudWatch can be used initially for centralized logging and monitoring.

## Reliability

The system should handle failures through:

- HTTP timeouts
- Retries with backoff
- RabbitMQ acknowledgements
- Dead-letter queues
- Idempotent consumers
- Database transactions
- Redis lock expiration
- Health checks
- ECS service replacement
- RDS automated backups

Example RabbitMQ flow:

```text
Booking
   │
   ▼
RabbitMQ
   │
   ├── Notification Queue
   │
   └── Dead Letter Queue
             │
             ▼
       Failed Messages
```

## Security

Security considerations include:

- HTTPS/TLS
- JWT authentication
- bcrypt password hashing
- RBAC
- Environment-specific secrets
- AWS Secrets Manager
- Private subnets for databases
- Security groups
- Database access restrictions
- Rate limiting
- Input validation
- Request size limits
- CORS configuration
- Security headers

Production databases should never be publicly exposed.

## Deployment Strategy

Recommended deployment flow:

```text
1. Build application
        ↓
2. Run automated tests
        ↓
3. Build Docker image
        ↓
4. Push image to ECR
        ↓
5. Run Prisma migrations
        ↓
6. Deploy new ECS task
        ↓
7. Health check
        ↓
8. Shift traffic to new version
        ↓
9. Remove old version
```

ECS rolling deployments can be used initially. Blue/green deployments can be introduced later for more critical workloads.

## Future Improvements

Potential improvements include:

- API Gateway
- OpenTelemetry distributed tracing
- Prometheus/Grafana
- Blue/green deployments
- Auto scaling
- Circuit breakers
- Saga pattern for distributed transactions
- Outbox pattern for reliable event publishing
- RabbitMQ dead-letter queues
- Redis cluster
- Multi-AZ deployment
- Database read replicas
- CDN
- Centralized configuration management

## Design Principles

This project follows these core microservice principles:

1. **Independent service ownership**
2. **Database-per-service**
3. **Stateless application servers**
4. **Asynchronous communication for notifications**
5. **Distributed locking for booking concurrency**
6. **JWT-based authentication**
7. **RBAC-based authorization**
8. **Containerized deployment**
9. **Independent CI/CD pipelines**
10. **Private infrastructure for internal resources**

## Summary

The system separates responsibilities into four independently deployable services:

```text
Auth Service
     │
     └── Authentication + Authorization


Hotel Service
     │
     └── Hotels + Rooms + Availability


Booking Service
     │
     ├── Reservations
     ├── Transactions
     └── Redis/Redlock


Notification Service
     │
     ├── RabbitMQ Consumer
     └── Email Notifications
```

The deployment model is:

```text
                  ┌─────────────┐
                  │   Client    │
                  └──────┬──────┘
                         │
                         ▼
                 ┌───────────────┐
                 │      ALB      │
                 └───────┬───────┘
                         │
       ┌─────────────────┼──────────────────┐
       │                 │                  │
       ▼                 ▼                  ▼
     Auth              Hotel             Booking
      ECS                ECS                ECS
       │                 │                  │
       ▼                 ▼                  ├── Redis
     MySQL             MySQL                │
                                            ▼
                                         RabbitMQ
                                            │
                                            ▼
                                      Notification
                                            │
                                            ▼
                                           SMTP
```

This provides a clear path from **local Docker Compose development to AWS ECS/Fargate production deployment** without introducing Kubernetes complexity prematurely.

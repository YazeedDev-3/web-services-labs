# Customer API — ASP.NET Core + Docker

A RESTful Web API for managing customers, containerized with Docker and backed by SQL Server.

---

## Tech Stack

- **ASP.NET Core 8** — Web API framework
- **Entity Framework Core 8** — ORM / database access
- **SQL Server 2019** — Database
- **Docker + Docker Compose** — Containerization

---

## How to Run

**Requirements:** Docker Desktop installed and running.

### 1. Start the containers

```bash
docker compose up --build
```

First run takes 5–10 minutes (downloads images and builds the app).  
Wait until you see:

```
customer-api | Now listening on: http://[::]:8080
```

### 2. Open Swagger UI

```
http://localhost:8006/swagger
```

### 3. Stop the containers

```bash
docker compose down
```

---

## API Endpoints

Base URL: `http://localhost:8006/api/Customers`

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/Customers`      | Get all customers     |
| GET    | `/api/Customers/{id}` | Get customer by ID    |
| POST   | `/api/Customers`      | Create a new customer |
| PUT    | `/api/Customers/{id}` | Update a customer     |
| DELETE | `/api/Customers/{id}` | Delete a customer     |

### Examples

**Create a customer (POST)**

```json
POST /api/Customers
Content-Type: application/json

{
  "customerName": "Yazeed",
  "mobileNumber": "0501234567",
  "email": "Yazeed@example.com"
}
```

**Update a customer (PUT)**

```json
PUT /api/Customers/1
Content-Type: application/json

{
  "customerId": 1,
  "customerName": "Yazeed",
  "mobileNumber": "0509999999",
  "email": "Yazeed.updated@example.com"
}
```

**Delete a customer (DELETE)**

```
DELETE /api/Customers/1
```

---

## Project Structure

```
├── docker-compose.yml                  # Defines two services: API + SQL Server
├── lab-9-webService-Docker/
│   ├── Dockerfile                      # Builds the .NET app image
│   ├── Program.cs                      # App entry point, DB setup
│   ├── Customer.cs                     # Customer model
│   ├── Controllers/
│   │   └── CustomersController.cs      # API endpoints
│   └── Data/
│       └── lab_9_webService_DockerContext.cs  # EF Core DB context
```

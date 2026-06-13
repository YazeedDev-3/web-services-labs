# WebAPI Lab 2 — Clients REST API

ASP.NET Core 8 Web API that performs CRUD operations on a `Clients` table in a local SQL Server (MSSQLLocalDB) database.

## API Endpoints

| Method | Route                | Description                     |
| ------ | -------------------- | ------------------------------- |
| GET    | `/api/Client`        | Return all clients              |
| GET    | `/api/Client/{name}` | Return a single client by name  |
| POST   | `/api/Client`        | Add a new client                |
| PUT    | `/api/Client/{id}`   | Update an existing client by ID |
| DELETE | `/api/Client/{id}`   | Delete a client by ID           |

## Request Body (POST / PUT)

```json
{
  "name": "Yazeed",
  "phoneNumber": "05392077000",
  "email": "y@y.com",
  "address": "madinah"
}
```

## Requirements

- .NET 8 SDK
- SQL Server LocalDB (ships with Visual Studio)

## Setup

1. Clone the repo — the database file (`DB-webService-lab2.mdf`) is included, no extra setup needed.
2. Open the solution (`WebAPI-lab2/WebAPI-lab2.sln`) in Visual Studio or run `dotnet run` from `WebAPI-lab2/WebAPI-lab2/`.
3. Swagger UI opens automatically at `http://localhost:5281/swagger`.

The connection string in `appsettings.json` uses `|DataDirectory|` which resolves at runtime to the `WebAPI-lab2/` folder where the `.mdf` lives — no path configuration required.

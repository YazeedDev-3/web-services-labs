# Lab 4 — Web Service: Server-Side Node.js

A RESTful API built with Node.js and Express for managing a book catalog. The server handles full CRUD operations against a MySQL database and serves a Bootstrap-based frontend UI for interacting with the data.

---

## Features

- Retrieve all books from the database
- Retrieve a single book by ID
- Insert a new book with optional cover image upload
- Update an existing book by ID with optional cover image upload
- Delete a book by ID
- Serve a Bootstrap 4 frontend UI at `/index`
- Input validation on all write operations
- Parameterized SQL queries (no SQL injection)
- Proper HTTP status codes and JSON error responses

---

## Technologies Used

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MySQL |
| MySQL Driver | mysql2 |
| File Uploads | express-fileupload |
| CORS | cors |
| Frontend | HTML, Bootstrap 4, jQuery |

---

## Project Structure

```
lab-4-webService-ServerSide-Node.js/
├── img/                  # Uploaded book cover images (served as static files)
├── node_modules/         # Installed dependencies
├── index.html            # Frontend UI (Bootstrap 4 SPA)
├── server.js             # Express server — all routes and logic
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Locked dependency versions
└── README.md
```

---

## Database Setup

1. Start your MySQL server.
2. Open a MySQL client (e.g. phpMyAdmin or the MySQL CLI) and run:

```sql
CREATE DATABASE IF NOT EXISTS test;

USE test;

CREATE TABLE IF NOT EXISTS book (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)    NOT NULL,
    description TEXT,
    price       DECIMAL(10, 2)  NOT NULL,
    cata        VARCHAR(100),
    image       VARCHAR(255)    DEFAULT 'nopic.jpg'
);
```

The server connects as `root` with no password. If your MySQL root user has a password, update line 15 of `server.js`:

```js
password: 'your_password_here',
```

---

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- MySQL (standalone or via XAMPP / WAMP)

### Steps

**1. Install dependencies**

```bash
npm install
```

**2. Start MySQL** and make sure the `test` database and `book` table exist (see Database Setup above).

**3. Start the server**

```bash
node server.js
```

Expected output:
```
Connected to MySQL database
Server running at http://127.0.0.1:8085
```

**4. Open the app**

Navigate to [http://127.0.0.1:8085/index](http://127.0.0.1:8085/index) in your browser.

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/index` | Serve the frontend UI (`index.html`) |
| `GET` | `/process_index` | Get all books |
| `GET` | `/process_detail/:id` | Get a single book by ID |
| `POST` | `/process_insert2` | Insert a new book (optional image upload) |
| `PUT` | `/process_update/:id` | Update a book by ID (optional image upload) |
| `DELETE` | `/process_delete/:id` | Delete a book by ID |

### Request Body (POST / PUT)

All write requests use `multipart/form-data` to support optional file uploads.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | Non-empty |
| `description` | string | Yes | Non-empty |
| `price` | number | Yes | Non-negative |
| `cata` | string | Yes | `Computer Science` or `Information Technology` |
| `file_pic` | file | No | JPEG or PNG only |

### Example Responses

**GET /process_index — 200 OK**
```json
[
  {
    "id": 1,
    "title": "Clean Code",
    "description": "A handbook of agile software craftsmanship",
    "price": "35.00",
    "cata": "Computer Science",
    "image": "cleancode.jpg"
  }
]
```

**POST /process_insert2 — 201 Created**
```json
{
  "id": 2,
  "title": "Clean Code",
  "price": "35.00",
  "cata": "Computer Science",
  "description": "A handbook of agile software craftsmanship",
  "image": "cleancode.jpg"
}
```

**Error — 400 Bad Request**
```json
{
  "errors": ["title is required and must be a non-empty string"]
}
```

**Error — 404 Not Found**
```json
{
  "error": "Book not found"
}
```

---

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `Error: connect ECONNREFUSED` | MySQL is not running | Start MySQL via XAMPP or system services |
| `ER_ACCESS_DENIED_ERROR` | Wrong MySQL credentials | Update `host`/`user`/`password` in `server.js` |
| `ER_NO_SUCH_TABLE: book` | Table not created | Run the SQL from the Database Setup section |
| `Cannot find module 'express'` | Dependencies not installed | Run `npm install` |
| Port 8085 already in use | Another process is on that port | Change the port on the last line of `server.js` |

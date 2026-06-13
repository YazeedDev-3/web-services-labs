# Book Store — Angular + Node.js + MySQL

An online book store with a public-facing storefront for browsing books and a JWT-protected admin dashboard for managing inventory.

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | Angular 17 (standalone components), Bootstrap 5, TypeScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Authentication | JSON Web Tokens (JWT) — 1-hour expiry |

---

## Features

### Public Store (no login required)
- Browse all books displayed as responsive cards
- View full book details — title, description, price, category, cover image

### Admin Dashboard (login required)
- Secure login with JWT authentication
- View all books in a management table
- Add new books with optional cover image upload
- Edit book details and replace cover images
- Delete books

---

## Technologies Used

**Frontend**
- Angular 17+ (standalone components)
- Bootstrap 5.3
- TypeScript / RxJS

**Backend**
- Node.js + Express.js 5
- `mysql2` — MySQL driver
- `jsonwebtoken` — JWT signing and verification
- `express-fileupload` — multipart image uploads
- `cors` — cross-origin resource sharing

---

## Project Structure

```
lab5-angular-nodejs/
├── backend/
│   ├── img/                    # Uploaded book cover images
│   ├── server.js               # Express REST API
│   └── package.json
└── frontend/
    └── my-app/
        ├── src/
        │   └── app/
        │       ├── store/          # Public store — book card grid
        │       ├── bookdetail/     # Public book detail page
        │       ├── home/           # Admin dashboard
        │       ├── login/          # Admin login
        │       ├── insertbook/     # Add book form
        │       ├── updatebook/     # Edit / delete form
        │       └── book.service.ts # Centralised HTTP service
        ├── angular.json
        └── package.json
```

---

## Database Setup

Run the following SQL in your MySQL client to create the required schema:

```sql
CREATE DATABASE test;
USE test;

CREATE TABLE users (
  Id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  role     VARCHAR(50)  NOT NULL
);

CREATE TABLE book (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255)   NOT NULL,
  description TEXT,
  price       DECIMAL(10, 2),
  cata        VARCHAR(100),
  image       VARCHAR(255)
);

-- Default admin account
INSERT INTO users (username, password, role) VALUES ('admin', 'admin123', 'admin');
```

---

## Running the Project

### 1. Start MySQL

Make sure your MySQL server is running and the `test` database has been set up (see Database Setup above).

### 2. Start the Backend

```bash
cd lab5-angular-nodejs/backend
npm install
node server.js
```

The API will be available at `http://127.0.0.1:8085`.

### 3. Start the Frontend

```bash
cd lab5-angular-nodejs/frontend/my-app
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

---

## API Endpoints

### Public (no authentication required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/public_books` | Get all books (public store) |
| `GET` | `/process_detail/:id` | Get a single book by ID |

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/loginprocess` | `{ name, pass }` | Authenticate and receive a JWT |

### Protected — requires `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/process_index` | Get all books (admin role required) |
| `POST` | `/process_insert2` | Add a new book (multipart/form-data, image optional) |
| `PUT` | `/process_update/:id` | Update a book by ID (image optional) |
| `DELETE` | `/process_delete/:id` | Delete a book by ID |

---

## Frontend Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Public store — book grid | Public |
| `/book/:id` | Book detail view | Public |
| `/admin/login` | Admin login | Public |
| `/admin/dashboard` | Admin book list | Admin |
| `/insertbook` | Add book form | Admin |
| `/updatebook/:id` | Edit / delete form | Admin |

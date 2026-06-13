const express    = require('express');
const mysql      = require('mysql2');
const cors       = require('cors');
const fileUpload = require('express-fileupload');
const jwt        = require('jsonwebtoken');

// In production, load this from an environment variable (e.g. process.env.JWT_SECRET)
const JWT_SECRET = 'secretkey';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('img'));
app.use(fileUpload());

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: '',
  database: 'test'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// POST /loginprocess — validate credentials and return a signed JWT
app.post('/loginprocess', (req, res) => {
  const { name: username, pass: password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(sql, [username, password], (err, rows) => {
    if (err) return res.status(500).json({ error: 1, msg: 'Database error' });

    if (rows.length === 0) {
      return res.json({ error: 1, msg: 'Wrong username or password' });
    }

    const user = { username, userid: rows[0].Id, role: rows[0].role };
    jwt.sign({ user }, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) return res.status(500).json({ error: 1, msg: 'Token generation failed' });
      res.json({ token });
    });
  });
});

// GET /public_books — return all books without authentication (public store)
app.get('/public_books', (req, res) => {
  db.query('SELECT * FROM book', (err, rows) => {
    if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
    res.json(rows);
  });
});

// Middleware — reject requests that are missing a valid Bearer token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(403);

  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(403);

  req.token = token;
  next();
}

// GET /process_index — return all books (admin role required)
app.get('/process_index', verifyToken, (req, res) => {
  jwt.verify(req.token, JWT_SECRET, (err, authData) => {
    if (err) return res.sendStatus(403);

    if (authData.user.role !== 'admin') {
      return res.json({ error: 1, msg: 'Not authorized to access this page' });
    }

    db.query('SELECT * FROM book', (err, rows) => {
      if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
      res.json(rows);
    });
  });
});

// POST /process_insert2 — insert a new book with optional image upload
app.post('/process_insert2', (req, res) => {
  const { title, price, cata, description } = req.body;

  const saveBook = (imageName) => {
    const sql = 'INSERT INTO book (title, description, price, cata, image) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, description, price, cata, imageName], err => {
      if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
      res.json({ title, price, cata, description });
    });
  };

  if (req.files && Object.keys(req.files).length > 0) {
    const image = req.files.file_pic;
    image.mv(`${process.cwd()}/img/${image.name}`, err => {
      if (err) return res.status(500).json({ error: 1, msg: 'File upload failed' });
      saveBook(image.name);
    });
  } else {
    saveBook('nopic.jpg');
  }
});

// PUT /process_update/:id — update a book by ID with optional new image
app.put('/process_update/:id', (req, res) => {
  const { id } = req.params;
  const { title, price, cata, description } = req.body;

  const saveBook = (imageName) => {
    const hasImage = imageName !== null;
    const sql = hasImage
      ? 'UPDATE book SET title=?, description=?, price=?, cata=?, image=? WHERE id=?'
      : 'UPDATE book SET title=?, description=?, price=?, cata=? WHERE id=?';
    const params = hasImage
      ? [title, description, price, cata, imageName, id]
      : [title, description, price, cata, id];

    db.query(sql, params, err => {
      if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
      res.json({ id, title, price, cata, description });
    });
  };

  if (req.files && Object.keys(req.files).length > 0) {
    const image = req.files.file_pic;
    image.mv(`${process.cwd()}/img/${image.name}`, err => {
      if (err) return res.status(500).json({ error: 1, msg: 'File upload failed' });
      saveBook(image.name);
    });
  } else {
    saveBook(null);
  }
});

// DELETE /process_delete/:id — delete a book by ID
app.delete('/process_delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM book WHERE id = ?', [id], err => {
    if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
    res.json({ id });
  });
});

// GET /process_detail/:id — return a single book by ID
app.get('/process_detail/:id', (req, res) => {
  db.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 1, msg: 'Database error' });
    if (rows.length === 0) return res.status(404).json({ error: 1, msg: 'Book not found' });
    res.json(rows[0]);
  });
});

const server = app.listen(8085, () => {
  console.log(`Server running at http://127.0.0.1:${server.address().port}`);
});

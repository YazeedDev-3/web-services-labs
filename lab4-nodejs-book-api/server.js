const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

// --- Middleware ---

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static('img'));
app.use(fileUpload());

// --- Database ---

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'test'
});

db.connect(function (err) {
   if (err) {
      console.error('Failed to connect to MySQL:', err.message);
      process.exit(1);
   }
   console.log('Connected to MySQL database');
});

// --- Validation Helpers ---

function requireString(value, name) {
   if (!value || typeof value !== 'string' || value.trim() === '') {
      return `${name} is required and must be a non-empty string`;
   }
   return null;
}

function requirePrice(value) {
   const parsed = parseFloat(value);
   if (isNaN(parsed) || parsed < 0) return 'price must be a non-negative number';
   return null;
}

const VALID_CATEGORIES = ['Computer Science', 'Information Technology'];

function requireCategory(value) {
   if (!VALID_CATEGORIES.includes(value)) {
      return `cata must be one of: ${VALID_CATEGORIES.join(', ')}`;
   }
   return null;
}

// Runs all field validators and returns an array of error strings (empty = valid)
function validateBookFields(title, description, price, cata) {
   return [
      requireString(title, 'title'),
      requireString(description, 'description'),
      requirePrice(price),
      requireCategory(cata),
   ].filter(Boolean);
}

// --- File Upload Helpers ---

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];

function hasUploadedFile(req) {
   return req.files && Object.keys(req.files).length > 0;
}

function saveUploadedFile(file, callback) {
   const uploadPath = process.cwd() + '/img/' + file.name;
   file.mv(uploadPath, callback);
}

// --- Routes ---

// Serve the frontend
app.get('/index', function (req, res) {
   res.sendFile(__dirname + '/index.html');
});

// Get all books
app.get('/process_index', function (req, res) {
   db.query('SELECT * FROM book', function (err, rows) {
      if (err) {
         console.error('DB error on /process_index:', err.message);
         return res.status(500).json({ error: 'Failed to retrieve books' });
      }
      res.json(rows);
   });
});

// Get a single book by id
app.get('/process_detail/:id', function (req, res) {
   const id = parseInt(req.params.id, 10);
   if (isNaN(id)) return res.status(400).json({ error: 'id must be an integer' });

   db.query('SELECT * FROM book WHERE id = ?', [id], function (err, rows) {
      if (err) {
         console.error('DB error on /process_detail:', err.message);
         return res.status(500).json({ error: 'Failed to retrieve book' });
      }
      if (!rows || rows.length === 0) return res.status(404).json({ error: 'Book not found' });
      res.json(rows[0]);
   });
});

// Insert a new book — multipart/form-data to support the optional image upload
app.post('/process_insert2', function (req, res) {
   const { title, price, cata, description } = req.body;

   const errors = validateBookFields(title, description, price, cata);
   if (errors.length > 0) return res.status(400).json({ errors });

   function doInsert(imageName) {
      const sql = 'INSERT INTO book (title, description, price, cata, image) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [title.trim(), description.trim(), parseFloat(price), cata, imageName], function (err, result) {
         if (err) {
            console.error('DB error on /process_insert2:', err.message);
            return res.status(500).json({ error: 'Failed to insert book' });
         }
         res.status(201).json({ id: result.insertId, title, price, cata, description, image: imageName });
      });
   }

   if (hasUploadedFile(req)) {
      const uploadedFile = req.files.file_pic;
      if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
         return res.status(400).json({ error: 'Only JPEG and PNG images are allowed' });
      }
      saveUploadedFile(uploadedFile, function (err) {
         if (err) {
            console.error('File upload error:', err.message);
            return res.status(500).json({ error: 'Failed to save uploaded image' });
         }
         doInsert(uploadedFile.name);
      });
   } else {
      doInsert('nopic.jpg');
   }
});

// Update an existing book by id
app.put('/process_update/:id', function (req, res) {
   const id = parseInt(req.params.id, 10);
   if (isNaN(id)) return res.status(400).json({ error: 'id must be an integer' });

   const { title, price, cata, description } = req.body;

   const errors = validateBookFields(title, description, price, cata);
   if (errors.length > 0) return res.status(400).json({ errors });

   function doUpdate(imageName) {
      // Only include the image column when a new file was uploaded
      const sql = imageName
         ? 'UPDATE book SET title=?, description=?, price=?, cata=?, image=? WHERE id=?'
         : 'UPDATE book SET title=?, description=?, price=?, cata=? WHERE id=?';
      const params = imageName
         ? [title.trim(), description.trim(), parseFloat(price), cata, imageName, id]
         : [title.trim(), description.trim(), parseFloat(price), cata, id];

      db.query(sql, params, function (err, result) {
         if (err) {
            console.error('DB error on /process_update:', err.message);
            return res.status(500).json({ error: 'Failed to update book' });
         }
         if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
         res.json({ id, title, price, cata, description });
      });
   }

   if (hasUploadedFile(req)) {
      const uploadedFile = req.files.file_pic;
      if (!ALLOWED_MIME_TYPES.includes(uploadedFile.mimetype)) {
         return res.status(400).json({ error: 'Only JPEG and PNG images are allowed' });
      }
      saveUploadedFile(uploadedFile, function (err) {
         if (err) {
            console.error('File upload error:', err.message);
            return res.status(500).json({ error: 'Failed to save uploaded image' });
         }
         doUpdate(uploadedFile.name);
      });
   } else {
      doUpdate(null);
   }
});

// Delete a book by id
app.delete('/process_delete/:id', function (req, res) {
   const id = parseInt(req.params.id, 10);
   if (isNaN(id)) return res.status(400).json({ error: 'id must be an integer' });

   db.query('DELETE FROM book WHERE id = ?', [id], function (err, result) {
      if (err) {
         console.error('DB error on /process_delete:', err.message);
         return res.status(500).json({ error: 'Failed to delete book' });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Book not found' });
      res.json({ id });
   });
});

// --- Start Server ---

const server = app.listen(8085, function () {
   console.log('Server running at http://127.0.0.1:' + server.address().port);
});

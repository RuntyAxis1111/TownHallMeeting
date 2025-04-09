const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// --- Middleware ---
app.use(express.json()); // Para parsear body JSON

// --- Configuración Base de Datos SQLite ---
// Define DB setup early so 'db' is available for routes
const dbPath = path.resolve(__dirname, 'questions.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    // If DB fails to open, the app probably can't run, maybe exit?
    // process.exit(1); // Or handle more gracefully
  } else {
    console.log("Connected to the SQLite database.");
    // Crear tabla si no existe
    db.run(`CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_text TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Table 'questions' is ready.");
      }
    });
  }
});

// --- Rutas API ---
// Endpoint to receive questions
app.post('/ask', (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ success: false, message: 'La pregunta no puede estar vacía.' });
  }

  const sql = `INSERT INTO questions (question_text) VALUES (?)`;
  // Use function() to access 'this.lastID'
  db.run(sql, [question.trim()], function(err) {
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ success: false, message: 'Error interno al guardar la pregunta.' });
    }
    console.log(`Question saved with ID: ${this.lastID}`);
    // Return success response with the ID
    res.status(201).json({ success: true, message: 'Pregunta enviada con éxito.', id: this.lastID });
  });
});

// --- Servir archivos estáticos ---
// Serve static files from 'public' directory AFTER API routes
app.use(express.static(path.join(__dirname, 'public')));

// --- Ruta principal (Opcional, Express sirve index.html por defecto) ---
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// --- Iniciar Servidor ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// --- Manejo de cierre de la BD ---
// Gracefully close the database connection when the server stops
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

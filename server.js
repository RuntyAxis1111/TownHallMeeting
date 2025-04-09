const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // Para parsear body JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde 'public'

// --- Configuración Base de Datos SQLite ---
const dbPath = path.resolve(__dirname, 'questions.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
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
app.post('/ask', (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({ success: false, message: 'La pregunta no puede estar vacía.' });
  }

  const sql = `INSERT INTO questions (question_text) VALUES (?)`;
  db.run(sql, [question.trim()], function(err) { // Usar function() para acceder a 'this'
    if (err) {
      console.error("Error inserting data:", err.message);
      return res.status(500).json({ success: false, message: 'Error al guardar la pregunta.' });
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    res.status(201).json({ success: true, message: 'Pregunta enviada con éxito.', id: this.lastID });
  });
});

// --- Ruta principal para servir el HTML ---
// Express ya sirve index.html desde 'public' por defecto si existe.
// Si quieres ser explícito o servir otro archivo:
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });


// --- Iniciar Servidor ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Cerrar la conexión a la BD al terminar el proceso
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
    process.exit(0);
  });
});

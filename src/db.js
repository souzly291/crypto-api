import sqlite3 from 'sqlite3';

// Crea el archivo automáticamente si no existe
const db = new sqlite3.Database('./coins.db');

db.serialize(() => {
  // Tabla simple para guardar nombre, símbolo y precio
  db.run(`
    CREATE TABLE IF NOT EXISTS coins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      symbol TEXT,
      price_usd REAL
    )
  `);
});

export default db;
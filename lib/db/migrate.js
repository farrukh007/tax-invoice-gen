const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'invoicegen.db');
const migrationsPath = path.join(process.cwd(), 'lib', 'db', 'migrations');

async function migrate() {
  // Ensure data directory exists
  const dataDir = path.dirname(dbPath);
  try {
    await fs.promises.mkdir(dataDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }

  // Create database connection
  const db = new Database(dbPath);

  try {
    // Enable foreign keys
    db.pragma('foreign_keys = ON');

    // Create migrations table if it doesn't exist
    db.prepare(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Get list of applied migrations
    const appliedMigrations = db.prepare('SELECT name FROM migrations').all()
      .map(row => row.name);

    // Get list of migration files
    const files = await fs.promises.readdir(migrationsPath);
    const migrationFiles = files.filter(f => f.endsWith('.sql')).sort();

    // Apply new migrations
    for (const file of migrationFiles) {
      if (!appliedMigrations.includes(file)) {
        console.log(`Applying migration: ${file}`);
        const sql = await fs.promises.readFile(
          path.join(migrationsPath, file), 
          'utf8'
        );

        db.transaction(() => {
          db.exec(sql);
          db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
        })();

        console.log(`Migration applied: ${file}`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

migrate();
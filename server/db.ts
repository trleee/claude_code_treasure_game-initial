import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'treasure-game.db'));

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS game_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    treasure_found INTEGER NOT NULL DEFAULT 0,
    played_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export function createUser(username: string, passwordHash: string) {
  const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
  return stmt.run(username, passwordHash);
}

export function findUserByUsername(username: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as { id: number; username: string; password_hash: string; created_at: string } | undefined;
}

export function saveScore(userId: number, score: number, treasureFound: boolean) {
  const stmt = db.prepare('INSERT INTO game_scores (user_id, score, treasure_found) VALUES (?, ?, ?)');
  return stmt.run(userId, score, treasureFound ? 1 : 0);
}

export function getScores(userId: number) {
  const stmt = db.prepare('SELECT id, score, treasure_found as treasureFound, played_at as playedAt FROM game_scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 50');
  return stmt.all(userId);
}

export default db;

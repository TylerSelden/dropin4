import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB = await open({
  filename: './secrets/main.db',
  driver: sqlite3.Database
});

await DB.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    level TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room TEXT NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL
 );

 CREATE INDEX IF NOT EXISTS idx_messages_room_ts ON messages(room, timestamp);
`);

const logLevels = ['debug', 'info', 'warn', 'error'];
async function createLog(message, level) {
  const timestamp = Date.now();
  const finalLog = `[${new Date(timestamp).toISOString()}] [${level.toUpperCase()}] ${message}`;
  const logToConsole = logLevels.indexOf(level) >= logLevels.indexOf(process.env.CONSOLE_LOG_LEVEL || 'warn');
  const logToDB = logLevels.indexOf(level) >= logLevels.indexOf(process.env.DB_LOG_LEVEL || 'warn');

  if (logToConsole) {
    if (level === 'debug' || level === 'info') {
      console.log(finalLog);
    } else if (level === 'warn') {
      console.warn(finalLog);
    } else {
      console.error(finalLog);
    }
  }

  if (logToDB) DB.run('INSERT INTO logs (message, timestamp, level) VALUES (?, ?, ?)', message, timestamp, level);
}

export function Debug(message) { createLog(message, 'debug') };
export function Info(message) { createLog(message, 'info') };
export function Warn(message) { createLog(message, 'warn') }
export function Err(message) { createLog(message, 'error') }

const pruningStrategies = {
  age: async (table, limit) => {
    const cutoff = Date.now() - (limit * 24 * 60 * 60 * 1000);
    const { changes } = await DB.run(`DELETE FROM ${table} WHERE timestamp < ?`, cutoff);
    Info(`Deleted ${changes} ${table} older than ${limit} days`);
  },
  count: async (table, limit) => {
    const partition = table === 'messages' ? 'PARTITION BY room' : '';
    const { changes } = await DB.run(`
      DELETE FROM ${table} WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            ${partition} ORDER BY timestamp DESC, id DESC
          ) AS rn FROM ${table}
        ) WHERE rn > ?
      )`, limit);
    Info(`Deleted ${changes} ${table} to keep at most ${limit}${table === 'messages' ? ' per room' : ''}`);
  }
};
async function pruneTable(table, strategy, limit) {
  if (strategy === 'none') return;
  if (!pruningStrategies[strategy]) return Warn(`Invalid pruning strategy for ${table}: ${strategy}`);
  if (!Number.isInteger(limit) || limit <= 0) return Warn(`Invalid pruning limit for ${table}: ${limit}`);
  
  pruningStrategies[strategy]();
}

export async function Cleanup() {
  const messages = process.env.MESSAGE_PRUNING_STRATEGY || 'none';
  const logs = process.env.LOG_PRUNING_STRATEGY || 'none';
  if (messages === 'none' && logs === 'none') return;

  Info('Starting database cleanup');
  await pruneTable('messages', messages, parseInt(process.env.MESSAGE_PRUNING_LIMIT, 10));
  await pruneTable('logs', logs, parseInt(process.env.LOG_PRUNING_LIMIT, 10));
}

Info('Database initialized successfully');

export default DB;

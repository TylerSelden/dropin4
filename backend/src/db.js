import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB = await open({
  filename: './secrets/main.db',
  driver: sqlite3.Database
});

// TODO: db schema version upgrades
await DB.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  INSERT OR IGNORE INTO config (key, value) VALUES
    ('port', '8080'),
    ('db_log_level', 'info'),
    ('console_log_level', 'info');

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    level TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rooms (
    name TEXT PRIMARY KEY UNIQUE NOT NULL,
    created_at INTEGER NOT NULL,
    last_active_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room INTEGER NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL,

    FOREIGN KEY (room) REFERENCES rooms(name) ON DELETE CASCADE
 );
`);


const configCache = await DB.all('SELECT key, value FROM config').then(rows => {
  const cache = {};
  rows.forEach(row => {
    cache[row.key] = row.value;
  });
  return cache;
});
export function GetConfig(key) {
  return configCache[key];
}

export function SetConfig(key, value) {
  configCache[key] = value;
  return DB.run('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)', key, value);
}

const logLevels = ['debug', 'info', 'warn', 'error'];
async function createLog(message, level) {
  const timestamp = Date.now();
  const finalLog = `[${new Date(timestamp).toISOString()}] [${level.toUpperCase()}] ${message}`;
  const logToConsole = logLevels.indexOf(level) >= logLevels.indexOf(GetConfig('console_log_level'));
  const logToDB = logLevels.indexOf(level) >= logLevels.indexOf(GetConfig('db_log_level'));

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

const dbUpgrades = [
  null,
  () => {
    DB.exec(`DELETE FROM config WHERE key = 'log_level'`);
  },
  () => {
    DB.exec(`DROP TABLE users`);
  }
];

await (async () => {
  let userVersion = await DB.get('PRAGMA user_version').then(row => row.user_version);
  if (userVersion === 0) return DB.exec(`PRAGMA user_version = ${dbUpgrades.length - 1}`);
  while (userVersion < dbUpgrades.length) {
    userVersion++;
    const upgradeFunc = dbUpgrades[userVersion];
    if (upgradeFunc) {
      await upgradeFunc();
      Warn(`Upgraded database to version ${userVersion}`);
    }
  }
  await DB.exec(`PRAGMA user_version = ${dbUpgrades.length - 1}`);
})();

Info('Database initialized successfully');

export default DB;

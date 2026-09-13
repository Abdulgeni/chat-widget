import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const dbPath = path.join(process.cwd(), 'chat.db');
const backupDir = path.join(process.cwd(), 'backups');

if (!existsSync(backupDir)) mkdirSync(backupDir);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(backupDir, `chat-${timestamp}.db`);

copyFileSync(dbPath, backupPath);
console.log(`[backup] saved: ${backupPath}`);
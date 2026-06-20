import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from './schema';

let db: BetterSQLite3Database<typeof schema> | null = null;

const isDev = process.env.NODE_ENV === 'development';

export function initDatabase(dbPath: string) {
	const client = new Database(dbPath);
	client.pragma('journal_mode = WAL');

	db = drizzle(client, { schema });

	const migrationsFolder = isDev
		? path.join(__dirname, '..', 'lib', 'db', 'migrations')
		: path.join(process.resourcesPath, 'migrations');
	console.log('migrationsFolder:', migrationsFolder);
	console.log('exists:', fs.existsSync(migrationsFolder));
	console.log('contents:', fs.existsSync(migrationsFolder) ? fs.readdirSync(migrationsFolder) : 'N/A');
	console.log('journal exists:', fs.existsSync(path.join(migrationsFolder, 'meta', '_journal.json')));
	migrate(db, { migrationsFolder });

	return db;
}

export function getDb() {
	if (!db) throw new Error('Database not initialized');
	return db;
}

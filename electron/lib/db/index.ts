import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

let db: BetterSQLite3Database<typeof schema> | null = null;
let client: Database.Database | null = null;

const isDev = process.env.NODE_ENV === 'development';

export function initDatabase(dbPath: string) {
	client = new Database(dbPath);
	client.pragma('journal_mode = WAL');
	client.pragma('foreign_keys = ON');

	db = drizzle(client, { schema });

	const migrationsFolder = isDev
		? path.join(__dirname, '..', 'lib', 'db', 'migrations')
		: path.join(process.resourcesPath, 'migrations');
	migrate(db, { migrationsFolder });

	return db;
}

export function getDb() {
	if (!db) throw new Error('Database not initialized');
	return db;
}

export function getClient() {
	if (!client) throw new Error('Database not initialized');
	return client;
}

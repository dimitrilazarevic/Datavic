import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import path from 'path';
import * as schema from './schema';

let db: BetterSQLite3Database<typeof schema> | null = null;

export function initDatabase(dbPath: string) {
	const client = new Database(dbPath);
	client.pragma('journal_mode = WAL');

	db = drizzle(client, { schema });

	const migrationsFolder = path.join(__dirname, '..', 'lib', 'db', 'migrations');
	migrate(db, { migrationsFolder });

	return db;
}

export function getDb() {
	if (!db) throw new Error('Database not initialized');
	return db;
}

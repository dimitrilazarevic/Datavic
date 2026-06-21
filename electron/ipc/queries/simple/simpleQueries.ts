import { eq, type Column } from 'drizzle-orm';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { getDb } from '../../../lib/db';
import { handleDbError } from '../utils/handleDbError';

export function createSimpleQueries<T extends SQLiteTable>(
	table: T,
	idColumn: Column,
	tableName: string
) {
	type Row = T['$inferSelect'];
	type Insert = T['$inferInsert'];

	return {
		getAll(): Row[] {
			try {
				return getDb().select().from(table).all() as Row[];
			} catch (err) {
				handleDbError(err, `${tableName}.getAll`);
			}
		},

		create(data: Insert): Row {
			try {
				return getDb().insert(table).values(data).returning().get() as Row;
			} catch (err) {
				handleDbError(err, `${tableName}.create`);
			}
		},

		update(id: number, data: Partial<Insert>): Row {
			try {
				return getDb().update(table).set(data).where(eq(idColumn, id)).returning().get() as Row;
			} catch (err) {
				handleDbError(err, `${tableName}.update`);
			}
		},

		delete(id: number): Row {
			try {
				return getDb().delete(table).where(eq(idColumn, id)).returning().get() as Row;
			} catch (err) {
				handleDbError(err, `${tableName}.delete`);
			}
		}
	};
}

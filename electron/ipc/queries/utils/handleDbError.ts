import { SqliteError } from 'better-sqlite3';

export function handleDbError(err: unknown, methodName: string): never {
	console.error(`[DB] ${methodName}:`, err);

	if (err instanceof SqliteError) {
		const code = err.code;
		const msg = err.message;

		if (code === 'SQLITE_CONSTRAINT_UNIQUE') {
			const field = parseConstraintField(msg);
			throw new Error(`L'objet existe déjà${field ? ` (${field})` : ''}.`);
		}

		if (code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
			throw new Error("Un objet référencé n'a pas été trouvé.");
		}

		if (code === 'SQLITE_CONSTRAINT_NOTNULL') {
			const column = parseNotNullColumn(msg);
			throw new Error(`Il manque un champ requis${column ? ` : ${column}` : ''}.`);
		}

		if (code === 'SQLITE_CONSTRAINT_CHECK') {
			throw new Error('Une contrainte de validation a échoué.');
		}

		throw new Error(`Erreur DB [${code}] : ${msg}`);
	}

	throw new Error(`Erreur sur la BDD : ${err}`);
}

function parseConstraintField(msg: string): string | null {
	const match = msg.match(/UNIQUE constraint failed: (.+)/);
	if (!match) return null;
	return match[1]
		.split(',')
		.map((col) => col.trim().split('.').pop()!)
		.join(', ');
}

function parseNotNullColumn(msg: string): string | null {
	const match = msg.match(/NOT NULL constraint failed: \w+\.(\w+)/);
	return match?.[1] ?? null;
}

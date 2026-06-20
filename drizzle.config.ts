import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './electron/lib/db/schema.ts',
	out: './electron/lib/db/migrations',
	dialect: 'sqlite'
});

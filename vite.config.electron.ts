import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	build: {
		outDir: 'electron/dist',
		ssr: true,
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'electron/main.ts'),
				preload: path.resolve(__dirname, 'electron/preload.ts')
			},
			output: {
				format: 'cjs',
				entryFileNames: '[name].cjs'
			},
			external: ['electron', 'electron-updater', 'better-sqlite3']
		}
	}
});

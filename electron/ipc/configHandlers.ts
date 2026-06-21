import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { getDbFolder, setDbFolder, getDbPath } from '../lib/config';
import { getClient } from '../lib/db';

export function registerConfigHandlers() {
	ipcMain.handle('config:get-db-folder', (): string | null => {
		return getDbFolder();
	});

	ipcMain.handle('config:get-db-path', (): string => {
		return getDbPath();
	});

	ipcMain.handle('config:select-db-folder', async (): Promise<string | null> => {
		const win = BrowserWindow.getFocusedWindow();
		if (!win) return null;

		const result = await dialog.showOpenDialog(win, {
			properties: ['openDirectory'],
			title: 'Choisir le dossier de la base de données',
		});

		if (result.canceled || result.filePaths.length === 0) return null;

		const folder = result.filePaths[0];
		setDbFolder(folder);
		getClient().close();
		app.relaunch();
		app.exit(0);
		return folder;
	});

	ipcMain.handle('config:reset-db-folder', () => {
		setDbFolder(null);
		getClient().close();
		app.relaunch();
		app.exit(0);
	});

	ipcMain.handle('config:backup-db', async (): Promise<string | null> => {
		const win = BrowserWindow.getFocusedWindow();
		if (!win) return null;

		const defaultName = `datavic-backup-${Date.now()}.db`;

		const result = await dialog.showSaveDialog(win, {
			title: 'Sauvegarder la base de données',
			defaultPath: defaultName,
			filters: [{ name: 'SQLite', extensions: ['db'] }]
		});

		if (result.canceled || !result.filePath) return null;

		await getClient().backup(result.filePath);
		return result.filePath;
	});

	ipcMain.handle('config:restore-db', async (): Promise<boolean> => {
		const win = BrowserWindow.getFocusedWindow();
		if (!win) return false;

		const result = await dialog.showOpenDialog(win, {
			title: 'Importer une base de données',
			filters: [{ name: 'SQLite', extensions: ['db'] }],
			properties: ['openFile']
		});

		if (result.canceled || result.filePaths.length === 0) return false;

		const importPath = result.filePaths[0];
		const currentDbPath = getDbPath();

		const backupPath = path.join(
			path.dirname(currentDbPath),
			`datavic-pre-restore-${Date.now()}.db`
		);
		await getClient().backup(backupPath);

		getClient().close();
		fs.copyFileSync(importPath, currentDbPath);

		for (const ext of ['-wal', '-shm']) {
			const walFile = currentDbPath + ext;
			if (fs.existsSync(walFile)) fs.unlinkSync(walFile);
		}

		app.relaunch();
		app.exit(0);
		return true;
	});
}

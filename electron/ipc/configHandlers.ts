import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';
import AdmZip from 'adm-zip';
import { getDbFolder, setDbFolder, getDbPath } from '../lib/config';
import { getClient } from '../lib/db';
import { formatDateForFilename } from '../../shared/utils/formatDate';

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
			title: 'Choisir le dossier de la base de données'
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

		const defaultName = `datavic-backup-${formatDateForFilename()}.zip`;

		const result = await dialog.showSaveDialog(win, {
			title: 'Sauvegarder la base de données',
			defaultPath: defaultName,
			filters: [{ name: 'Archive ZIP', extensions: ['zip'] }]
		});

		if (result.canceled || !result.filePath) return null;

		const dbPath = getDbPath();
		const dbDir = path.dirname(dbPath);

		const tmpDbPath = path.join(
			app.getPath('temp'),
			`datavic-backup-${formatDateForFilename()}.db`
		);
		await getClient().backup(tmpDbPath);

		try {
			await new Promise<void>((resolve, reject) => {
				const output = fs.createWriteStream(result.filePath!);
				const archive = new ZipArchive({ zlib: { level: 9 } });

				output.on('close', resolve);
				archive.on('error', reject);

				archive.pipe(output);

				archive.file(tmpDbPath, { name: 'datavic.db' });

				for (const folder of ['bottles', 'materials'] as const) {
					const folderPath = path.join(dbDir, folder);
					if (fs.existsSync(folderPath)) {
						archive.directory(folderPath, folder);
					}
				}

				archive.finalize();
			});
		} finally {
			if (fs.existsSync(tmpDbPath)) fs.unlinkSync(tmpDbPath);
		}

		return result.filePath;
	});

	ipcMain.handle('config:restore-db', async (): Promise<boolean> => {
		const win = BrowserWindow.getFocusedWindow();
		if (!win) return false;

		const result = await dialog.showOpenDialog(win, {
			title: 'Importer une archive de sauvegarde',
			filters: [{ name: 'Archive ZIP', extensions: ['zip'] }],
			properties: ['openFile']
		});

		if (result.canceled || result.filePaths.length === 0) return false;

		const zip = new AdmZip(result.filePaths[0]);
		const entries = zip.getEntries();
		const hasDb = entries.some((e) => e.entryName.endsWith('.db'));
		if (!hasDb) throw new Error("L'archive ne contient aucun fichier .db");

		const currentDbPath = getDbPath();
		const dbDir = path.dirname(currentDbPath);

		const backupZipPath = path.join(dbDir, `datavic-pre-restore-${formatDateForFilename()}.zip`);
		const tmpDbPath = path.join(
			app.getPath('temp'),
			`datavic-pre-restore-${formatDateForFilename()}.db`
		);
		await getClient().backup(tmpDbPath);
		try {
			await new Promise<void>((resolve, reject) => {
				const output = fs.createWriteStream(backupZipPath);
				const archive = new ZipArchive({ zlib: { level: 9 } });
				output.on('close', resolve);
				archive.on('error', reject);
				archive.pipe(output);
				archive.file(tmpDbPath, { name: 'datavic.db' });
				for (const folder of ['bottles', 'materials'] as const) {
					const folderPath = path.join(dbDir, folder);
					if (fs.existsSync(folderPath)) {
						archive.directory(folderPath, folder);
					}
				}
				archive.finalize();
			});
		} finally {
			if (fs.existsSync(tmpDbPath)) fs.unlinkSync(tmpDbPath);
		}
		getClient().close();

		for (const name of ['bottles', 'materials'] as const) {
			const dir = path.join(dbDir, name);
			if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
		}
		for (const ext of ['', '-wal', '-shm']) {
			const file = currentDbPath + ext;
			if (fs.existsSync(file)) fs.unlinkSync(file);
		}

		zip.extractAllTo(dbDir, true);

		const extractedDb = entries.find((e) => e.entryName.endsWith('.db'));
		if (extractedDb) {
			const extractedPath = path.join(dbDir, extractedDb.entryName);
			if (extractedPath !== currentDbPath) {
				fs.renameSync(extractedPath, currentDbPath);
			}
		}

		app.relaunch();
		app.exit(0);
		return true;
	});
}

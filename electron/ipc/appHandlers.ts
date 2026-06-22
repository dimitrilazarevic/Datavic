import { app, ipcMain, shell } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import fs from 'fs';
import path from 'path';
import { getDbPath } from '../lib/config';

export function registerAppHandlers() {
	ipcMain.handle('get-version', () => {
		return app.getVersion();
	});

	ipcMain.handle('get-platform', () => {
		return process.platform;
	});

	ipcMain.handle('install-update', () => {
		autoUpdater.quitAndInstall();
	});

	ipcMain.handle('open-path', (_event, filePath: string) => {
		return shell.openPath(filePath);
	});

	ipcMain.handle(
		'get-entity-image',
		(_event, entity: 'bottles' | 'materials', folderName: string, ext: string) => {
			const filePath = path.join(path.dirname(getDbPath()), entity, folderName, `image.${ext}`);
			if (!fs.existsSync(filePath)) return null;
			const data = fs.readFileSync(filePath);
			const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
			return `data:${mime};base64,${data.toString('base64')}`;
		}
	);
}

import { app, ipcMain, shell } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

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

	ipcMain.handle('open-path', (_event, path: string) => {
		return shell.openPath(path);
	});
}

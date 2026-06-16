import { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';

const iconPath = isDev
	? path.join(__dirname, '..', 'appicon.png')
	: path.join(process.resourcesPath, 'appicon.png');

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		icon: iconPath,
		webPreferences: {
			preload: path.join(__dirname, 'preload.cjs'),
			nodeIntegration: false,
			contextIsolation: true
		}
	});

	if (isDev) {
		mainWindow.loadURL('http://localhost:5173');
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, '../../build/index.html'));
	}

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

function createTray() {
	try {
		const icon = nativeImage.createFromPath(iconPath);
		if (icon.isEmpty()) return;

		tray = new Tray(icon);
		tray.setToolTip('Datavic');

		const contextMenu = Menu.buildFromTemplate([
			{
				label: 'Ouvrir Datavic',
				click: () => {
					if (mainWindow) {
						mainWindow.show();
						mainWindow.focus();
					} else {
						createWindow();
					}
				}
			},
			{ type: 'separator' },
			{
				label: 'Quitter',
				click: () => {
					app.quit();
				}
			}
		]);

		tray.setContextMenu(contextMenu);

		tray.on('click', () => {
			if (mainWindow) {
				mainWindow.show();
				mainWindow.focus();
			} else {
				createWindow();
			}
		});
	} catch {
		console.warn('System tray not available');
	}
}

function setupAutoUpdater() {
	if (isDev) return;

	autoUpdater.checkForUpdatesAndNotify();

	autoUpdater.on('update-available', () => {
		mainWindow?.webContents.send('update-available');
	});

	autoUpdater.on('update-downloaded', () => {
		mainWindow?.webContents.send('update-downloaded');
	});
}

function registerIpcHandlers() {
	ipcMain.handle('get-version', () => {
		return app.getVersion();
	});

	ipcMain.handle('get-platform', () => {
		return process.platform;
	});

	ipcMain.handle('install-update', () => {
		autoUpdater.quitAndInstall();
	});
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
	createWindow();
	createTray();
	registerIpcHandlers();
	setupAutoUpdater();
});

import { app, BrowserWindow, Menu, Tray, nativeImage, protocol } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import path from 'path';
import fs from 'fs';
import { initDatabase } from './lib/db';
import { getDbPath } from './lib/config';
import { registerIpcHandlers } from './ipc';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const isDev = process.env.NODE_ENV === 'development';

protocol.registerSchemesAsPrivileged([
	{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);

const mimeTypes: Record<string, string> = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2'
};

const iconPath = isDev
	? path.join(__dirname, '.', 'appicon.png')
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
		mainWindow.loadURL('app://./');
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

	autoUpdater.checkForUpdatesAndNotify().catch((err: Error) => {
		console.warn('Auto-update check failed:', err.message);
	});

	autoUpdater.on('update-available', () => {
		mainWindow?.webContents.send('update-available');
	});

	autoUpdater.on('update-downloaded', () => {
		mainWindow?.webContents.send('update-downloaded');
	});
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
	const buildDir = path.join(__dirname, '../../build');

	protocol.handle('app', (request) => {
		let filePath = new URL(request.url).pathname;
		if (filePath === '/') filePath = '/index.html';
		const fullPath = path.join(buildDir, decodeURIComponent(filePath));
		const ext = path.extname(fullPath);
		const data = fs.readFileSync(fullPath);
		return new Response(data, {
			headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' }
		});
	});

	initDatabase(getDbPath());

	createWindow();
	createTray();
	registerIpcHandlers();
	setupAutoUpdater();
});

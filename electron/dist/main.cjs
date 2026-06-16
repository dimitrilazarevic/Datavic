//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let electron_updater = require("electron-updater");
electron_updater = __toESM(electron_updater, 1);
let path = require("path");
path = __toESM(path, 1);
//#region electron/main.ts
var { autoUpdater } = electron_updater.default;
var mainWindow = null;
var tray = null;
var isDev = process.env.NODE_ENV === "development";
var iconPath = isDev ? path.default.join(__dirname, "..", "appicon.png") : path.default.join(process.resourcesPath, "appicon.png");
function createWindow() {
	mainWindow = new electron.BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		icon: iconPath,
		webPreferences: {
			preload: path.default.join(__dirname, "preload.cjs"),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (isDev) {
		mainWindow.loadURL("http://localhost:5173");
		mainWindow.webContents.openDevTools();
	} else mainWindow.loadFile(path.default.join(__dirname, "../../build/index.html"));
	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}
function createTray() {
	try {
		const icon = electron.nativeImage.createFromPath(iconPath);
		if (icon.isEmpty()) return;
		tray = new electron.Tray(icon);
		tray.setToolTip("Datavic");
		const contextMenu = electron.Menu.buildFromTemplate([
			{
				label: "Ouvrir Datavic",
				click: () => {
					if (mainWindow) {
						mainWindow.show();
						mainWindow.focus();
					} else createWindow();
				}
			},
			{ type: "separator" },
			{
				label: "Quitter",
				click: () => {
					electron.app.quit();
				}
			}
		]);
		tray.setContextMenu(contextMenu);
		tray.on("click", () => {
			if (mainWindow) {
				mainWindow.show();
				mainWindow.focus();
			} else createWindow();
		});
	} catch {
		console.warn("System tray not available");
	}
}
function setupAutoUpdater() {
	if (isDev) return;
	autoUpdater.checkForUpdatesAndNotify();
	autoUpdater.on("update-available", () => {
		mainWindow?.webContents.send("update-available");
	});
	autoUpdater.on("update-downloaded", () => {
		mainWindow?.webContents.send("update-downloaded");
	});
}
function registerIpcHandlers() {
	electron.ipcMain.handle("get-version", () => {
		return electron.app.getVersion();
	});
	electron.ipcMain.handle("get-platform", () => {
		return process.platform;
	});
	electron.ipcMain.handle("install-update", () => {
		autoUpdater.quitAndInstall();
	});
}
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
electron.app.whenReady().then(() => {
	createWindow();
	createTray();
	registerIpcHandlers();
	setupAutoUpdater();
});
//#endregion

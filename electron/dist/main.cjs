//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
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
let url = require("url");
let drizzle_orm = require("drizzle-orm");
let drizzle_orm_better_sqlite3 = require("drizzle-orm/better-sqlite3");
let drizzle_orm_better_sqlite3_migrator = require("drizzle-orm/better-sqlite3/migrator");
let better_sqlite3 = require("better-sqlite3");
better_sqlite3 = __toESM(better_sqlite3, 1);
let drizzle_orm_sqlite_core = require("drizzle-orm/sqlite-core");
//#region electron/lib/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({ task: () => task });
var task = (0, drizzle_orm_sqlite_core.sqliteTable)("task", {
	id: (0, drizzle_orm_sqlite_core.text)("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	title: (0, drizzle_orm_sqlite_core.text)("title").notNull(),
	priority: (0, drizzle_orm_sqlite_core.integer)("priority").notNull().default(1)
});
//#endregion
//#region electron/lib/db/index.ts
var db = null;
var isDev$1 = process.env.NODE_ENV === "development";
function initDatabase(dbPath) {
	const client = new better_sqlite3.default(dbPath);
	client.pragma("journal_mode = WAL");
	db = (0, drizzle_orm_better_sqlite3.drizzle)(client, { schema: schema_exports });
	const migrationsFolder = isDev$1 ? path.default.join(__dirname, "..", "lib", "db", "migrations") : path.default.join(process.resourcesPath, "migrations");
	(0, drizzle_orm_better_sqlite3_migrator.migrate)(db, { migrationsFolder });
	return db;
}
function getDb() {
	if (!db) throw new Error("Database not initialized");
	return db;
}
//#endregion
//#region electron/main.ts
var { autoUpdater } = electron_updater.default;
var mainWindow = null;
var tray = null;
var isDev = process.env.NODE_ENV === "development";
electron.protocol.registerSchemesAsPrivileged([{
	scheme: "app",
	privileges: {
		standard: true,
		secure: true,
		supportFetchAPI: true
	}
}]);
var iconPath = isDev ? path.default.join(__dirname, ".", "appicon.png") : path.default.join(process.resourcesPath, "appicon.png");
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
	} else mainWindow.loadURL("app://./");
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
	electron.ipcMain.handle("db:get-tasks", () => {
		return getDb().select().from(task).all();
	});
	electron.ipcMain.handle("db:add-task", (_event, data) => {
		return getDb().insert(task).values(data).returning().get();
	});
	electron.ipcMain.handle("db:update-task", (_event, data) => {
		const { id, ...values } = data;
		return getDb().update(task).set(values).where((0, drizzle_orm.eq)(task.id, id)).returning().get();
	});
	electron.ipcMain.handle("db:delete-task", (_event, id) => {
		return getDb().delete(task).where((0, drizzle_orm.eq)(task.id, id)).returning().get();
	});
}
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
electron.app.whenReady().then(() => {
	const buildDir = path.default.join(__dirname, "../../build");
	electron.protocol.handle("app", (request) => {
		let filePath = new URL(request.url).pathname;
		if (filePath === "/") filePath = "/index.html";
		return electron.net.fetch((0, url.pathToFileURL)(path.default.join(buildDir, filePath)).toString());
	});
	initDatabase(path.default.join(electron.app.getPath("userData"), "datavic.db"));
	createWindow();
	createTray();
	registerIpcHandlers();
	setupAutoUpdater();
});
//#endregion

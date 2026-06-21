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
let fs = require("fs");
fs = __toESM(fs, 1);
let drizzle_orm_better_sqlite3 = require("drizzle-orm/better-sqlite3");
let drizzle_orm_better_sqlite3_migrator = require("drizzle-orm/better-sqlite3/migrator");
let better_sqlite3 = require("better-sqlite3");
better_sqlite3 = __toESM(better_sqlite3, 1);
let drizzle_orm_sqlite_core = require("drizzle-orm/sqlite-core");
let drizzle_orm = require("drizzle-orm");
//#region electron/lib/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	BOTTLE_ANALYSIS_TEST_TYPE: () => BOTTLE_ANALYSIS_TEST_TYPE,
	BOTTLE_ANALYSIS_THICKNESS_TYPE: () => BOTTLE_ANALYSIS_THICKNESS_TYPE,
	BOTTLE_STATUS: () => BOTTLE_STATUS,
	MATERIAL_ANALYSIS_TEST_DIRECTION: () => MATERIAL_ANALYSIS_TEST_DIRECTION,
	MATERIAL_ANALYSIS_TEST_TYPE: () => MATERIAL_ANALYSIS_TEST_TYPE,
	bottle: () => bottle,
	bottleAnalysis: () => bottleAnalysis,
	bottleType: () => bottleType,
	brand: () => brand,
	material: () => material,
	materialAnalysis: () => materialAnalysis,
	materialFamily: () => materialFamily,
	overbrand: () => overbrand,
	supplier: () => supplier,
	zone: () => zone
});
var BOTTLE_STATUS = [
	"DES",
	"PIL",
	"MOD"
];
var BOTTLE_ANALYSIS_TEST_TYPE = [
	"squeeze",
	"sideload_io",
	"sideload_ioi",
	"topload"
];
var BOTTLE_ANALYSIS_THICKNESS_TYPE = [
	"exp",
	"lin",
	"tom"
];
var MATERIAL_ANALYSIS_TEST_TYPE = ["ss", "fd"];
var MATERIAL_ANALYSIS_TEST_DIRECTION = [
	"avg",
	"rad",
	"long"
];
var bottleType = (0, drizzle_orm_sqlite_core.sqliteTable)("bottle_type", {
	bottleTypeId: (0, drizzle_orm_sqlite_core.integer)("bottle_type_id").primaryKey({ autoIncrement: true }),
	bottleTypeName: (0, drizzle_orm_sqlite_core.text)("bottle_type_name", { length: 100 }).notNull().unique(),
	bottleTypeConstant: (0, drizzle_orm_sqlite_core.real)("bottle_type_constant").notNull()
});
var brand = (0, drizzle_orm_sqlite_core.sqliteTable)("brand", {
	brandId: (0, drizzle_orm_sqlite_core.integer)("brand_id").primaryKey({ autoIncrement: true }),
	brandName: (0, drizzle_orm_sqlite_core.text)("brand_name", { length: 100 }).notNull().unique()
});
var overbrand = (0, drizzle_orm_sqlite_core.sqliteTable)("overbrand", {
	overBrandId: (0, drizzle_orm_sqlite_core.integer)("overbrand_id").primaryKey({ autoIncrement: true }),
	overbrandName: (0, drizzle_orm_sqlite_core.text)("overbrand_name", { length: 100 }).notNull().unique()
});
var zone = (0, drizzle_orm_sqlite_core.sqliteTable)("zone", {
	zoneId: (0, drizzle_orm_sqlite_core.integer)("zone_id").primaryKey({ autoIncrement: true }),
	zoneName: (0, drizzle_orm_sqlite_core.text)("zone_name", { length: 100 }).notNull().unique()
});
var materialFamily = (0, drizzle_orm_sqlite_core.sqliteTable)("material_family", {
	materialFamilyId: (0, drizzle_orm_sqlite_core.integer)("material_family_id").primaryKey({ autoIncrement: true }),
	materialFamilyName: (0, drizzle_orm_sqlite_core.text)("material_family_name", { length: 100 }).notNull().unique()
});
var supplier = (0, drizzle_orm_sqlite_core.sqliteTable)("supplier", {
	supplierId: (0, drizzle_orm_sqlite_core.integer)("supplier_id").primaryKey({ autoIncrement: true }),
	supplierName: (0, drizzle_orm_sqlite_core.text)("supplier_name", { length: 100 }).notNull().unique()
});
var bottle = (0, drizzle_orm_sqlite_core.sqliteTable)("bottle", {
	bottleId: (0, drizzle_orm_sqlite_core.integer)("bottle_id").primaryKey({ autoIncrement: true }),
	folderName: (0, drizzle_orm_sqlite_core.text)("folder_name", { length: 255 }).unique(),
	imagePath: (0, drizzle_orm_sqlite_core.text)("image_path"),
	claimMl: (0, drizzle_orm_sqlite_core.real)("claim_ml"),
	massG: (0, drizzle_orm_sqlite_core.text)("mass_g", { length: 20 }),
	version: (0, drizzle_orm_sqlite_core.text)("version"),
	status: (0, drizzle_orm_sqlite_core.text)("status", { enum: BOTTLE_STATUS }),
	pdmNumber: (0, drizzle_orm_sqlite_core.integer)("pdm_number"),
	overflowCapacityMl: (0, drizzle_orm_sqlite_core.real)("overflow_capacity_ml"),
	surfaceCm2: (0, drizzle_orm_sqlite_core.real)("surface_cm2"),
	thicknessMm: (0, drizzle_orm_sqlite_core.real)("thickness_mm"),
	massLossExp: (0, drizzle_orm_sqlite_core.real)("mass_loss_exp"),
	massLossNum: (0, drizzle_orm_sqlite_core.real)("mass_loss_num"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at"),
	lastModified: (0, drizzle_orm_sqlite_core.text)("last_modified"),
	bottleTypeId: (0, drizzle_orm_sqlite_core.integer)("bottle_type_id").notNull().references(() => bottleType.bottleTypeId),
	brandId: (0, drizzle_orm_sqlite_core.integer)("brand_id").notNull().references(() => brand.brandId),
	materialId: (0, drizzle_orm_sqlite_core.integer)("material_id").notNull().references(() => material.materialId),
	overbrandId: (0, drizzle_orm_sqlite_core.integer)("overbrand_id").notNull().references(() => overbrand.overBrandId),
	zoneId: (0, drizzle_orm_sqlite_core.integer)("zone_id").notNull().references(() => zone.zoneId)
});
var material = (0, drizzle_orm_sqlite_core.sqliteTable)("material", {
	materialId: (0, drizzle_orm_sqlite_core.integer)("material_id").primaryKey({ autoIncrement: true }),
	folderName: (0, drizzle_orm_sqlite_core.text)("folder_name", { length: 255 }).unique(),
	imagePath: (0, drizzle_orm_sqlite_core.text)("image_path"),
	temperatureC: (0, drizzle_orm_sqlite_core.integer)("temperature_c").notNull(),
	productionYear: (0, drizzle_orm_sqlite_core.integer)("production_year"),
	avgElasticModulus: (0, drizzle_orm_sqlite_core.real)("avg_elastic_modulus"),
	avgElasticLimit: (0, drizzle_orm_sqlite_core.real)("avg_elastic_limit"),
	longiAvgElasticModulus: (0, drizzle_orm_sqlite_core.real)("longi_avg_elastic_modulus"),
	longiAvgElasticLimit: (0, drizzle_orm_sqlite_core.real)("longi_avg_elastic_limit"),
	radAvgElasticModulus: (0, drizzle_orm_sqlite_core.real)("rad_avg_elastic_modulus"),
	radAvgElasticLimit: (0, drizzle_orm_sqlite_core.real)("rad_avg_elastic_limit"),
	syneAbaqusElasticModulus: (0, drizzle_orm_sqlite_core.real)("syne_abaqus_elastic_modulus"),
	syneAbaqusElasticLimit: (0, drizzle_orm_sqlite_core.real)("syne_abaqus_elastic_limit"),
	createdAt: (0, drizzle_orm_sqlite_core.text)("created_at"),
	lastModified: (0, drizzle_orm_sqlite_core.text)("last_modified"),
	ref1: (0, drizzle_orm_sqlite_core.text)("ref1", { length: 100 }),
	pct1: (0, drizzle_orm_sqlite_core.integer)("pct1").default(100),
	ref2: (0, drizzle_orm_sqlite_core.text)("ref2", { length: 100 }),
	pct2: (0, drizzle_orm_sqlite_core.integer)("pct2"),
	materialFamilyId: (0, drizzle_orm_sqlite_core.integer)("material_family_id").notNull().references(() => materialFamily.materialFamilyId),
	supplierId1: (0, drizzle_orm_sqlite_core.integer)("supplier_id_1").notNull().references(() => supplier.supplierId),
	supplierId2: (0, drizzle_orm_sqlite_core.integer)("supplier_id_2").references(() => supplier.supplierId)
}, (table) => [(0, drizzle_orm_sqlite_core.check)("pct_sum_100", drizzle_orm.sql`(COALESCE(${table.pct1}, 0) + COALESCE(${table.pct2}, 0)) = 100`)]);
var bottleAnalysis = (0, drizzle_orm_sqlite_core.sqliteTable)("bottle_analysis", {
	bottleAnalysisId: (0, drizzle_orm_sqlite_core.integer)("bottle_analysis_id").primaryKey({ autoIncrement: true }),
	testType: (0, drizzle_orm_sqlite_core.text)("test_type", { enum: BOTTLE_ANALYSIS_TEST_TYPE }).notNull(),
	thicknessType: (0, drizzle_orm_sqlite_core.text)("thickness_type", { enum: BOTTLE_ANALYSIS_THICKNESS_TYPE }).notNull(),
	bottleAnalysisKey: (0, drizzle_orm_sqlite_core.text)("bottle_analysis_key", { length: 40 }),
	fileName: (0, drizzle_orm_sqlite_core.text)("file_name", { length: 255 }),
	xCoordinates: (0, drizzle_orm_sqlite_core.text)("x_coordinates", { mode: "json" }).notNull().$type(),
	yCoordinates: (0, drizzle_orm_sqlite_core.text)("y_coordinates", { mode: "json" }).notNull().$type(),
	bottleId: (0, drizzle_orm_sqlite_core.integer)("bottle_id").notNull().references(() => bottle.bottleId, { onDelete: "cascade" }),
	fileContentText: (0, drizzle_orm_sqlite_core.text)("file_content_text").notNull()
});
var materialAnalysis = (0, drizzle_orm_sqlite_core.sqliteTable)("material_analysis", {
	materialAnalysisId: (0, drizzle_orm_sqlite_core.integer)("material_analysis_id").primaryKey({ autoIncrement: true }),
	testType: (0, drizzle_orm_sqlite_core.text)("test_type", { enum: MATERIAL_ANALYSIS_TEST_TYPE }).notNull(),
	testDirection: (0, drizzle_orm_sqlite_core.text)("test_direction", { enum: MATERIAL_ANALYSIS_TEST_DIRECTION }).notNull(),
	materialAnalysisKey: (0, drizzle_orm_sqlite_core.text)("material_analysis_key", { length: 40 }),
	fileName: (0, drizzle_orm_sqlite_core.text)("file_name", { length: 255 }),
	xCoordinates: (0, drizzle_orm_sqlite_core.text)("x_coordinates", { mode: "json" }).notNull().$type(),
	yCoordinates: (0, drizzle_orm_sqlite_core.text)("y_coordinates", { mode: "json" }).notNull().$type(),
	materialId: (0, drizzle_orm_sqlite_core.integer)("material_id").notNull().references(() => material.materialId, { onDelete: "cascade" }),
	fileContentText: (0, drizzle_orm_sqlite_core.text)("file_content_text").notNull()
});
//#endregion
//#region electron/lib/db/index.ts
var db = null;
var client = null;
var isDev$1 = process.env.NODE_ENV === "development";
function initDatabase(dbPath) {
	client = new better_sqlite3.default(dbPath);
	client.pragma("journal_mode = WAL");
	client.pragma("foreign_keys = ON");
	db = (0, drizzle_orm_better_sqlite3.drizzle)(client, { schema: schema_exports });
	const migrationsFolder = isDev$1 ? path.default.join(__dirname, "..", "lib", "db", "migrations") : path.default.join(process.resourcesPath, "migrations");
	(0, drizzle_orm_better_sqlite3_migrator.migrate)(db, { migrationsFolder });
	return db;
}
function getDb() {
	if (!db) throw new Error("Database not initialized");
	return db;
}
function getClient() {
	if (!client) throw new Error("Database not initialized");
	return client;
}
//#endregion
//#region electron/lib/config.ts
var configPath = path.default.join(electron.app.getPath("userData"), "config.json");
var defaults = { dbFolder: null };
function read() {
	try {
		return {
			...defaults,
			...JSON.parse(fs.default.readFileSync(configPath, "utf-8"))
		};
	} catch {
		return { ...defaults };
	}
}
function write(config) {
	fs.default.writeFileSync(configPath, JSON.stringify(config, null, "	"));
}
function getDbPath() {
	const { dbFolder } = read();
	const folder = dbFolder ?? electron.app.getPath("userData");
	return path.default.join(folder, "datavic.db");
}
function setDbFolder(folder) {
	const config = read();
	config.dbFolder = folder;
	write(config);
}
function getDbFolder() {
	return read().dbFolder;
}
//#endregion
//#region electron/ipc/appHandlers.ts
var { autoUpdater: autoUpdater$1 } = electron_updater.default;
function registerAppHandlers() {
	electron.ipcMain.handle("get-version", () => {
		return electron.app.getVersion();
	});
	electron.ipcMain.handle("get-platform", () => {
		return process.platform;
	});
	electron.ipcMain.handle("install-update", () => {
		autoUpdater$1.quitAndInstall();
	});
	electron.ipcMain.handle("open-path", (_event, path) => {
		return electron.shell.openPath(path);
	});
}
//#endregion
//#region electron/ipc/configHandlers.ts
function registerConfigHandlers() {
	electron.ipcMain.handle("config:get-db-folder", () => {
		return getDbFolder();
	});
	electron.ipcMain.handle("config:get-db-path", () => {
		return getDbPath();
	});
	electron.ipcMain.handle("config:select-db-folder", async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return null;
		const result = await electron.dialog.showOpenDialog(win, {
			properties: ["openDirectory"],
			title: "Choisir le dossier de la base de données"
		});
		if (result.canceled || result.filePaths.length === 0) return null;
		const folder = result.filePaths[0];
		setDbFolder(folder);
		getClient().close();
		electron.app.relaunch();
		electron.app.exit(0);
		return folder;
	});
	electron.ipcMain.handle("config:reset-db-folder", () => {
		setDbFolder(null);
		getClient().close();
		electron.app.relaunch();
		electron.app.exit(0);
	});
	electron.ipcMain.handle("config:backup-db", async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return null;
		const defaultName = `datavic-backup-${Date.now()}.db`;
		const result = await electron.dialog.showSaveDialog(win, {
			title: "Sauvegarder la base de données",
			defaultPath: defaultName,
			filters: [{
				name: "SQLite",
				extensions: ["db"]
			}]
		});
		if (result.canceled || !result.filePath) return null;
		await getClient().backup(result.filePath);
		return result.filePath;
	});
	electron.ipcMain.handle("config:restore-db", async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return false;
		const result = await electron.dialog.showOpenDialog(win, {
			title: "Importer une base de données",
			filters: [{
				name: "SQLite",
				extensions: ["db"]
			}],
			properties: ["openFile"]
		});
		if (result.canceled || result.filePaths.length === 0) return false;
		const importPath = result.filePaths[0];
		const currentDbPath = getDbPath();
		const backupPath = path.default.join(path.default.dirname(currentDbPath), `datavic-pre-restore-${Date.now()}.db`);
		await getClient().backup(backupPath);
		getClient().close();
		fs.default.copyFileSync(importPath, currentDbPath);
		for (const ext of ["-wal", "-shm"]) {
			const walFile = currentDbPath + ext;
			if (fs.default.existsSync(walFile)) fs.default.unlinkSync(walFile);
		}
		electron.app.relaunch();
		electron.app.exit(0);
		return true;
	});
}
//#endregion
//#region electron/ipc/queries/utils/handleDbError.ts
function handleDbError(err, methodName) {
	console.error(`[DB] ${methodName}:`, err);
	if (err instanceof better_sqlite3.SqliteError) {
		const code = err.code;
		const msg = err.message;
		if (code === "SQLITE_CONSTRAINT_UNIQUE") {
			const field = parseConstraintField(msg);
			throw new Error(`L'objet existe déjà${field ? ` (${field})` : ""}.`);
		}
		if (code === "SQLITE_CONSTRAINT_FOREIGNKEY") throw new Error("Un objet référencé n'a pas été trouvé.");
		if (code === "SQLITE_CONSTRAINT_NOTNULL") {
			const column = parseNotNullColumn(msg);
			throw new Error(`Il manque un champ requis${column ? ` : ${column}` : ""}.`);
		}
		if (code === "SQLITE_CONSTRAINT_CHECK") throw new Error("Une contrainte de validation a échoué.");
		throw new Error(`Erreur DB [${code}] : ${msg}`);
	}
	throw new Error(`Erreur inattendue sur la BDD : ${err}`);
}
function parseConstraintField(msg) {
	const match = msg.match(/UNIQUE constraint failed: (.+)/);
	if (!match) return null;
	return match[1].split(",").map((col) => col.trim().split(".").pop()).join(", ");
}
function parseNotNullColumn(msg) {
	return msg.match(/NOT NULL constraint failed: \w+\.(\w+)/)?.[1] ?? null;
}
//#endregion
//#region electron/ipc/queries/simple/simpleQueries.ts
function createSimpleQueries(table, idColumn, tableName) {
	return {
		getAll() {
			try {
				return getDb().select().from(table).all();
			} catch (err) {
				handleDbError(err, `${tableName}.getAll`);
			}
		},
		create(data) {
			try {
				return getDb().insert(table).values(data).returning().get();
			} catch (err) {
				handleDbError(err, `${tableName}.create`);
			}
		},
		update(id, data) {
			try {
				return getDb().update(table).set(data).where((0, drizzle_orm.eq)(idColumn, id)).returning().get();
			} catch (err) {
				handleDbError(err, `${tableName}.update`);
			}
		},
		delete(id) {
			try {
				return getDb().delete(table).where((0, drizzle_orm.eq)(idColumn, id)).returning().get();
			} catch (err) {
				handleDbError(err, `${tableName}.delete`);
			}
		}
	};
}
//#endregion
//#region electron/ipc/queries/simple/index.ts
var tables = {
	bottleType: createSimpleQueries(bottleType, bottleType.bottleTypeId, "bottleType"),
	brand: createSimpleQueries(brand, brand.brandId, "brand"),
	overbrand: createSimpleQueries(overbrand, overbrand.overBrandId, "overbrand"),
	zone: createSimpleQueries(zone, zone.zoneId, "zone"),
	materialFamily: createSimpleQueries(materialFamily, materialFamily.materialFamilyId, "materialFamily"),
	supplier: createSimpleQueries(supplier, supplier.supplierId, "supplier")
};
function registerSimpleHandlers() {
	for (const [name, queries] of Object.entries(tables)) {
		electron.ipcMain.handle(`db:${name}:getAll`, () => queries.getAll());
		electron.ipcMain.handle(`db:${name}:create`, (_event, data) => queries.create(data));
		electron.ipcMain.handle(`db:${name}:update`, (_event, id, data) => queries.update(id, data));
		electron.ipcMain.handle(`db:${name}:delete`, (_event, id) => queries.delete(id));
	}
}
//#endregion
//#region electron/ipc/index.ts
function registerIpcHandlers() {
	registerAppHandlers();
	registerConfigHandlers();
	registerSimpleHandlers();
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
var mimeTypes = {
	".html": "text/html",
	".js": "application/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".svg": "image/svg+xml",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2"
};
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
	autoUpdater.checkForUpdatesAndNotify().catch((err) => {
		console.warn("Auto-update check failed:", err.message);
	});
	autoUpdater.on("update-available", () => {
		mainWindow?.webContents.send("update-available");
	});
	autoUpdater.on("update-downloaded", () => {
		mainWindow?.webContents.send("update-downloaded");
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
		const fullPath = path.default.join(buildDir, decodeURIComponent(filePath));
		const ext = path.default.extname(fullPath);
		const data = fs.default.readFileSync(fullPath);
		return new Response(data, { headers: { "Content-Type": mimeTypes[ext] || "application/octet-stream" } });
	});
	initDatabase(getDbPath());
	createWindow();
	createTray();
	registerIpcHandlers();
	setupAutoUpdater();
});
//#endregion

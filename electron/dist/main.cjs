//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all)
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: 'Module' });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if ((from && typeof from === 'object') || typeof from === 'function')
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except)
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
		}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (
	(target = mod != null ? __create(__getProtoOf(mod)) : {}),
	__copyProps(
		isNodeMode || !mod || !mod.__esModule
			? __defProp(target, 'default', {
					value: mod,
					enumerable: true
				})
			: target,
		mod
	)
);
//#endregion
let electron = require('electron');
let electron_updater = require('electron-updater');
electron_updater = __toESM(electron_updater, 1);
let path = require('path');
path = __toESM(path, 1);
let fs = require('fs');
fs = __toESM(fs, 1);
let drizzle_orm_better_sqlite3 = require('drizzle-orm/better-sqlite3');
let drizzle_orm_better_sqlite3_migrator = require('drizzle-orm/better-sqlite3/migrator');
let better_sqlite3 = require('better-sqlite3');
better_sqlite3 = __toESM(better_sqlite3, 1);
let drizzle_orm_sqlite_core = require('drizzle-orm/sqlite-core');
let drizzle_orm = require('drizzle-orm');
let archiver = require('archiver');
let adm_zip = require('adm-zip');
adm_zip = __toESM(adm_zip, 1);
//#region shared/enums.ts
var BOTTLE_STATUS = ['DES', 'PIL', 'MOD'];
var BOTTLE_ANALYSIS_TEST_TYPE = ['squeeze', 'sideload_io', 'sideload_ioi', 'topload'];
var BOTTLE_ANALYSIS_THICKNESS_TYPE = ['exp', 'lin', 'tom'];
var BOTTLE_ANALYSIS_KEYS = BOTTLE_ANALYSIS_TEST_TYPE.flatMap((t) =>
	BOTTLE_ANALYSIS_THICKNESS_TYPE.map((b) => `${t}_${b}`)
);
BOTTLE_ANALYSIS_KEYS.map((k) => `${k}.txt`);
var MATERIAL_ANALYSIS_TEST_TYPE = ['ss', 'fd'];
var MATERIAL_ANALYSIS_TEST_DIRECTION = ['avg', 'rad', 'long'];
var MATERIAL_ANALYSIS_KEYS = MATERIAL_ANALYSIS_TEST_TYPE.flatMap((t) =>
	MATERIAL_ANALYSIS_TEST_DIRECTION.map((d) => `${t}_${d}`)
);
MATERIAL_ANALYSIS_KEYS.map((k) => `${k}.txt`);
//#endregion
//#region electron/lib/db/schema.ts
var schema_exports = /* @__PURE__ */ __exportAll({
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
var bottleType = (0, drizzle_orm_sqlite_core.sqliteTable)('bottle_type', {
	bottleTypeId: (0, drizzle_orm_sqlite_core.integer)('bottle_type_id').primaryKey({
		autoIncrement: true
	}),
	bottleTypeName: (0, drizzle_orm_sqlite_core.text)('bottle_type_name', { length: 100 })
		.notNull()
		.unique(),
	bottleTypeConstant: (0, drizzle_orm_sqlite_core.real)('bottle_type_constant').notNull()
});
var brand = (0, drizzle_orm_sqlite_core.sqliteTable)('brand', {
	brandId: (0, drizzle_orm_sqlite_core.integer)('brand_id').primaryKey({ autoIncrement: true }),
	brandName: (0, drizzle_orm_sqlite_core.text)('brand_name', { length: 100 }).notNull().unique()
});
var overbrand = (0, drizzle_orm_sqlite_core.sqliteTable)('overbrand', {
	overBrandId: (0, drizzle_orm_sqlite_core.integer)('overbrand_id').primaryKey({
		autoIncrement: true
	}),
	overbrandName: (0, drizzle_orm_sqlite_core.text)('overbrand_name', { length: 100 })
		.notNull()
		.unique()
});
var zone = (0, drizzle_orm_sqlite_core.sqliteTable)('zone', {
	zoneId: (0, drizzle_orm_sqlite_core.integer)('zone_id').primaryKey({ autoIncrement: true }),
	zoneName: (0, drizzle_orm_sqlite_core.text)('zone_name', { length: 100 }).notNull().unique()
});
var materialFamily = (0, drizzle_orm_sqlite_core.sqliteTable)('material_family', {
	materialFamilyId: (0, drizzle_orm_sqlite_core.integer)('material_family_id').primaryKey({
		autoIncrement: true
	}),
	materialFamilyName: (0, drizzle_orm_sqlite_core.text)('material_family_name', { length: 100 })
		.notNull()
		.unique()
});
var supplier = (0, drizzle_orm_sqlite_core.sqliteTable)('supplier', {
	supplierId: (0, drizzle_orm_sqlite_core.integer)('supplier_id').primaryKey({
		autoIncrement: true
	}),
	supplierName: (0, drizzle_orm_sqlite_core.text)('supplier_name', { length: 100 })
		.notNull()
		.unique()
});
var bottle = (0, drizzle_orm_sqlite_core.sqliteTable)('bottle', {
	bottleId: (0, drizzle_orm_sqlite_core.integer)('bottle_id').primaryKey({ autoIncrement: true }),
	folderName: (0, drizzle_orm_sqlite_core.text)('folder_name', { length: 255 }).unique(),
	imageExtension: (0, drizzle_orm_sqlite_core.text)('image_extension', { length: 10 }),
	claimMl: (0, drizzle_orm_sqlite_core.real)('claim_ml'),
	massG: (0, drizzle_orm_sqlite_core.text)('mass_g', { length: 20 }),
	version: (0, drizzle_orm_sqlite_core.text)('version'),
	status: (0, drizzle_orm_sqlite_core.text)('status', { enum: BOTTLE_STATUS }),
	pdmNumber: (0, drizzle_orm_sqlite_core.integer)('pdm_number'),
	overflowCapacityMl: (0, drizzle_orm_sqlite_core.real)('overflow_capacity_ml'),
	surfaceCm2: (0, drizzle_orm_sqlite_core.real)('surface_cm2'),
	thicknessMm: (0, drizzle_orm_sqlite_core.real)('thickness_mm'),
	massLossExp: (0, drizzle_orm_sqlite_core.real)('mass_loss_exp'),
	createdAt: (0, drizzle_orm_sqlite_core.text)('created_at'),
	lastModified: (0, drizzle_orm_sqlite_core.text)('last_modified'),
	bottleTypeId: (0, drizzle_orm_sqlite_core.integer)('bottle_type_id')
		.notNull()
		.references(() => bottleType.bottleTypeId),
	brandId: (0, drizzle_orm_sqlite_core.integer)('brand_id')
		.notNull()
		.references(() => brand.brandId),
	materialId: (0, drizzle_orm_sqlite_core.integer)('material_id')
		.notNull()
		.references(() => material.materialId),
	overbrandId: (0, drizzle_orm_sqlite_core.integer)('overbrand_id')
		.notNull()
		.references(() => overbrand.overBrandId),
	zoneId: (0, drizzle_orm_sqlite_core.integer)('zone_id')
		.notNull()
		.references(() => zone.zoneId)
});
var material = (0, drizzle_orm_sqlite_core.sqliteTable)(
	'material',
	{
		materialId: (0, drizzle_orm_sqlite_core.integer)('material_id').primaryKey({
			autoIncrement: true
		}),
		folderName: (0, drizzle_orm_sqlite_core.text)('folder_name', { length: 255 }).unique(),
		imageExtension: (0, drizzle_orm_sqlite_core.text)('image_extension', { length: 10 }),
		temperatureC: (0, drizzle_orm_sqlite_core.integer)('temperature_c').notNull(),
		productionYear: (0, drizzle_orm_sqlite_core.integer)('production_year'),
		avgElasticModulus: (0, drizzle_orm_sqlite_core.real)('avg_elastic_modulus'),
		avgElasticLimit: (0, drizzle_orm_sqlite_core.real)('avg_elastic_limit'),
		longiAvgElasticModulus: (0, drizzle_orm_sqlite_core.real)('longi_avg_elastic_modulus'),
		longiAvgElasticLimit: (0, drizzle_orm_sqlite_core.real)('longi_avg_elastic_limit'),
		radAvgElasticModulus: (0, drizzle_orm_sqlite_core.real)('rad_avg_elastic_modulus'),
		radAvgElasticLimit: (0, drizzle_orm_sqlite_core.real)('rad_avg_elastic_limit'),
		syneAbaqusElasticModulus: (0, drizzle_orm_sqlite_core.real)('syne_abaqus_elastic_modulus'),
		syneAbaqusElasticLimit: (0, drizzle_orm_sqlite_core.real)('syne_abaqus_elastic_limit'),
		createdAt: (0, drizzle_orm_sqlite_core.text)('created_at'),
		lastModified: (0, drizzle_orm_sqlite_core.text)('last_modified'),
		ref1: (0, drizzle_orm_sqlite_core.text)('ref1', { length: 100 }),
		pct1: (0, drizzle_orm_sqlite_core.integer)('pct1').default(100),
		ref2: (0, drizzle_orm_sqlite_core.text)('ref2', { length: 100 }),
		pct2: (0, drizzle_orm_sqlite_core.integer)('pct2'),
		materialFamilyId: (0, drizzle_orm_sqlite_core.integer)('material_family_id')
			.notNull()
			.references(() => materialFamily.materialFamilyId),
		supplierId1: (0, drizzle_orm_sqlite_core.integer)('supplier_id_1')
			.notNull()
			.references(() => supplier.supplierId),
		supplierId2: (0, drizzle_orm_sqlite_core.integer)('supplier_id_2').references(
			() => supplier.supplierId
		)
	},
	(table) => [
		(0, drizzle_orm_sqlite_core.check)(
			'pct_sum_100',
			drizzle_orm.sql`(COALESCE(${table.pct1}, 0) + COALESCE(${table.pct2}, 0)) = 100`
		)
	]
);
var bottleAnalysis = (0, drizzle_orm_sqlite_core.sqliteTable)('bottle_analysis', {
	bottleAnalysisId: (0, drizzle_orm_sqlite_core.integer)('bottle_analysis_id').primaryKey({
		autoIncrement: true
	}),
	testType: (0, drizzle_orm_sqlite_core.text)('test_type', {
		enum: BOTTLE_ANALYSIS_TEST_TYPE
	}).notNull(),
	thicknessType: (0, drizzle_orm_sqlite_core.text)('thickness_type', {
		enum: BOTTLE_ANALYSIS_THICKNESS_TYPE
	}).notNull(),
	bottleAnalysisKey: (0, drizzle_orm_sqlite_core.text)('bottle_analysis_key', { length: 40 }),
	fileName: (0, drizzle_orm_sqlite_core.text)('file_name', { length: 255 }),
	xCoordinates: (0, drizzle_orm_sqlite_core.text)('x_coordinates', { mode: 'json' })
		.notNull()
		.$type(),
	yCoordinates: (0, drizzle_orm_sqlite_core.text)('y_coordinates', { mode: 'json' })
		.notNull()
		.$type(),
	bottleId: (0, drizzle_orm_sqlite_core.integer)('bottle_id')
		.notNull()
		.references(() => bottle.bottleId, { onDelete: 'cascade' }),
	fileContentText: (0, drizzle_orm_sqlite_core.text)('file_content_text').notNull()
});
var materialAnalysis = (0, drizzle_orm_sqlite_core.sqliteTable)('material_analysis', {
	materialAnalysisId: (0, drizzle_orm_sqlite_core.integer)('material_analysis_id').primaryKey({
		autoIncrement: true
	}),
	testType: (0, drizzle_orm_sqlite_core.text)('test_type', {
		enum: MATERIAL_ANALYSIS_TEST_TYPE
	}).notNull(),
	testDirection: (0, drizzle_orm_sqlite_core.text)('test_direction', {
		enum: MATERIAL_ANALYSIS_TEST_DIRECTION
	}).notNull(),
	materialAnalysisKey: (0, drizzle_orm_sqlite_core.text)('material_analysis_key', { length: 40 }),
	fileName: (0, drizzle_orm_sqlite_core.text)('file_name', { length: 255 }),
	xCoordinates: (0, drizzle_orm_sqlite_core.text)('x_coordinates', { mode: 'json' })
		.notNull()
		.$type(),
	yCoordinates: (0, drizzle_orm_sqlite_core.text)('y_coordinates', { mode: 'json' })
		.notNull()
		.$type(),
	materialId: (0, drizzle_orm_sqlite_core.integer)('material_id')
		.notNull()
		.references(() => material.materialId, { onDelete: 'cascade' }),
	fileContentText: (0, drizzle_orm_sqlite_core.text)('file_content_text').notNull()
});
//#endregion
//#region electron/lib/db/index.ts
var db = null;
var client = null;
var isDev$1 = process.env.NODE_ENV === 'development';
function initDatabase(dbPath) {
	client = new better_sqlite3.default(dbPath);
	client.pragma('journal_mode = WAL');
	client.pragma('foreign_keys = ON');
	db = (0, drizzle_orm_better_sqlite3.drizzle)(client, { schema: schema_exports });
	const migrationsFolder = isDev$1
		? path.default.join(__dirname, '..', 'lib', 'db', 'migrations')
		: path.default.join(process.resourcesPath, 'migrations');
	try {
		(0, drizzle_orm_better_sqlite3_migrator.migrate)(db, { migrationsFolder });
	} catch (err) {
		console.error(`Migration pas appliquée`, err);
	}
	return db;
}
function getDb() {
	if (!db) throw new Error('Database not initialized');
	return db;
}
function getClient() {
	if (!client) throw new Error('Database not initialized');
	return client;
}
//#endregion
//#region electron/lib/config.ts
var configPath = path.default.join(electron.app.getPath('userData'), 'config.json');
var defaults = { dbFolder: null };
function read() {
	try {
		return {
			...defaults,
			...JSON.parse(fs.default.readFileSync(configPath, 'utf-8'))
		};
	} catch {
		return { ...defaults };
	}
}
function write(config) {
	fs.default.writeFileSync(configPath, JSON.stringify(config, null, '	'));
}
function getDbPath() {
	const { dbFolder } = read();
	const folder = dbFolder ?? electron.app.getPath('userData');
	return path.default.join(folder, 'datavic.db');
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
	electron.ipcMain.handle('get-version', () => {
		return electron.app.getVersion();
	});
	electron.ipcMain.handle('get-platform', () => {
		return process.platform;
	});
	electron.ipcMain.handle('install-update', () => {
		autoUpdater$1.quitAndInstall();
	});
	electron.ipcMain.handle('open-path', (_event, filePath) => {
		return electron.shell.openPath(filePath);
	});
	electron.ipcMain.handle('get-entity-image', (_event, entity, folderName, ext) => {
		const filePath = path.default.join(
			path.default.dirname(getDbPath()),
			entity,
			folderName,
			`image.${ext}`
		);
		if (!fs.default.existsSync(filePath)) return null;
		const data = fs.default.readFileSync(filePath);
		return `data:${ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`};base64,${data.toString('base64')}`;
	});
}
//#endregion
//#region shared/utils/formatDate.ts
function formatDateForFilename(date = /* @__PURE__ */ new Date()) {
	return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}-${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
}
//#endregion
//#region electron/ipc/configHandlers.ts
function registerConfigHandlers() {
	electron.ipcMain.handle('config:get-db-folder', () => {
		return getDbFolder();
	});
	electron.ipcMain.handle('config:get-db-path', () => {
		return getDbPath();
	});
	electron.ipcMain.handle('config:select-db-folder', async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return null;
		const result = await electron.dialog.showOpenDialog(win, {
			properties: ['openDirectory'],
			title: 'Choisir le dossier de la base de données'
		});
		if (result.canceled || result.filePaths.length === 0) return null;
		const folder = result.filePaths[0];
		setDbFolder(folder);
		getClient().close();
		electron.app.relaunch();
		electron.app.exit(0);
		return folder;
	});
	electron.ipcMain.handle('config:reset-db-folder', () => {
		setDbFolder(null);
		getClient().close();
		electron.app.relaunch();
		electron.app.exit(0);
	});
	electron.ipcMain.handle('config:backup-db', async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return null;
		const defaultName = `datavic-backup-${formatDateForFilename()}.zip`;
		const result = await electron.dialog.showSaveDialog(win, {
			title: 'Sauvegarder la base de données',
			defaultPath: defaultName,
			filters: [
				{
					name: 'Archive ZIP',
					extensions: ['zip']
				}
			]
		});
		if (result.canceled || !result.filePath) return null;
		const dbPath = getDbPath();
		const dbDir = path.default.dirname(dbPath);
		const tmpDbPath = path.default.join(
			electron.app.getPath('temp'),
			`datavic-backup-${formatDateForFilename()}.db`
		);
		await getClient().backup(tmpDbPath);
		try {
			await new Promise((resolve, reject) => {
				const output = fs.default.createWriteStream(result.filePath);
				const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
				output.on('close', resolve);
				archive.on('error', reject);
				archive.pipe(output);
				archive.file(tmpDbPath, { name: 'datavic.db' });
				for (const folder of ['bottles', 'materials']) {
					const folderPath = path.default.join(dbDir, folder);
					if (fs.default.existsSync(folderPath)) archive.directory(folderPath, folder);
				}
				archive.finalize();
			});
		} finally {
			if (fs.default.existsSync(tmpDbPath)) fs.default.unlinkSync(tmpDbPath);
		}
		return result.filePath;
	});
	electron.ipcMain.handle('config:restore-db', async () => {
		const win = electron.BrowserWindow.getFocusedWindow();
		if (!win) return false;
		const result = await electron.dialog.showOpenDialog(win, {
			title: 'Importer une archive de sauvegarde',
			filters: [
				{
					name: 'Archive ZIP',
					extensions: ['zip']
				}
			],
			properties: ['openFile']
		});
		if (result.canceled || result.filePaths.length === 0) return false;
		const zip = new adm_zip.default(result.filePaths[0]);
		const entries = zip.getEntries();
		if (!entries.some((e) => e.entryName.endsWith('.db')))
			throw new Error("L'archive ne contient aucun fichier .db");
		const currentDbPath = getDbPath();
		const dbDir = path.default.dirname(currentDbPath);
		const backupZipPath = path.default.join(
			dbDir,
			`datavic-pre-restore-${formatDateForFilename()}.zip`
		);
		const tmpDbPath = path.default.join(
			electron.app.getPath('temp'),
			`datavic-pre-restore-${formatDateForFilename()}.db`
		);
		await getClient().backup(tmpDbPath);
		try {
			await new Promise((resolve, reject) => {
				const output = fs.default.createWriteStream(backupZipPath);
				const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
				output.on('close', resolve);
				archive.on('error', reject);
				archive.pipe(output);
				archive.file(tmpDbPath, { name: 'datavic.db' });
				for (const folder of ['bottles', 'materials']) {
					const folderPath = path.default.join(dbDir, folder);
					if (fs.default.existsSync(folderPath)) archive.directory(folderPath, folder);
				}
				archive.finalize();
			});
		} finally {
			if (fs.default.existsSync(tmpDbPath)) fs.default.unlinkSync(tmpDbPath);
		}
		getClient().close();
		for (const name of ['bottles', 'materials']) {
			const dir = path.default.join(dbDir, name);
			if (fs.default.existsSync(dir)) fs.default.rmSync(dir, { recursive: true });
		}
		for (const ext of ['', '-wal', '-shm']) {
			const file = currentDbPath + ext;
			if (fs.default.existsSync(file)) fs.default.unlinkSync(file);
		}
		zip.extractAllTo(dbDir, true);
		const extractedDb = entries.find((e) => e.entryName.endsWith('.db'));
		if (extractedDb) {
			const extractedPath = path.default.join(dbDir, extractedDb.entryName);
			if (extractedPath !== currentDbPath) fs.default.renameSync(extractedPath, currentDbPath);
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
		if (code === 'SQLITE_CONSTRAINT_UNIQUE') {
			const field = parseConstraintField(msg);
			throw new Error(`L'objet existe déjà${field ? ` (${field})` : ''}.`);
		}
		if (code === 'SQLITE_CONSTRAINT_FOREIGNKEY')
			throw new Error("Un objet référencé n'a pas été trouvé.");
		if (code === 'SQLITE_CONSTRAINT_NOTNULL') {
			const column = parseNotNullColumn(msg);
			throw new Error(`Il manque un champ requis${column ? ` : ${column}` : ''}.`);
		}
		if (code === 'SQLITE_CONSTRAINT_CHECK')
			throw new Error('Une contrainte de validation a échoué.');
		throw new Error(`Erreur DB [${code}] : ${msg}`);
	}
	throw new Error(`Erreur sur la BDD : ${err}`);
}
function parseConstraintField(msg) {
	const match = msg.match(/UNIQUE constraint failed: (.+)/);
	if (!match) return null;
	return match[1]
		.split(',')
		.map((col) => col.trim().split('.').pop())
		.join(', ');
}
function parseNotNullColumn(msg) {
	return msg.match(/NOT NULL constraint failed: \w+\.(\w+)/)?.[1] ?? null;
}
//#endregion
//#region electron/ipc/queries/simple/simpleQueries.ts
function createSimpleQueries(table, idColumn, tableName, getLinkedIds) {
	const idKey = Object.entries(table).find(([, col]) => col === idColumn)?.[0];
	return {
		getAll() {
			try {
				const rows = getDb().select().from(table).all();
				const linkedIds = getLinkedIds();
				return rows.map((row) => ({
					...row,
					isLinked: linkedIds.has(row[idKey])
				}));
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
				return getDb()
					.update(table)
					.set(data)
					.where((0, drizzle_orm.eq)(idColumn, id))
					.returning()
					.get();
			} catch (err) {
				handleDbError(err, `${tableName}.update`);
			}
		},
		delete(id) {
			try {
				return getDb()
					.delete(table)
					.where((0, drizzle_orm.eq)(idColumn, id))
					.returning()
					.get();
			} catch (err) {
				handleDbError(err, `${tableName}.delete`);
			}
		}
	};
}
//#endregion
//#region electron/ipc/queries/simple/index.ts
var tables = {
	bottleType: createSimpleQueries(bottleType, bottleType.bottleTypeId, 'bottleType', () => {
		return new Set(
			getDb()
				.select({ id: bottle.bottleTypeId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	brand: createSimpleQueries(brand, brand.brandId, 'brand', () => {
		return new Set(
			getDb()
				.select({ id: bottle.brandId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	overbrand: createSimpleQueries(overbrand, overbrand.overBrandId, 'overbrand', () => {
		return new Set(
			getDb()
				.select({ id: bottle.overbrandId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	zone: createSimpleQueries(zone, zone.zoneId, 'zone', () => {
		return new Set(
			getDb()
				.select({ id: bottle.zoneId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	materialFamily: createSimpleQueries(
		materialFamily,
		materialFamily.materialFamilyId,
		'materialFamily',
		() => {
			return new Set(
				getDb()
					.select({ id: material.materialFamilyId })
					.from(material)
					.all()
					.map((r) => r.id)
			);
		}
	),
	supplier: createSimpleQueries(supplier, supplier.supplierId, 'supplier', () => {
		const rows = getDb()
			.select({
				id1: material.supplierId1,
				id2: material.supplierId2
			})
			.from(material)
			.all();
		const ids = /* @__PURE__ */ new Set();
		for (const row of rows) {
			ids.add(row.id1);
			if (row.id2 !== null) ids.add(row.id2);
		}
		return ids;
	})
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
//#region shared/utils/create_filename.ts
function createBottleFileName(b) {
	return `${b.overbrandName}_${b.brandName}_${b.overflowCapacityMl}Ml_${b.version}_${b.massG}_${b.materialFamilyName}_${b.bottleId}`;
}
function createMaterialFileName(m) {
	return `${m.materialFamilyName}_${m.supplierName1}${m.pct1}p${m.supplierId2 ? `${m.supplierName2}${m.pct2}` : ``}_${m.materialId}`;
}
//#endregion
//#region electron/lib/fileutil.ts
function getEntityDir(entity, folderName) {
	const dbDir = path.default.dirname(getDbPath());
	return path.default.join(dbDir, entity, folderName);
}
function ensureEntityDir(entity, folderName) {
	const dir = getEntityDir(entity, folderName);
	fs.default.mkdirSync(dir, { recursive: true });
	return dir;
}
function deleteEntityDir(entity, folderName) {
	const dir = getEntityDir(entity, folderName);
	try {
		fs.default.rmSync(dir, { recursive: true });
	} catch {}
}
function saveImage(entity, folderName, ext, data) {
	const dir = ensureEntityDir(entity, folderName);
	const filePath = path.default.join(dir, `image.${ext}`);
	fs.default.writeFileSync(filePath, data);
	return filePath;
}
function saveAnalysisFile(entity, folderName, fileName, content) {
	const dir = ensureEntityDir(entity, folderName);
	const filePath = path.default.join(dir, fileName);
	fs.default.writeFileSync(filePath, content, 'utf-8');
	return filePath;
}
function deleteImage(entity, folderName, ext) {
	const filePath = path.default.join(getEntityDir(entity, folderName), `image.${ext}`);
	try {
		fs.default.unlinkSync(filePath);
	} catch {}
}
//#endregion
//#region electron/ipc/queries/utils/exportEntitiesZip.ts
async function exportEntitiesZip(entity, folderNames) {
	const win = electron.BrowserWindow.getFocusedWindow();
	if (!win) return null;
	const defaultName = `datavic-${entity}-${formatDateForFilename()}.zip`;
	const result = await electron.dialog.showSaveDialog(win, {
		title: `Exporter ${entity}`,
		defaultPath: defaultName,
		filters: [
			{
				name: 'Archive ZIP',
				extensions: ['zip']
			}
		]
	});
	if (result.canceled || !result.filePath) return null;
	const dbDir = path.default.dirname(getDbPath());
	await new Promise((resolve, reject) => {
		const output = fs.default.createWriteStream(result.filePath);
		const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
		output.on('close', resolve);
		archive.on('error', reject);
		archive.pipe(output);
		for (const folderName of folderNames) {
			const folderPath = path.default.join(dbDir, entity, folderName);
			if (fs.default.existsSync(folderPath)) archive.directory(folderPath, folderName);
		}
		archive.finalize();
	});
	return result.filePath;
}
//#endregion
//#region shared/utils/parse_analysis_key.ts
/**
 * Décompose une clé d'analyse en ses composantes : type de test et type d'épaisseur.
 *
 * Les clés suivent le format `{testType}_{thicknessType}`, où `testType` peut lui-même
 * contenir des underscores (ex. `sideload_io`). La décomposition se fait en cherchant
 * un suffixe correspondant à un type d'épaisseur connu, plutôt qu'en splitant sur le
 * premier underscore.
 *
 * @param key - La clé à décomposer (ex. `"squeeze_exp"`, `"sideload_io_lin"`).
 * @returns Un tuple `[testType, thicknessType]`.
 *
 * @throws {Error} Si `key` ne se termine pas par un suffixe d'épaisseur reconnu.
 *
 * @example
 * parseBottleAnalysisKey("squeeze_exp");     // → ["squeeze", "exp"]
 * parseBottleAnalysisKey("sideload_io_lin"); // → ["sideload_io", "lin"]
 */
function parseBottleAnalysisKey(key) {
	for (const thickness of BOTTLE_ANALYSIS_THICKNESS_TYPE)
		if (key.endsWith(`_${thickness}`)) return [key.slice(0, -(thickness.length + 1)), thickness];
	throw new Error(`Invalid analysis key: ${key}`);
}
/**
 * Décompose une clé d'analyse matériau en ses composantes : type de test et direction.
 *
 * Les clés suivent le format `{testType}_{testDirection}`.
 *
 * @param key - La clé à décomposer (ex. `"ss_avg"`, `"fd_long"`).
 * @returns Un tuple `[testType, testDirection]`.
 *
 * @throws {Error} Si `key` ne correspond pas au format attendu.
 *
 * @example
 * parseMaterialAnalysisKey("ss_avg");  // → ["ss", "avg"]
 * parseMaterialAnalysisKey("fd_long"); // → ["fd", "long"]
 */
function parseMaterialAnalysisKey(key) {
	for (const direction of MATERIAL_ANALYSIS_TEST_DIRECTION)
		if (key.endsWith(`_${direction}`)) return [key.slice(0, -(direction.length + 1)), direction];
	throw new Error(`Invalid material analysis key: ${key}`);
}
//#endregion
//#region electron/ipc/queries/bottles.ts
function computeMassLossNum(constant, surface, thickness) {
	if (!surface || !thickness) return null;
	return constant * (1 / 1e4) * (surface / thickness) * 60;
}
function getByIdWithJoins$1(id) {
	const row = getDb()
		.select({
			bottle,
			bottleTypeName: bottleType.bottleTypeName,
			bottleTypeConstant: bottleType.bottleTypeConstant,
			brandName: brand.brandName,
			overbrandName: overbrand.overbrandName,
			zoneName: zone.zoneName,
			materialFolderName: material.folderName,
			materialFamilyName: materialFamily.materialFamilyName
		})
		.from(bottle)
		.innerJoin(bottleType, (0, drizzle_orm.eq)(bottle.bottleTypeId, bottleType.bottleTypeId))
		.innerJoin(brand, (0, drizzle_orm.eq)(bottle.brandId, brand.brandId))
		.innerJoin(material, (0, drizzle_orm.eq)(bottle.materialId, material.materialId))
		.innerJoin(
			materialFamily,
			(0, drizzle_orm.eq)(material.materialFamilyId, materialFamily.materialFamilyId)
		)
		.innerJoin(overbrand, (0, drizzle_orm.eq)(bottle.overbrandId, overbrand.overBrandId))
		.innerJoin(zone, (0, drizzle_orm.eq)(bottle.zoneId, zone.zoneId))
		.where((0, drizzle_orm.eq)(bottle.bottleId, id))
		.get();
	if (!row) return void 0;
	const analyses = getDb()
		.select()
		.from(bottleAnalysis)
		.where((0, drizzle_orm.eq)(bottleAnalysis.bottleId, id))
		.all();
	const massLossNum = computeMassLossNum(
		row.bottleTypeConstant,
		row.bottle.surfaceCm2,
		row.bottle.thicknessMm
	);
	return {
		...row.bottle,
		bottleTypeName: row.bottleTypeName,
		brandName: row.brandName,
		overbrandName: row.overbrandName,
		zoneName: row.zoneName,
		materialFolderName: row.materialFolderName,
		materialFamilyName: row.materialFamilyName,
		massLossNum,
		analyses
	};
}
function updateFolderName$1(id) {
	const summary = getByIdWithJoins$1(id);
	if (!summary) return summary;
	const folderName = createBottleFileName(summary);
	getDb()
		.update(bottle)
		.set({ folderName })
		.where((0, drizzle_orm.eq)(bottle.bottleId, id))
		.run();
	return folderName;
}
var bottleQueries = {
	getAll() {
		try {
			const availableDataColumns = BOTTLE_ANALYSIS_KEYS.reduce((acc, key) => {
				const [testType, thicknessType] = parseBottleAnalysisKey(key);
				acc[key] = drizzle_orm.sql`(
						SELECT COUNT(*) > 0 FROM bottle_analysis
						WHERE bottle_analysis.bottle_id = ${bottle.bottleId}
						AND bottle_analysis.test_type = ${testType}
						AND bottle_analysis.thickness_type = ${thicknessType}
					)`;
				return acc;
			}, {});
			return getDb()
				.select({
					bottle,
					bottleTypeName: bottleType.bottleTypeName,
					bottleTypeConstant: bottleType.bottleTypeConstant,
					brandName: brand.brandName,
					overbrandName: overbrand.overbrandName,
					zoneName: zone.zoneName,
					materialFolderName: material.folderName,
					materialFamilyName: materialFamily.materialFamilyName,
					...availableDataColumns
				})
				.from(bottle)
				.innerJoin(bottleType, (0, drizzle_orm.eq)(bottle.bottleTypeId, bottleType.bottleTypeId))
				.innerJoin(brand, (0, drizzle_orm.eq)(bottle.brandId, brand.brandId))
				.innerJoin(material, (0, drizzle_orm.eq)(bottle.materialId, material.materialId))
				.innerJoin(
					materialFamily,
					(0, drizzle_orm.eq)(material.materialFamilyId, materialFamily.materialFamilyId)
				)
				.innerJoin(overbrand, (0, drizzle_orm.eq)(bottle.overbrandId, overbrand.overBrandId))
				.innerJoin(zone, (0, drizzle_orm.eq)(bottle.zoneId, zone.zoneId))
				.all()
				.map((row) => {
					const {
						bottle: b,
						bottleTypeName,
						bottleTypeConstant,
						brandName,
						overbrandName,
						zoneName,
						materialFolderName,
						materialFamilyName,
						...dataFlags
					} = row;
					const availableData = {};
					for (const key of BOTTLE_ANALYSIS_KEYS) availableData[key] = !!dataFlags[key];
					const massLossNum = computeMassLossNum(bottleTypeConstant, b.surfaceCm2, b.thicknessMm);
					return {
						...b,
						bottleTypeName,
						brandName,
						overbrandName,
						zoneName,
						materialFolderName,
						materialFamilyName,
						massLossNum,
						availableData
					};
				});
		} catch (err) {
			handleDbError(err, 'bottle.getAll');
		}
	},
	getById(id) {
		try {
			return getByIdWithJoins$1(id);
		} catch (err) {
			handleDbError(err, 'bottle.getById');
		}
	},
	create(data) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data;
			const now = /* @__PURE__ */ new Date().toISOString();
			const row = getDb().transaction((tx) => {
				const inserted = tx
					.insert(bottle)
					.values({
						...dbData,
						createdAt: now,
						lastModified: now
					})
					.returning()
					.get();
				if (analysisFiles?.length)
					for (const af of analysisFiles) {
						const [testType, thicknessType] = parseBottleAnalysisKey(af.analysisKey);
						tx.insert(bottleAnalysis)
							.values({
								bottleId: inserted.bottleId,
								testType,
								thicknessType,
								bottleAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
				return inserted;
			});
			const folderName = updateFolderName$1(row.bottleId);
			if (folderName) {
				ensureEntityDir('bottles', folderName);
				if (rawImageContent && row.imageExtension)
					saveImage('bottles', folderName, row.imageExtension, rawImageContent);
				if (analysisFiles?.length)
					for (const af of analysisFiles)
						saveAnalysisFile('bottles', folderName, af.fileName, af.fileContentText);
			}
			return getByIdWithJoins$1(row.bottleId);
		} catch (err) {
			handleDbError(err, 'bottle.create');
		}
	},
	update(id, data) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data;
			const oldImageExtension = rawImageContent
				? (getDb()
						.select({ imageExtension: bottle.imageExtension })
						.from(bottle)
						.where((0, drizzle_orm.eq)(bottle.bottleId, id))
						.get()?.imageExtension ?? void 0)
				: void 0;
			getDb().transaction((tx) => {
				tx.update(bottle)
					.set({
						...dbData,
						lastModified: /* @__PURE__ */ new Date().toISOString()
					})
					.where((0, drizzle_orm.eq)(bottle.bottleId, id))
					.run();
				if (analysisFiles?.length)
					for (const af of analysisFiles) {
						const [testType, thicknessType] = parseBottleAnalysisKey(af.analysisKey);
						tx.delete(bottleAnalysis)
							.where(
								(0, drizzle_orm.and)(
									(0, drizzle_orm.eq)(bottleAnalysis.bottleId, id),
									(0, drizzle_orm.eq)(bottleAnalysis.testType, testType),
									(0, drizzle_orm.eq)(bottleAnalysis.thicknessType, thicknessType)
								)
							)
							.run();
						tx.insert(bottleAnalysis)
							.values({
								bottleId: id,
								testType,
								thicknessType,
								bottleAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
			});
			const folderName = updateFolderName$1(id);
			if (folderName) {
				if (rawImageContent) {
					const row = getDb()
						.select({ imageExtension: bottle.imageExtension })
						.from(bottle)
						.where((0, drizzle_orm.eq)(bottle.bottleId, id))
						.get();
					if (row?.imageExtension) {
						if (oldImageExtension && oldImageExtension !== row.imageExtension)
							deleteImage('bottles', folderName, oldImageExtension);
						saveImage('bottles', folderName, row.imageExtension, rawImageContent);
					}
				}
				if (analysisFiles?.length)
					for (const af of analysisFiles)
						saveAnalysisFile('bottles', folderName, af.fileName, af.fileContentText);
			}
			return getByIdWithJoins$1(id);
		} catch (err) {
			handleDbError(err, 'bottle.update');
		}
	},
	delete(id) {
		try {
			const row = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where((0, drizzle_orm.eq)(bottle.bottleId, id))
				.get();
			const result = getDb()
				.delete(bottle)
				.where((0, drizzle_orm.eq)(bottle.bottleId, id))
				.returning()
				.get();
			if (row?.folderName) deleteEntityDir('bottles', row.folderName);
			return result;
		} catch (err) {
			handleDbError(err, 'bottle.delete');
		}
	},
	deleteMany(ids) {
		try {
			const rows = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where((0, drizzle_orm.inArray)(bottle.bottleId, ids))
				.all();
			getDb()
				.delete(bottle)
				.where((0, drizzle_orm.inArray)(bottle.bottleId, ids))
				.run();
			for (const row of rows) if (row.folderName) deleteEntityDir('bottles', row.folderName);
		} catch (err) {
			handleDbError(err, 'bottle.deleteMany');
		}
	},
	async exportZip(ids) {
		try {
			return exportEntitiesZip(
				'bottles',
				getDb()
					.select({ folderName: bottle.folderName })
					.from(bottle)
					.where((0, drizzle_orm.inArray)(bottle.bottleId, ids))
					.all()
					.map((r) => r.folderName)
					.filter((f) => !!f)
			);
		} catch (err) {
			handleDbError(err, 'bottle.exportZip');
		}
	},
	uploadAnalysis(id, analysisFile) {
		try {
			const [testType, thicknessType] = parseBottleAnalysisKey(analysisFile.analysisKey);
			getDb().transaction((tx) => {
				tx.delete(bottleAnalysis)
					.where(
						(0, drizzle_orm.and)(
							(0, drizzle_orm.eq)(bottleAnalysis.bottleId, id),
							(0, drizzle_orm.eq)(bottleAnalysis.testType, testType),
							(0, drizzle_orm.eq)(bottleAnalysis.thicknessType, thicknessType)
						)
					)
					.run();
				tx.insert(bottleAnalysis)
					.values({
						bottleId: id,
						testType,
						thicknessType,
						bottleAnalysisKey: analysisFile.analysisKey,
						fileName: analysisFile.fileName,
						xCoordinates: analysisFile.xCoordinates,
						yCoordinates: analysisFile.yCoordinates,
						fileContentText: analysisFile.fileContentText
					})
					.run();
			});
			const row = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where((0, drizzle_orm.eq)(bottle.bottleId, id))
				.get();
			if (row?.folderName)
				saveAnalysisFile(
					'bottles',
					row.folderName,
					analysisFile.fileName,
					analysisFile.fileContentText
				);
		} catch (err) {
			handleDbError(err, 'bottle.uploadAnalysis');
		}
	},
	deleteAnalysis(id, analysisKey) {
		try {
			const [testType, thicknessType] = parseBottleAnalysisKey(analysisKey);
			getDb()
				.delete(bottleAnalysis)
				.where(
					(0, drizzle_orm.and)(
						(0, drizzle_orm.eq)(bottleAnalysis.bottleId, id),
						(0, drizzle_orm.eq)(bottleAnalysis.testType, testType),
						(0, drizzle_orm.eq)(bottleAnalysis.thicknessType, thicknessType)
					)
				)
				.run();
		} catch (err) {
			handleDbError(err, 'bottle.deleteAnalysis');
		}
	}
};
function registerBottleHandlers() {
	electron.ipcMain.handle('db:bottle:getAll', () => bottleQueries.getAll());
	electron.ipcMain.handle('db:bottle:getById', (_e, id) => bottleQueries.getById(id));
	electron.ipcMain.handle('db:bottle:create', (_e, data) => bottleQueries.create(data));
	electron.ipcMain.handle('db:bottle:update', (_e, id, data) => bottleQueries.update(id, data));
	electron.ipcMain.handle('db:bottle:delete', (_e, id) => bottleQueries.delete(id));
	electron.ipcMain.handle('db:bottle:deleteMany', (_e, ids) => bottleQueries.deleteMany(ids));
	electron.ipcMain.handle('db:bottle:exportZip', (_e, ids) => bottleQueries.exportZip(ids));
	electron.ipcMain.handle('db:bottle:uploadAnalysis', (_e, id, data) =>
		bottleQueries.uploadAnalysis(id, data)
	);
	electron.ipcMain.handle('db:bottle:deleteAnalysis', (_e, id, key) =>
		bottleQueries.deleteAnalysis(id, key)
	);
}
//#endregion
//#region electron/ipc/queries/materials.ts
var supplier2 = (0, drizzle_orm_sqlite_core.alias)(supplier, 'supplier2');
function getByIdWithJoins(id) {
	const row = getDb()
		.select({
			material,
			materialFamilyName: materialFamily.materialFamilyName,
			supplierName1: supplier.supplierName,
			supplierName2: supplier2.supplierName
		})
		.from(material)
		.innerJoin(
			materialFamily,
			(0, drizzle_orm.eq)(material.materialFamilyId, materialFamily.materialFamilyId)
		)
		.innerJoin(supplier, (0, drizzle_orm.eq)(material.supplierId1, supplier.supplierId))
		.leftJoin(supplier2, (0, drizzle_orm.eq)(material.supplierId2, supplier2.supplierId))
		.where((0, drizzle_orm.eq)(material.materialId, id))
		.get();
	if (!row) return void 0;
	const analyses = getDb()
		.select()
		.from(materialAnalysis)
		.where((0, drizzle_orm.eq)(materialAnalysis.materialId, id))
		.all();
	return {
		...row.material,
		materialFamilyName: row.materialFamilyName,
		supplierName1: row.supplierName1,
		supplierName2: row.supplierName2,
		analyses
	};
}
function updateFolderName(id) {
	const summary = getByIdWithJoins(id);
	if (!summary) return summary;
	const folderName = createMaterialFileName(summary);
	getDb()
		.update(material)
		.set({ folderName })
		.where((0, drizzle_orm.eq)(material.materialId, id))
		.run();
	return folderName;
}
var materialQueries = {
	getAll() {
		try {
			const availableDataColumns = MATERIAL_ANALYSIS_KEYS.reduce((acc, key) => {
				const [testType, testDirection] = parseMaterialAnalysisKey(key);
				acc[key] = drizzle_orm.sql`(
						SELECT COUNT(*) > 0 FROM material_analysis
						WHERE material_analysis.material_id = ${material.materialId}
						AND material_analysis.test_type = ${testType}
						AND material_analysis.test_direction = ${testDirection}
					)`;
				return acc;
			}, {});
			const isLinkedColumn = drizzle_orm.sql`(
						SELECT COUNT(*) > 0 FROM bottle
						WHERE bottle.material_id = ${material.materialId}
					)`;
			return getDb()
				.select({
					material,
					materialFamilyName: materialFamily.materialFamilyName,
					supplierName1: supplier.supplierName,
					supplierName2: supplier2.supplierName,
					isLinked: isLinkedColumn,
					...availableDataColumns
				})
				.from(material)
				.innerJoin(
					materialFamily,
					(0, drizzle_orm.eq)(material.materialFamilyId, materialFamily.materialFamilyId)
				)
				.innerJoin(supplier, (0, drizzle_orm.eq)(material.supplierId1, supplier.supplierId))
				.leftJoin(supplier2, (0, drizzle_orm.eq)(material.supplierId2, supplier2.supplierId))
				.all()
				.map((row) => {
					const {
						material: m,
						materialFamilyName,
						supplierName1,
						supplierName2,
						isLinked,
						...dataFlags
					} = row;
					const availableData = {};
					for (const key of MATERIAL_ANALYSIS_KEYS) availableData[key] = !!dataFlags[key];
					return {
						...m,
						materialFamilyName,
						supplierName1,
						supplierName2,
						availableData,
						isLinked: !!isLinked
					};
				});
		} catch (err) {
			handleDbError(err, 'material.getAll');
		}
	},
	getById(id) {
		try {
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'material.getById');
		}
	},
	create(data) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data;
			const now = /* @__PURE__ */ new Date().toISOString();
			const row = getDb().transaction((tx) => {
				const inserted = tx
					.insert(material)
					.values({
						...dbData,
						createdAt: now,
						lastModified: now
					})
					.returning()
					.get();
				if (analysisFiles?.length)
					for (const af of analysisFiles) {
						const [testType, testDirection] = parseMaterialAnalysisKey(af.analysisKey);
						tx.insert(materialAnalysis)
							.values({
								materialId: inserted.materialId,
								testType,
								testDirection,
								materialAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
				return inserted;
			});
			const folderName = updateFolderName(row.materialId);
			if (folderName) {
				ensureEntityDir('materials', folderName);
				if (rawImageContent && row.imageExtension)
					saveImage('materials', folderName, row.imageExtension, rawImageContent);
				if (analysisFiles?.length)
					for (const af of analysisFiles)
						saveAnalysisFile('materials', folderName, af.fileName, af.fileContentText);
			}
			return getByIdWithJoins(row.materialId);
		} catch (err) {
			handleDbError(err, 'material.create');
		}
	},
	update(id, data) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data;
			const oldImageExtension = rawImageContent
				? (getDb()
						.select({ imageExtension: material.imageExtension })
						.from(material)
						.where((0, drizzle_orm.eq)(material.materialId, id))
						.get()?.imageExtension ?? void 0)
				: void 0;
			getDb().transaction((tx) => {
				tx.update(material)
					.set({
						...dbData,
						lastModified: /* @__PURE__ */ new Date().toISOString()
					})
					.where((0, drizzle_orm.eq)(material.materialId, id))
					.run();
				if (analysisFiles?.length)
					for (const af of analysisFiles) {
						const [testType, testDirection] = parseMaterialAnalysisKey(af.analysisKey);
						tx.delete(materialAnalysis)
							.where(
								(0, drizzle_orm.and)(
									(0, drizzle_orm.eq)(materialAnalysis.materialId, id),
									(0, drizzle_orm.eq)(materialAnalysis.testType, testType),
									(0, drizzle_orm.eq)(materialAnalysis.testDirection, testDirection)
								)
							)
							.run();
						tx.insert(materialAnalysis)
							.values({
								materialId: id,
								testType,
								testDirection,
								materialAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
			});
			const folderName = updateFolderName(id);
			if (folderName) {
				if (rawImageContent) {
					const row = getDb()
						.select({ imageExtension: material.imageExtension })
						.from(material)
						.where((0, drizzle_orm.eq)(material.materialId, id))
						.get();
					if (row?.imageExtension) {
						if (oldImageExtension && oldImageExtension !== row.imageExtension)
							deleteImage('materials', folderName, oldImageExtension);
						saveImage('materials', folderName, row.imageExtension, rawImageContent);
					}
				}
				if (analysisFiles?.length)
					for (const af of analysisFiles)
						saveAnalysisFile('materials', folderName, af.fileName, af.fileContentText);
			}
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'material.update');
		}
	},
	delete(id) {
		try {
			const row = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where((0, drizzle_orm.eq)(material.materialId, id))
				.get();
			const result = getDb()
				.delete(material)
				.where((0, drizzle_orm.eq)(material.materialId, id))
				.returning()
				.get();
			if (row?.folderName) deleteEntityDir('materials', row.folderName);
			return result;
		} catch (err) {
			handleDbError(err, 'material.delete');
		}
	},
	deleteMany(ids) {
		try {
			const rows = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where((0, drizzle_orm.inArray)(material.materialId, ids))
				.all();
			getDb()
				.delete(material)
				.where((0, drizzle_orm.inArray)(material.materialId, ids))
				.run();
			for (const row of rows) if (row.folderName) deleteEntityDir('materials', row.folderName);
		} catch (err) {
			handleDbError(err, 'material.deleteMany');
		}
	},
	async exportZip(ids) {
		try {
			return exportEntitiesZip(
				'materials',
				getDb()
					.select({ folderName: material.folderName })
					.from(material)
					.where((0, drizzle_orm.inArray)(material.materialId, ids))
					.all()
					.map((r) => r.folderName)
					.filter((f) => !!f)
			);
		} catch (err) {
			handleDbError(err, 'material.exportZip');
		}
	},
	uploadAnalysis(id, analysisFile) {
		try {
			const [testType, testDirection] = parseMaterialAnalysisKey(analysisFile.analysisKey);
			getDb().transaction((tx) => {
				tx.delete(materialAnalysis)
					.where(
						(0, drizzle_orm.and)(
							(0, drizzle_orm.eq)(materialAnalysis.materialId, id),
							(0, drizzle_orm.eq)(materialAnalysis.testType, testType),
							(0, drizzle_orm.eq)(materialAnalysis.testDirection, testDirection)
						)
					)
					.run();
				tx.insert(materialAnalysis)
					.values({
						materialId: id,
						testType,
						testDirection,
						materialAnalysisKey: analysisFile.analysisKey,
						fileName: analysisFile.fileName,
						xCoordinates: analysisFile.xCoordinates,
						yCoordinates: analysisFile.yCoordinates,
						fileContentText: analysisFile.fileContentText
					})
					.run();
			});
			const row = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where((0, drizzle_orm.eq)(material.materialId, id))
				.get();
			if (row?.folderName)
				saveAnalysisFile(
					'materials',
					row.folderName,
					analysisFile.fileName,
					analysisFile.fileContentText
				);
		} catch (err) {
			handleDbError(err, 'material.uploadAnalysis');
		}
	},
	deleteAnalysis(id, analysisKey) {
		try {
			const [testType, testDirection] = parseMaterialAnalysisKey(analysisKey);
			getDb()
				.delete(materialAnalysis)
				.where(
					(0, drizzle_orm.and)(
						(0, drizzle_orm.eq)(materialAnalysis.materialId, id),
						(0, drizzle_orm.eq)(materialAnalysis.testType, testType),
						(0, drizzle_orm.eq)(materialAnalysis.testDirection, testDirection)
					)
				)
				.run();
		} catch (err) {
			handleDbError(err, 'material.deleteAnalysis');
		}
	}
};
function registerMaterialHandlers() {
	electron.ipcMain.handle('db:material:getAll', () => materialQueries.getAll());
	electron.ipcMain.handle('db:material:getById', (_e, id) => materialQueries.getById(id));
	electron.ipcMain.handle('db:material:create', (_e, data) => materialQueries.create(data));
	electron.ipcMain.handle('db:material:update', (_e, id, data) => materialQueries.update(id, data));
	electron.ipcMain.handle('db:material:delete', (_e, id) => materialQueries.delete(id));
	electron.ipcMain.handle('db:material:deleteMany', (_e, ids) => materialQueries.deleteMany(ids));
	electron.ipcMain.handle('db:material:exportZip', (_e, ids) => materialQueries.exportZip(ids));
	electron.ipcMain.handle('db:material:uploadAnalysis', (_e, id, data) =>
		materialQueries.uploadAnalysis(id, data)
	);
	electron.ipcMain.handle('db:material:deleteAnalysis', (_e, id, key) =>
		materialQueries.deleteAnalysis(id, key)
	);
}
//#endregion
//#region electron/ipc/index.ts
function registerIpcHandlers() {
	registerAppHandlers();
	registerConfigHandlers();
	registerSimpleHandlers();
	registerBottleHandlers();
	registerMaterialHandlers();
}
//#endregion
//#region electron/main.ts
var { autoUpdater } = electron_updater.default;
var mainWindow = null;
var tray = null;
var isDev = process.env.NODE_ENV === 'development';
electron.protocol.registerSchemesAsPrivileged([
	{
		scheme: 'app',
		privileges: {
			standard: true,
			secure: true,
			supportFetchAPI: true
		}
	}
]);
var mimeTypes = {
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
var iconPath = isDev
	? path.default.join(__dirname, '.', 'appicon.png')
	: path.default.join(process.resourcesPath, 'appicon.png');
function createWindow() {
	mainWindow = new electron.BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		icon: iconPath,
		webPreferences: {
			preload: path.default.join(__dirname, 'preload.cjs'),
			nodeIntegration: false,
			contextIsolation: true
		}
	});
	if (isDev) {
		mainWindow.loadURL('http://localhost:5173');
		mainWindow.webContents.openDevTools();
	} else mainWindow.loadURL('app://./');
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}
function createTray() {
	try {
		const icon = electron.nativeImage.createFromPath(iconPath);
		if (icon.isEmpty()) return;
		tray = new electron.Tray(icon);
		tray.setToolTip('Datavic');
		const contextMenu = electron.Menu.buildFromTemplate([
			{
				label: 'Ouvrir Datavic',
				click: () => {
					if (mainWindow) {
						mainWindow.show();
						mainWindow.focus();
					} else createWindow();
				}
			},
			{ type: 'separator' },
			{
				label: 'Quitter',
				click: () => {
					electron.app.quit();
				}
			}
		]);
		tray.setContextMenu(contextMenu);
		tray.on('click', () => {
			if (mainWindow) {
				mainWindow.show();
				mainWindow.focus();
			} else createWindow();
		});
	} catch {
		console.warn('System tray not available');
	}
}
function setupAutoUpdater() {
	if (isDev) return;
	autoUpdater.checkForUpdatesAndNotify().catch((err) => {
		console.warn('Auto-update check failed:', err.message);
	});
	autoUpdater.on('update-available', () => {
		mainWindow?.webContents.send('update-available');
	});
	autoUpdater.on('update-downloaded', () => {
		mainWindow?.webContents.send('update-downloaded');
	});
}
electron.app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') electron.app.quit();
});
electron.app.on('activate', () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
electron.app.whenReady().then(() => {
	const buildDir = path.default.join(__dirname, '../../build');
	electron.protocol.handle('app', (request) => {
		let filePath = new URL(request.url).pathname;
		if (filePath === '/') filePath = '/index.html';
		const fullPath = path.default.join(buildDir, decodeURIComponent(filePath));
		const ext = path.default.extname(fullPath);
		const data = fs.default.readFileSync(fullPath);
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
//#endregion

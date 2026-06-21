let electron = require("electron");
//#region electron/preload.ts
electron.contextBridge.exposeInMainWorld("electronAPI", {
	getVersion: () => electron.ipcRenderer.invoke("get-version"),
	getPlatform: () => electron.ipcRenderer.invoke("get-platform"),
	installUpdate: () => electron.ipcRenderer.invoke("install-update"),
	openPath: (path) => electron.ipcRenderer.invoke("open-path", path),
	onUpdateAvailable: (callback) => {
		electron.ipcRenderer.on("update-available", callback);
	},
	onUpdateDownloaded: (callback) => {
		electron.ipcRenderer.on("update-downloaded", callback);
	},
	config: {
		getDbFolder: () => electron.ipcRenderer.invoke("config:get-db-folder"),
		getDbPath: () => electron.ipcRenderer.invoke("config:get-db-path"),
		selectDbFolder: () => electron.ipcRenderer.invoke("config:select-db-folder"),
		resetDbFolder: () => electron.ipcRenderer.invoke("config:reset-db-folder"),
		backupDb: () => electron.ipcRenderer.invoke("config:backup-db"),
		restoreDb: () => electron.ipcRenderer.invoke("config:restore-db")
	},
	db: {
		bottleType: {
			getAll: () => electron.ipcRenderer.invoke("db:bottleType:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:bottleType:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:bottleType:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:bottleType:delete", id)
		},
		brand: {
			getAll: () => electron.ipcRenderer.invoke("db:brand:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:brand:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:brand:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:brand:delete", id)
		},
		overbrand: {
			getAll: () => electron.ipcRenderer.invoke("db:overbrand:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:overbrand:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:overbrand:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:overbrand:delete", id)
		},
		zone: {
			getAll: () => electron.ipcRenderer.invoke("db:zone:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:zone:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:zone:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:zone:delete", id)
		},
		materialFamily: {
			getAll: () => electron.ipcRenderer.invoke("db:materialFamily:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:materialFamily:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:materialFamily:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:materialFamily:delete", id)
		},
		supplier: {
			getAll: () => electron.ipcRenderer.invoke("db:supplier:getAll"),
			create: (data) => electron.ipcRenderer.invoke("db:supplier:create", data),
			update: (id, data) => electron.ipcRenderer.invoke("db:supplier:update", id, data),
			delete: (id) => electron.ipcRenderer.invoke("db:supplier:delete", id)
		}
	}
});
//#endregion

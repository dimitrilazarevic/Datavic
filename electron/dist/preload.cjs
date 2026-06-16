let electron = require("electron");
//#region electron/preload.ts
electron.contextBridge.exposeInMainWorld("electronAPI", {
	getVersion: () => electron.ipcRenderer.invoke("get-version"),
	getPlatform: () => electron.ipcRenderer.invoke("get-platform"),
	installUpdate: () => electron.ipcRenderer.invoke("install-update"),
	onUpdateAvailable: (callback) => {
		electron.ipcRenderer.on("update-available", callback);
	},
	onUpdateDownloaded: (callback) => {
		electron.ipcRenderer.on("update-downloaded", callback);
	}
});
//#endregion

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	getVersion: () => ipcRenderer.invoke('get-version'),
	getPlatform: () => ipcRenderer.invoke('get-platform'),
	installUpdate: () => ipcRenderer.invoke('install-update'),

	onUpdateAvailable: (callback: () => void) => {
		ipcRenderer.on('update-available', callback);
	},
	onUpdateDownloaded: (callback: () => void) => {
		ipcRenderer.on('update-downloaded', callback);
	}
});

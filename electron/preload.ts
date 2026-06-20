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
	},

	db: {
		getTasks: () => ipcRenderer.invoke('db:get-tasks'),
		addTask: (data: { title: string; priority?: number }) => ipcRenderer.invoke('db:add-task', data),
		updateTask: (data: { id: string; title?: string; priority?: number }) => ipcRenderer.invoke('db:update-task', data),
		deleteTask: (id: string) => ipcRenderer.invoke('db:delete-task', id)
	}
});

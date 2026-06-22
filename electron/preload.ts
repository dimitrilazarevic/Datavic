import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
	getVersion: () => ipcRenderer.invoke('get-version'),
	getPlatform: () => ipcRenderer.invoke('get-platform'),
	installUpdate: () => ipcRenderer.invoke('install-update'),
	openPath: (path: string) => ipcRenderer.invoke('open-path', path),
	getEntityImage: (entity: 'bottles' | 'materials', folderName: string, ext: string) =>
		ipcRenderer.invoke('get-entity-image', entity, folderName, ext) as Promise<string | null>,

	onUpdateAvailable: (callback: () => void) => {
		ipcRenderer.on('update-available', callback);
	},
	onUpdateDownloaded: (callback: () => void) => {
		ipcRenderer.on('update-downloaded', callback);
	},

	config: {
		getDbFolder: () => ipcRenderer.invoke('config:get-db-folder') as Promise<string | null>,
		getDbPath: () => ipcRenderer.invoke('config:get-db-path') as Promise<string>,
		selectDbFolder: () => ipcRenderer.invoke('config:select-db-folder') as Promise<string | null>,
		resetDbFolder: () => ipcRenderer.invoke('config:reset-db-folder') as Promise<void>,
		backupDb: () => ipcRenderer.invoke('config:backup-db') as Promise<string | null>,
		restoreDb: () => ipcRenderer.invoke('config:restore-db') as Promise<boolean>
	},

	db: {
		bottleType: {
			getAll: () => ipcRenderer.invoke('db:bottleType:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:bottleType:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:bottleType:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:bottleType:delete', id)
		},
		brand: {
			getAll: () => ipcRenderer.invoke('db:brand:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:brand:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:brand:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:brand:delete', id)
		},
		overbrand: {
			getAll: () => ipcRenderer.invoke('db:overbrand:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:overbrand:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:overbrand:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:overbrand:delete', id)
		},
		zone: {
			getAll: () => ipcRenderer.invoke('db:zone:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:zone:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:zone:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:zone:delete', id)
		},
		materialFamily: {
			getAll: () => ipcRenderer.invoke('db:materialFamily:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:materialFamily:create', data),
			update: (id: number, data: object) =>
				ipcRenderer.invoke('db:materialFamily:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:materialFamily:delete', id)
		},
		supplier: {
			getAll: () => ipcRenderer.invoke('db:supplier:getAll'),
			create: (data: object) => ipcRenderer.invoke('db:supplier:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:supplier:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:supplier:delete', id)
		},
		bottle: {
			getAll: () => ipcRenderer.invoke('db:bottle:getAll'),
			getById: (id: number) => ipcRenderer.invoke('db:bottle:getById', id),
			create: (data: object) => ipcRenderer.invoke('db:bottle:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:bottle:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:bottle:delete', id),
			deleteMany: (ids: number[]) => ipcRenderer.invoke('db:bottle:deleteMany', ids),
			exportZip: (ids: number[]) => ipcRenderer.invoke('db:bottle:exportZip', ids),
			uploadAnalysis: (id: number, data: object) =>
				ipcRenderer.invoke('db:bottle:uploadAnalysis', id, data),
			deleteAnalysis: (id: number, key: string) =>
				ipcRenderer.invoke('db:bottle:deleteAnalysis', id, key)
		},
		material: {
			getAll: () => ipcRenderer.invoke('db:material:getAll'),
			getById: (id: number) => ipcRenderer.invoke('db:material:getById', id),
			create: (data: object) => ipcRenderer.invoke('db:material:create', data),
			update: (id: number, data: object) => ipcRenderer.invoke('db:material:update', id, data),
			delete: (id: number) => ipcRenderer.invoke('db:material:delete', id),
			deleteMany: (ids: number[]) => ipcRenderer.invoke('db:material:deleteMany', ids),
			exportZip: (ids: number[]) => ipcRenderer.invoke('db:material:exportZip', ids),
			uploadAnalysis: (id: number, data: object) =>
				ipcRenderer.invoke('db:material:uploadAnalysis', id, data),
			deleteAnalysis: (id: number, key: string) =>
				ipcRenderer.invoke('db:material:deleteAnalysis', id, key)
		}
	}
});

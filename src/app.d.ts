// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Task, TaskInsert } from '../electron/lib/types';

declare global {
	interface ElectronAPI {
		getVersion: () => Promise<string>;
		getPlatform: () => Promise<string>;
		installUpdate: () => Promise<void>;
		onUpdateAvailable: (callback: () => void) => void;
		onUpdateDownloaded: (callback: () => void) => void;
		db: {
			getTasks: () => Promise<Task[]>;
			addTask: (data: TaskInsert) => Promise<Task>;
			updateTask: (data: { id: string } & Partial<TaskInsert>) => Promise<Task>;
			deleteTask: (id: string) => Promise<Task>;
		};
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		electronAPI?: ElectronAPI;
	}
}

export {};

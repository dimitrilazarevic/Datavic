// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	interface Task {
		id: string;
		title: string;
		priority: number;
	}

	interface ElectronAPI {
		getVersion: () => Promise<string>;
		getPlatform: () => Promise<string>;
		installUpdate: () => Promise<void>;
		onUpdateAvailable: (callback: () => void) => void;
		onUpdateDownloaded: (callback: () => void) => void;
		db: {
			getTasks: () => Promise<Task[]>;
			addTask: (data: { title: string; priority?: number }) => Promise<Task>;
			updateTask: (data: { id: string; title?: string; priority?: number }) => Promise<Task>;
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

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {
	BottleType,
	BottleTypeInsert,
	Brand,
	BrandInsert,
	Overbrand,
	OverbrandInsert,
	Zone,
	ZoneInsert,
	MaterialFamily,
	MaterialFamilyInsert,
	Supplier,
	SupplierInsert,
	BottleInsert,
	BottleSummary,
	BottleWithAnalysis,
	MaterialInsert,
	MaterialSummary,
	MaterialWithAnalysis
} from '../electron/lib/types';

interface SimpleCrud<T, TInsert> {
	getAll: () => Promise<(T & { isLinked: boolean })[]>;
	create: (data: TInsert) => Promise<T>;
	update: (id: number, data: Partial<TInsert>) => Promise<T>;
	delete: (id: number) => Promise<T>;
}

interface AnalysisFileData {
	analysisKey: string;
	fileName: string;
	xCoordinates: number[];
	yCoordinates: number[];
	fileContentText: string;
}

interface EntityCrud<TSummary, T, TInsert> {
	getAll: () => Promise<TSummary[]>;
	getById: (id: number) => Promise<T | undefined>;
	create: (data: TInsert) => Promise<T>;
	update: (id: number, data: Partial<TInsert>) => Promise<T>;
	delete: (id: number) => Promise<T>;
	deleteMany: (ids: number[]) => Promise<void>;
	exportZip: (ids: number[]) => Promise<string | null>;
	uploadAnalysis: (id: number, data: AnalysisFileData) => Promise<void>;
	deleteAnalysis: (id: number, analysisKey: string) => Promise<void>;
}

declare global {
	interface ElectronAPI {
		getVersion: () => Promise<string>;
		getPlatform: () => Promise<string>;
		installUpdate: () => Promise<void>;
		openPath: (path: string) => Promise<string>;
		getEntityImage: (
			entity: 'bottles' | 'materials',
			folderName: string,
			ext: string
		) => Promise<string | null>;
		onUpdateAvailable: (callback: () => void) => void;
		onUpdateDownloaded: (callback: () => void) => void;
		config: {
			getDbFolder: () => Promise<string | null>;
			getDbPath: () => Promise<string>;
			selectDbFolder: () => Promise<string | null>;
			resetDbFolder: () => Promise<void>;
			backupDb: () => Promise<string | null>;
			restoreDb: () => Promise<boolean>;
		};
		db: {
			bottleType: SimpleCrud<BottleType, BottleTypeInsert>;
			brand: SimpleCrud<Brand, BrandInsert>;
			overbrand: SimpleCrud<Overbrand, OverbrandInsert>;
			zone: SimpleCrud<Zone, ZoneInsert>;
			materialFamily: SimpleCrud<MaterialFamily, MaterialFamilyInsert>;
			supplier: SimpleCrud<Supplier, SupplierInsert>;
			bottle: EntityCrud<BottleSummary, BottleWithAnalysis, BottleInsert>;
			material: EntityCrud<MaterialSummary, MaterialWithAnalysis, MaterialInsert>;
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

export type ToggleResult =
	| { success: true; selectedIds: Set<string>; action: 'added' | 'removed' }
	| { success: false; selectedIds: Set<string>; action: 'max_reached'; message: string };

export type AddResult =
	| { success: true; action: 'added' }
	| { success: false; action: 'max_reached'; message: string };

function loadIds(storageKey: string): Set<string> {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return new Set();
		return new Set(raw.split(',').filter(Boolean));
	} catch {
		return new Set();
	}
}

function saveIds(storageKey: string, ids: Set<string>): void {
	try {
		localStorage.setItem(storageKey, Array.from(ids).join(','));
	} catch {
		// storage full or unavailable
	}
}

export interface SelectionStore {
	readonly ids: Set<string>;
	readonly size: number;
	readonly array: string[];
	readonly maxSelection: number | null;
	has: (id: string) => boolean;
	toggle: (id: string) => ToggleResult;
	add: (id: string) => AddResult;
	remove: (id: string) => void;
	clear: () => void;
}

export function createSelectionStore(
	storageKey: string,
	maxSelection: number | null = null
): SelectionStore {
	let selectedIds = $state(loadIds(storageKey));

	return {
		get ids() {
			return selectedIds;
		},
		get size() {
			return selectedIds.size;
		},
		get array() {
			return Array.from(selectedIds);
		},
		get maxSelection() {
			return maxSelection;
		},

		has(id: string): boolean {
			return selectedIds.has(id);
		},

		toggle(id: string): ToggleResult {
			const next = new Set(selectedIds);
			if (next.has(id)) {
				next.delete(id);
				selectedIds = next;
				saveIds(storageKey, selectedIds);
				return { success: true, selectedIds, action: 'removed' };
			}
			if (maxSelection !== null && next.size >= maxSelection) {
				return {
					success: false,
					selectedIds,
					action: 'max_reached',
					message: `Maximum de ${maxSelection} selections atteint`
				};
			}
			next.add(id);
			selectedIds = next;
			saveIds(storageKey, selectedIds);
			return { success: true, selectedIds, action: 'added' };
		},

		add(id: string): AddResult {
			if (maxSelection !== null && selectedIds.size >= maxSelection) {
				return {
					success: false,
					action: 'max_reached',
					message: `Maximum de ${maxSelection} selections atteint`
				};
			}
			const next = new Set(selectedIds);
			next.add(id);
			selectedIds = next;
			saveIds(storageKey, selectedIds);
			return { success: true, action: 'added' };
		},

		remove(id: string): void {
			const next = new Set(selectedIds);
			next.delete(id);
			selectedIds = next;
			saveIds(storageKey, selectedIds);
		},

		clear(): void {
			selectedIds = new Set();
			saveIds(storageKey, selectedIds);
		}
	};
}

export const bottleSelection = createSelectionStore('selectedBottles', 6);
export const materialSelection = createSelectionStore('selectedMaterials', 6);

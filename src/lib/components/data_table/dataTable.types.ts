import type { Snippet } from 'svelte';
import type { SelectionStore } from '$lib/stores/selectionStore.svelte';

export interface DataColumn<T> {
	kind: 'data';
	key: keyof T & string;
	label: string;
	sortable?: boolean;
	searchable?: boolean;
	render?: (value: unknown) => string;
}

export interface SelectColumn<T> {
	kind: 'select';
	label: string;
	snippet: Snippet<[T]>;
}

export interface AnalysisSubColumn<T> {
	key: string;
	label: string;
	snippet: Snippet<[T, string]>;
}

export interface AnalysisGroup<T> {
	kind: 'analysis';
	label: string;
	columns: AnalysisSubColumn<T>[];
}

export type Column<T> = DataColumn<T> | SelectColumn<T> | AnalysisGroup<T>;

export interface ColumnGroup<T> {
	columns: Column<T>[];
}

export type FlatColumn<T> =
	| DataColumn<T>
	| SelectColumn<T>
	| (AnalysisSubColumn<T> & { kind: 'analysis-sub' });

export function flattenColumns<T>(groups: ColumnGroup<T>[]): FlatColumn<T>[] {
	const result: FlatColumn<T>[] = [];
	for (const group of groups) {
		for (const col of group.columns) {
			if (col.kind === 'analysis') {
				for (const sub of col.columns) {
					result.push({ ...sub, kind: 'analysis-sub' as const });
				}
			} else {
				result.push(col);
			}
		}
	}
	return result;
}

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ColumnGroup } from './dataTable.types';
	import { flattenColumns } from './dataTable.types';
	import type { SelectionStore } from '$lib/stores/selectionStore.svelte';
	import TableHeader from './TableHeader.svelte';
	import TableRow from './TableRow.svelte';
	import Button from '$lib/components/Button.svelte';

	interface Props {
		items: T[] | undefined;
		groups: ColumnGroup<T>[];
		itemsPerPage?: number;
		selection: SelectionStore;
		search?: string;
		defaultSortKey?: keyof T | null;
		idField: string;
		rowClass?: (row: T) => string;
	}

	let {
		items,
		groups,
		itemsPerPage = 10,
		selection,
		search = '',
		defaultSortKey = null,
		idField,
		rowClass
	}: Props = $props();

	const allColumns = $derived(flattenColumns(groups));

	const searchFields = $derived(
		groups
			.flatMap((g) => g.columns)
			.filter(
				(col): col is Extract<typeof col, { kind: 'data' }> =>
					col.kind === 'data' && !!col.searchable
			)
			.map((col) => col.key)
	);

	function normalize(str: string): string {
		return str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').toLowerCase();
	}

	const filteredItems = $derived.by(() => {
		if (!items) return [];
		if (!search) return items;
		const tokens = normalize(search).split(/\s+/).filter(Boolean);
		return items.filter(
			(item) =>
				selection.has(String(item[idField])) ||
				tokens.every((token) =>
					searchFields.some((key) => {
						const val = item[key];
						return val != null && normalize(String(val)).includes(token);
					})
				)
		);
	});

	// eslint-disable-next-line svelte/valid-compile -- intentional: we only want the initial value
	let sortKey = $state<keyof T | null>(defaultSortKey);
	let sortDirection = $state<'asc' | 'desc'>('asc');

	function handleSort(key: keyof T) {
		if (sortKey === key) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortKey = key;
			sortDirection = 'asc';
		}
	}

	const sortedItems = $derived.by(() => {
		if (!sortKey) return filteredItems;
		return [...filteredItems].sort((a, b) => {
			const aVal = a[sortKey!];
			const bVal = b[sortKey!];
			if (aVal == null) return 1;
			if (bVal == null) return -1;
			const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
			return sortDirection === 'asc' ? result : -result;
		});
	});

	let currentPage = $state(1);
	let totalPages = $derived(Math.ceil((filteredItems ?? []).length / itemsPerPage));
	let paginatedItems = $derived(
		sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	$effect(() => {
		if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
	});
</script>

<div class="table-container">
	<table>
		<TableHeader {groups} {sortKey} {sortDirection} onSort={handleSort} />
		<tbody>
			{#each paginatedItems as row (row[idField])}
				<TableRow
					{row}
					columns={allColumns}
					selected={selection.has(String(row[idField]))}
					extraClass={rowClass?.(row)}
				/>
			{/each}
		</tbody>
	</table>

	<div class="pagination">
		<Button variant="secondary" onclick={() => currentPage--} disabled={currentPage === 1}>
			&larr; Precedent
		</Button>

		<span
			>{currentPage} / {totalPages} &mdash; {filteredItems.length} element{filteredItems.length > 1
				? 's'
				: ''}</span
		>

		<Button variant="secondary" onclick={() => currentPage++} disabled={currentPage === totalPages}>
			Suivant &rarr;
		</Button>
	</div>
</div>

<style>
	.table-container {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: auto;
		margin: auto;
		border-collapse: collapse;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-top: var(--space-md);
		padding: var(--space-md);
		font-size: var(--text-sm);
		color: var(--color-text);
	}
</style>

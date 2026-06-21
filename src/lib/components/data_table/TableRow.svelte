<script lang="ts" generics="T extends Record<string, unknown>">
	import type { FlatColumn } from './dataTable.types';

	interface Props {
		row: T;
		columns: FlatColumn<T>[];
		selected?: boolean;
	}

	let { row, columns, selected = false }: Props = $props();
</script>

<tr class:selected>
	{#each columns as col, i (i)}
		{#if col.kind === 'data'}
			<td>{col.render ? col.render(row[col.key]) : (row[col.key] ?? '—')}</td>
		{:else if col.kind === 'select'}
			<td class="center">{@render col.snippet(row)}</td>
		{:else if col.kind === 'analysis-sub'}
			<td class="center">{@render col.snippet(row, col.key)}</td>
		{/if}
	{/each}
</tr>

<style>
	tr.selected td {
		background: var(--color-primary-light);
	}

	tr:hover td {
		background: var(--color-bg);
	}

	tr.selected:hover td {
		background: var(--color-primary-light);
		opacity: 0.9;
	}

	td {
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--color-surface);
		font-size: var(--text-sm);
		white-space: nowrap;
	}

	.center {
		text-align: center;
	}
</style>

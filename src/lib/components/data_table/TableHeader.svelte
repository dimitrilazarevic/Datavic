<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ColumnGroup } from './dataTable.types';
	import { ChevronUp, ChevronDown } from '@lucide/svelte';

	interface Props {
		groups: ColumnGroup<T>[];
		sortKey: keyof T | null;
		sortDirection: 'asc' | 'desc';
		onSort: (key: keyof T) => void;
	}

	let { groups, sortKey, sortDirection, onSort }: Props = $props();

	let allColumns = $derived(groups.flatMap((g) => g.columns));

	let hasAnalysisGroups = $derived(allColumns.some((c) => c.kind === 'analysis'));
</script>

<thead>
	<tr>
		{#each allColumns as col (col.label)}
			{#if col.kind === 'analysis'}
				<th class="analysis-group" colspan={col.columns.length}>{col.label}</th>
			{:else if col.kind === 'data'}
				<th
					class:sortable={col.sortable}
					rowspan={hasAnalysisGroups ? 2 : 1}
					onclick={() => col.sortable && onSort(col.key)}
				>
					<span class="th-content">
						{col.label}
						{#if col.sortable && sortKey === col.key}
							{#if sortDirection === 'asc'}
								<ChevronUp size={14} />
							{:else}
								<ChevronDown size={14} />
							{/if}
						{/if}
					</span>
				</th>
			{:else}
				<th rowspan={hasAnalysisGroups ? 2 : 1}>{col.label}</th>
			{/if}
		{/each}
	</tr>
	{#if hasAnalysisGroups}
		<tr>
			{#each allColumns as col (col.label)}
				{#if col.kind === 'analysis'}
					{#each col.columns as sub (sub.label)}
						<th class="analysis-sub">{sub.label}</th>
					{/each}
				{/if}
			{/each}
		</tr>
	{/if}
</thead>

<style>
	thead th {
		background: var(--color-primary);
		color: #fff;
		font-weight: 600;
		padding: 0.5rem 0.75rem;
		border-bottom: 1px solid var(--color-primary);
		white-space: nowrap;
		font-size: var(--text-sm);
		text-align: left;
	}

	.analysis-group {
		text-align: center;
		border-left: 1px solid rgba(255, 255, 255, 0.3);
		border-right: 1px solid rgba(255, 255, 255, 0.3);
	}

	.analysis-sub {
		text-align: center;
		font-size: 0.75rem;
		padding: 0.3rem 0.5rem;
		border-left: 1px solid rgba(255, 255, 255, 0.15);
	}

	.sortable {
		cursor: pointer;
		user-select: none;
	}

	.sortable:hover {
		opacity: 0.9;
	}

	.th-content {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>

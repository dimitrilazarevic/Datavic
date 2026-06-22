<script lang="ts" generics="T">
	import type { TechnicalDetail } from './technicalDetails.types';

	let {
		item,
		detailsToDisplay
	}: {
		item: T | null | undefined;
		detailsToDisplay: TechnicalDetail<T>[];
	} = $props();

	function render(value: string | number | null | undefined): string {
		if (value == null || value === '') return '—';
		return String(value);
	}
</script>

{#if item}
	<dl>
		{#each detailsToDisplay as detail}
			<dt>{detail.label}</dt>
			<dd>{render(detail.accessor(item))}</dd>
		{/each}
	</dl>
{/if}

<style>
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem var(--space-sm);
		font-size: var(--text-sm);
	}

	dt {
		color: var(--color-text-light);
		white-space: nowrap;
	}

	dd {
		margin: 0;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>

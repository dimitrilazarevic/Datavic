<script lang="ts">
	import DataTable from '$lib/components/data_table/DataTable.svelte';
	import { bottleSelection } from '$lib/stores/selectionStore.svelte';
	import type { ColumnGroup } from '$lib/components/data_table/dataTable.types';
	import AnalysisPoint from '$lib/components/data_table/AnalysisPoint.svelte';
	import SelectRowButton from '$lib/components/data_table/SelectRowButton.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { Pencil } from '@lucide/svelte';
	import type { BottleSummary } from '../../../electron/lib/types';

	interface Props {
		bottles: BottleSummary[] | undefined;
		search?: string;
		onAnalysisClick?: (row: BottleSummary, key: string) => void;
		onEditClick?: (row: BottleSummary) => void;
	}

	let { bottles, search = '', onAnalysisClick, onEditClick }: Props = $props();

	$effect(() => {
		if (bottles) console.log('BottleDataTable items:', bottles);
	});

	function formatDate(value: unknown): string {
		if (!value) return '—';
		const d = new Date(String(value));
		return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}
</script>

{#snippet selectionSnippet(row: BottleSummary)}
	<SelectRowButton id={String(row.bottleId)} selection={bottleSelection} />
{/snippet}

{#snippet editSnippet(row: BottleSummary)}
	<IconButton onclick={() => onEditClick?.(row)} variant="secondary" label="Modifier">
		<Pencil size={15} />
	</IconButton>
{/snippet}

{#snippet analysisSnippet(row: BottleSummary, key: string)}
	<AnalysisPoint
		value={!!row.availableData?.[key as keyof typeof row.availableData]}
		onclick={() => onAnalysisClick?.(row, key)}
		label={key}
	/>
{/snippet}

{#if true}
	{@const groups = [
		{
			columns: [
				{ kind: 'data', key: 'zoneName', label: 'Zone', sortable: true, searchable: true },
				{ kind: 'data', key: 'brandName', label: 'Marque', sortable: true, searchable: true },
				{
					kind: 'data',
					key: 'bottleTypeName',
					label: 'Type',
					sortable: true,
					searchable: true
				},
				{ kind: 'data', key: 'claimMl', label: 'Volume (mL)', sortable: true, searchable: true },
				{ kind: 'data', key: 'massG', label: 'Masse', sortable: true, searchable: true },
				{
					kind: 'data',
					key: 'materialFamilyName',
					label: 'Mat',
					sortable: true,
					searchable: true
				},
				{ kind: 'data', key: 'version', label: 'Version', sortable: true, searchable: true },
				{
					kind: 'data',
					key: 'lastModified',
					label: 'Modifie le',
					sortable: true,
					render: formatDate
				},
				{ kind: 'select', snippet: selectionSnippet, label: 'Selection' },
				{ kind: 'select', snippet: editSnippet, label: 'Modifier' },
				{
					label: 'Squeeze',
					kind: 'analysis',
					columns: [
						{ key: 'squeeze_exp', label: 'EXP', snippet: analysisSnippet },
						{ key: 'squeeze_lin', label: 'LIN', snippet: analysisSnippet },
						{ key: 'squeeze_tom', label: 'TOM', snippet: analysisSnippet }
					]
				},
				{
					label: 'Sideload IO',
					kind: 'analysis',
					columns: [
						{ key: 'sideload_io_exp', label: 'EXP', snippet: analysisSnippet },
						{ key: 'sideload_io_lin', label: 'LIN', snippet: analysisSnippet },
						{ key: 'sideload_io_tom', label: 'TOM', snippet: analysisSnippet }
					]
				},
				{
					label: 'Sideload IOI',
					kind: 'analysis',
					columns: [
						{ key: 'sideload_ioi_exp', label: 'EXP', snippet: analysisSnippet },
						{ key: 'sideload_ioi_lin', label: 'LIN', snippet: analysisSnippet },
						{ key: 'sideload_ioi_tom', label: 'TOM', snippet: analysisSnippet }
					]
				},
				{
					label: 'Topload',
					kind: 'analysis',
					columns: [
						{ key: 'topload_exp', label: 'EXP', snippet: analysisSnippet },
						{ key: 'topload_lin', label: 'LIN', snippet: analysisSnippet },
						{ key: 'topload_tom', label: 'TOM', snippet: analysisSnippet }
					]
				}
			]
		}
	] satisfies ColumnGroup<BottleSummary>[]}
	<DataTable
		items={bottles}
		{groups}
		selection={bottleSelection}
		{search}
		idField="bottleId"
		defaultSortKey="brandName"
	/>
{/if}

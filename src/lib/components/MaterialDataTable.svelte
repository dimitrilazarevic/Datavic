<script lang="ts">
	import DataTable from '$lib/components/data_table/DataTable.svelte';
	import { materialSelection } from '$lib/stores/selectionStore.svelte';
	import type { ColumnGroup } from '$lib/components/data_table/dataTable.types';
	import AnalysisPoint from '$lib/components/data_table/AnalysisPoint.svelte';
	import SelectRowButton from '$lib/components/data_table/SelectRowButton.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { Pencil } from '@lucide/svelte';
	import type { MaterialSummary } from '../../../electron/lib/types';

	interface Props {
		materials: MaterialSummary[] | undefined;
		search?: string;
		onAnalysisClick?: (row: MaterialSummary, key: string) => void;
		onEditClick?: (row: MaterialSummary) => void;
	}

	let { materials, search = '', onAnalysisClick, onEditClick }: Props = $props();

	$effect(() => {
		if (materials) console.log('MaterialDataTable items:', materials);
	});

	function formatDate(value: unknown): string {
		if (!value) return '—';
		const d = new Date(String(value));
		return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
	}
</script>

{#snippet selectionSnippet(row: MaterialSummary)}
	<SelectRowButton id={String(row.materialId)} selection={materialSelection} />
{/snippet}

{#snippet editSnippet(row: MaterialSummary)}
	<IconButton onclick={() => onEditClick?.(row)} variant="secondary" label="Modifier">
		<Pencil size={15} />
	</IconButton>
{/snippet}

{#snippet analysisSnippet(row: MaterialSummary, key: string)}
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
				{
					kind: 'data',
					key: 'materialFamilyName',
					label: 'Famille',
					sortable: true,
					searchable: true
				},
				{
					kind: 'data',
					key: 'supplierName1',
					label: 'Fournisseur 1',
					sortable: true,
					searchable: true
				},
				{ kind: 'data', key: 'pct1', label: '%F1', sortable: true },
				{ kind: 'data', key: 'ref1', label: 'Ref 1', sortable: true, searchable: true },
				{
					kind: 'data',
					key: 'supplierName2',
					label: 'Fournisseur 2',
					sortable: true,
					searchable: true
				},
				{ kind: 'data', key: 'pct2', label: '%F2', sortable: true },
				{ kind: 'data', key: 'ref2', label: 'Ref 2', sortable: true, searchable: true },
				{
					kind: 'data',
					key: 'avgElasticModulus',
					label: 'E ref',
					sortable: true,
					render: (v) => String(Math.round((v as number) * 100) / 100)
				},
				{
					kind: 'data',
					key: 'avgElasticLimit',
					label: 'σe ref',
					sortable: true,
					render: (v) => String(Math.round((v as number) * 100) / 100)
				},
				{
					kind: 'data',
					key: 'syneAbaqusElasticModulus',
					label: 'E sim',
					sortable: true,
					render: (v) => String(Math.round((v as number) * 100) / 100)
				},
				{
					kind: 'data',
					key: 'syneAbaqusElasticLimit',
					label: 'σe sim',
					sortable: true,
					render: (v) => String(Math.round((v as number) * 100) / 100)
				},
				{ kind: 'data', key: 'temperatureC', label: 'T °C', sortable: true },
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
					label: 'Stress-Strain',
					kind: 'analysis',
					columns: [
						{ key: 'ss_avg', label: 'AVG', snippet: analysisSnippet },
						{ key: 'ss_long', label: 'LONG', snippet: analysisSnippet },
						{ key: 'ss_rad', label: 'RAD', snippet: analysisSnippet }
					]
				},
				{
					label: 'Force-Displacement',
					kind: 'analysis',
					columns: [
						{ key: 'fd_avg', label: 'AVG', snippet: analysisSnippet },
						{ key: 'fd_long', label: 'LONG', snippet: analysisSnippet },
						{ key: 'fd_rad', label: 'RAD', snippet: analysisSnippet }
					]
				}
			]
		}
	] satisfies ColumnGroup<MaterialSummary>[]}
	<DataTable
		items={materials}
		{groups}
		selection={materialSelection}
		{search}
		idField="materialId"
		defaultSortKey="materialFamilyName"
		rowClass={(row) => (row.isLinked ? 'linked' : '')}
	/>
{/if}

<script lang="ts">
	import BottleDataTable from '$lib/components/BottleDataTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AnalysisAction from '$lib/components/AnalysisAction.svelte';
	import BottleForm from '$lib/components/BottleForm.svelte';
	import { Trash2, Download } from '@lucide/svelte';
	import { bottleSelection } from '$lib/stores/selectionStore.svelte';
	import type { BottleSummary } from '../../../../../electron/lib/types';
	import { onMount } from 'svelte';

	let bottles = $state<BottleSummary[]>([]);
	let search = $state('');
	let modalData = $state<{ row: BottleSummary; key: string } | null>(null);
	let editRow = $state<BottleSummary | null>(null);

	async function loadBottles() {
		const api = window.electronAPI;
		if (!api) return;
		bottles = await api.db.bottle.getAll();
	}

	async function deleteSelected() {
		const api = window.electronAPI;
		if (!api || bottleSelection.size === 0) return;
		const ids = bottleSelection.array.map(Number);
		if (!confirm(`Supprimer ${ids.length} flacon(s) ?`)) return;
		await api.db.bottle.deleteMany(ids);
		bottleSelection.clear();
		await loadBottles();
	}

	async function exportSelected() {
		const api = window.electronAPI;
		if (!api || bottleSelection.size === 0) return;
		const ids = bottleSelection.array.map(Number);
		await api.db.bottle.exportZip(ids);
	}

	function handleAnalysisClick(row: BottleSummary, key: string) {
		modalData = { row, key };
	}

	function handleEditClick(row: BottleSummary) {
		editRow = row;
	}

	onMount(() => {
		loadBottles();
	});
</script>

<h1>Flacons</h1>

<div class="toolbar">
	<SearchBar bind:value={search} />
	<IconButton
		onclick={exportSelected}
		variant="primary"
		label="Exporter"
		disabled={bottleSelection.size === 0}
	>
		<Download size={18} />
	</IconButton>
	<IconButton
		onclick={deleteSelected}
		variant="danger"
		label="Supprimer"
		disabled={bottleSelection.size === 0}
	>
		<Trash2 size={18} />
	</IconButton>
</div>

<BottleDataTable
	{bottles}
	{search}
	onAnalysisClick={handleAnalysisClick}
	onEditClick={handleEditClick}
/>

{#if modalData}
	<Modal onclose={() => (modalData = null)}>
		<AnalysisAction
			type="bottle"
			id={modalData.row.bottleId}
			analysisKey={modalData.key}
			folderName={modalData.row.folderName}
			hasData={!!modalData.row.availableData?.[
				modalData.key as keyof typeof modalData.row.availableData
			]}
			onclose={() => (modalData = null)}
			onchange={loadBottles}
		/>
	</Modal>
{/if}

{#if editRow}
	<Modal onclose={() => (editRow = null)}>
		<BottleForm
			bottle={editRow}
			onsave={async () => {
				editRow = null;
				await loadBottles();
			}}
		/>
	</Modal>
{/if}

<style>
	h1 {
		margin-bottom: var(--space-md);
		text-align: center;
	}

	.toolbar {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-md);
		margin-bottom: var(--space-md);
	}
</style>

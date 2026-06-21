<script lang="ts">
	import MaterialDataTable from '$lib/components/MaterialDataTable.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import AnalysisAction from '$lib/components/AnalysisAction.svelte';
	import { Trash2, Download } from '@lucide/svelte';
	import { materialSelection } from '$lib/stores/selectionStore.svelte';
	import type { MaterialSummary } from '../../../../../electron/lib/types';
	import { onMount } from 'svelte';

	let materials = $state<MaterialSummary[]>([]);
	let search = $state('');
	let modalData = $state<{ row: MaterialSummary; key: string } | null>(null);

	async function loadMaterials() {
		const api = window.electronAPI;
		if (!api) return;
		materials = await api.db.material.getAll();
	}

	async function deleteSelected() {
		const api = window.electronAPI;
		if (!api || materialSelection.size === 0) return;
		const ids = materialSelection.array.map(Number);
		if (!confirm(`Supprimer ${ids.length} matériau(x) ?`)) return;
		await api.db.material.deleteMany(ids);
		materialSelection.clear();
		await loadMaterials();
	}

	async function exportSelected() {
		const api = window.electronAPI;
		if (!api || materialSelection.size === 0) return;
		const ids = materialSelection.array.map(Number);
		await api.db.material.exportZip(ids);
	}

	function handleAnalysisClick(row: MaterialSummary, key: string) {
		modalData = { row, key };
	}

	onMount(() => {
		loadMaterials();
	});
</script>

<h1>Materiaux</h1>

<div class="toolbar">
	<SearchBar bind:value={search} />
	<IconButton
		onclick={exportSelected}
		variant="primary"
		label="Exporter"
		disabled={materialSelection.size === 0}
	>
		<Download size={18} />
	</IconButton>
	<IconButton
		onclick={deleteSelected}
		variant="danger"
		label="Supprimer"
		disabled={materialSelection.size === 0}
	>
		<Trash2 size={18} />
	</IconButton>
</div>

<MaterialDataTable {materials} {search} onAnalysisClick={handleAnalysisClick} />

{#if modalData}
	<Modal onclose={() => (modalData = null)}>
		<AnalysisAction
			type="material"
			id={modalData.row.materialId}
			analysisKey={modalData.key}
			folderName={modalData.row.folderName}
			hasData={!!modalData.row.availableData?.[
				modalData.key as keyof typeof modalData.row.availableData
			]}
			onclose={() => (modalData = null)}
			onchange={loadMaterials}
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

<script lang="ts">
	import { onMount } from 'svelte';
	import type { MaterialSummary, MaterialWithAnalysis } from '../../../../../electron/lib/types';
	import type { MaterialAnalysisTestType } from '../../../../../shared/enums';
	import { materialSelection } from '$lib/stores/selectionStore.svelte';
	import { ChevronLeft, ChevronRight, Pencil } from '@lucide/svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import EntityImage from '$lib/components/EntityImage.svelte';
	import MaterialGraph from '$lib/components/MaterialGraph.svelte';
	import MaterialDetailsList from '$lib/components/MaterialDetailsList.svelte';
	import MaterialForm from '$lib/components/MaterialForm.svelte';

	const TEST_TYPES: { value: MaterialAnalysisTestType; label: string }[] = [
		{ value: 'ss', label: 'Contrainte–Déformation' },
		{ value: 'fd', label: 'Force–Déplacement' }
	];

	let summaries = $state<MaterialSummary[]>([]);
	let selectedId = $state<number | null>(null);
	let selected = $state<MaterialWithAnalysis | null>(null);
	let testType = $state<MaterialAnalysisTestType>('ss');
	let showEdit = $state(false);

	let options = $derived(
		summaries.map((m) => ({ value: m.materialId, label: m.folderName ?? `#${m.materialId}` }))
	);

	let filteredAnalyses = $derived(selected?.analyses.filter((a) => a.testType === testType));

	onMount(async () => {
		const api = window.electronAPI;
		if (!api) return;
		summaries = (await api.db.material.getAll()).filter((s) =>
			materialSelection.has(String(s.materialId))
		);
		if (summaries.length) selectedId = summaries[0].materialId;
	});

	$effect(() => {
		if (selectedId == null) return;
		const api = window.electronAPI;
		if (!api) return;
		api.db.material.getById(selectedId).then((m) => {
			selected = m ?? null;
		});
	});

	function navigate(dir: 1 | -1) {
		const i = summaries.findIndex((m) => m.materialId === selectedId);
		if (i < 0) return;
		selectedId = summaries[(i + dir + summaries.length) % summaries.length].materialId;
	}

	async function reloadAfterEdit() {
		showEdit = false;
		const api = window.electronAPI;
		if (!api || selectedId == null) return;
		[summaries, selected] = await Promise.all([
			api.db.material.getAll(),
			api.db.material.getById(selectedId).then((m) => m ?? null)
		]);
	}
</script>

{#if showEdit && selected}
	<Modal onclose={() => (showEdit = false)}>
		<MaterialForm material={selected} onsave={reloadAfterEdit} />
	</Modal>
{/if}

{#if summaries.length === 0}
	<p class="empty">Aucun matériau disponible.</p>
{:else}
	<div class="layout">
		<div class="panel-left">
			<div class="selector">
				<IconButton
					onclick={() => navigate(-1)}
					label="Précédent"
					disabled={summaries.length === 1}
				>
					<ChevronLeft size={18} />
				</IconButton>
				<select class="select-input" bind:value={selectedId}>
					{#each options as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				<IconButton onclick={() => navigate(1)} label="Suivant" disabled={summaries.length === 1}>
					<ChevronRight size={18} />
				</IconButton>
			</div>

			<EntityImage
				entity="materials"
				folderName={selected?.folderName}
				imageExtension={selected?.imageExtension}
			/>

			<Card title="Informations">
				{#snippet actions()}
					<IconButton onclick={() => (showEdit = true)} label="Modifier" disabled={!selected}>
						<Pencil size={14} />
					</IconButton>
				{/snippet}
				<MaterialDetailsList material={selected} />
			</Card>
		</div>

		<div class="panel-right">
			<div class="type-buttons">
				{#each TEST_TYPES as tt (tt.value)}
					<Button
						variant={testType === tt.value ? 'primary' : 'secondary'}
						onclick={() => (testType = tt.value)}
					>
						{tt.label}
					</Button>
				{/each}
			</div>
			<div class="graph-wrapper">
				{#key filteredAnalyses}
					<MaterialGraph analyses={selected?.analyses} {testType} />
				{/key}
			</div>
		</div>
	</div>
{/if}

<style>
	.empty {
		text-align: center;
		color: var(--color-text-light);
		margin-top: var(--space-lg);
	}

	.layout {
		display: grid;
		grid-template-columns: 500px 1fr;
		grid-template-rows: 1fr;
		gap: var(--space-md);
		height: 100%;
	}

	.panel-left {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		overflow-y: auto;
		min-height: 0;
	}

	.selector {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.select-input {
		flex: 1;
		min-width: 0;
		padding: var(--space-sm);
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: white;
		color: var(--color-text);
	}

	:global(.panel-left .card-body) {
		gap: 0;
	}

	.panel-right {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		min-height: 0;
	}

	.type-buttons {
		display: flex;
		justify-content: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
		flex-shrink: 0;
	}

	.graph-wrapper {
		flex: 1;
		min-height: 0;
	}
</style>

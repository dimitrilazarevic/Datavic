<script lang="ts">
	import { onMount } from 'svelte';
	import type { MaterialWithAnalysis } from '../../../../../electron/lib/types';
	import type { MaterialAnalysisTestType } from '../../../../../shared/enums';
	import Button from '$lib/components/Button.svelte';
	import MaterialCompareGraph, {
		COMPARATOR_COLORS
	} from '$lib/components/MaterialCompareGraph.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { materialSelection } from '$lib/stores/selectionStore.svelte';

	const DIRECTIONS = ['avg', 'rad', 'long'] as const;

	const TEST_TYPES: { value: MaterialAnalysisTestType; label: string }[] = [
		{ value: 'ss', label: 'Contrainte–Déformation' },
		{ value: 'fd', label: 'Force–Déplacement' }
	];

	let materials = $state<MaterialWithAnalysis[]>([]);
	let loading = $state(true);
	let selectedTestType = $state<MaterialAnalysisTestType>('ss');
	let selected = $state(new Set<string>());

	onMount(async () => {
		const api = window.electronAPI;
		if (!api) {
			loading = false;
			return;
		}
		const summaries = (await api.db.material.getAll()).filter((s) =>
			materialSelection.has(String(s.materialId))
		);
		const all = await Promise.all(summaries.map((s) => api.db.material.getById(s.materialId)));
		materials = all
			.filter((m): m is MaterialWithAnalysis => m != null)
			.sort((a, b) => a.materialId - b.materialId);
		selected = new SvelteSet(
			materials.flatMap((m) => m.analyses.map((a) => makeKey(a.materialId, a.testDirection)))
		);
		loading = false;
	});

	const makeKey = (id: number, direction: string) => `${id}-${direction}`;

	function isSelected(materialId: number, direction: string) {
		return selected.has(makeKey(materialId, direction));
	}

	function toggle(materialId: number, direction: string) {
		const k = makeKey(materialId, direction);
		if (selected.has(k)) selected.delete(k);
		else selected.add(k);
		selected = new SvelteSet(selected);
	}

	function toggleAll(direction: string) {
		const eligible = materials.filter((m) =>
			m.analyses.some((a) => a.testType === selectedTestType && a.testDirection === direction)
		);
		const allSel = eligible.every((m) => isSelected(m.materialId, direction));
		for (const m of eligible) {
			const k = makeKey(m.materialId, direction);
			if (allSel) selected.delete(k);
			else selected.add(k);
		}
		selected = new SvelteSet(selected);
	}

	function hasAnalysis(material: MaterialWithAnalysis, direction: string) {
		return material.analyses.some(
			(a) => a.testType === selectedTestType && a.testDirection === direction
		);
	}

	function materialLabel(m: MaterialWithAnalysis) {
		return m.folderName ?? m.ref1 ?? `#${m.materialId}`;
	}

	let selectedAnalyses = $derived(
		materials.flatMap((m, i) =>
			m.analyses
				.filter(
					(a) =>
						a.testType === selectedTestType && selected.has(makeKey(a.materialId, a.testDirection))
				)
				.map((a) => ({ ...a, materialIndex: i, materialLabel: materialLabel(m) }))
		)
	);
</script>

{#if loading}
	<p class="empty">Chargement...</p>
{:else if materials.length === 0}
	<p class="empty">Aucun matériau disponible.</p>
{:else}
	<div class="layout">
		<div class="col-spacer"></div>
		<div class="type-buttons">
			{#each TEST_TYPES as tt (tt.value)}
				<Button
					variant={selectedTestType === tt.value ? 'primary' : 'secondary'}
					onclick={() => (selectedTestType = tt.value)}
				>
					{tt.label}
				</Button>
			{/each}
		</div>

		<div class="selection-list">
			<div class="grid-row header-row">
				<span></span>
				{#each DIRECTIONS as dir (dir)}
					<button class="th-btn" onclick={() => toggleAll(dir)}>
						{dir.toUpperCase()}
					</button>
				{/each}
			</div>
			{#each materials as material, i (material.materialId)}
				<div class="grid-row">
					<span
						class="entity-label"
						style="color: {COMPARATOR_COLORS[i % COMPARATOR_COLORS.length]}"
					>
						<strong>{i + 1}</strong>
						{materialLabel(material)}
					</span>
					{#each DIRECTIONS as dir (dir)}
						<input
							type="checkbox"
							checked={isSelected(material.materialId, dir)}
							disabled={!hasAnalysis(material, dir)}
							onchange={() => toggle(material.materialId, dir)}
						/>
					{/each}
				</div>
			{/each}
		</div>

		<div class="panel-right">
			<div class="graph-wrapper">
				{#key selectedAnalyses}
					<MaterialCompareGraph analyses={selectedAnalyses} testType={selectedTestType} />
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
		grid-template-columns: 400px 1fr;
		grid-template-rows: auto 1fr;
		gap: var(--space-md);
		height: 100%;
	}

	.type-buttons {
		display: flex;
		justify-content: center;
		gap: var(--space-sm);
		flex-wrap: wrap;
		align-items: center;
	}

	.selection-list {
		align-self: start;
		overflow-y: auto;
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: white;
	}

	.grid-row {
		display: grid;
		grid-template-columns: 1fr 52px 52px 52px;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		border-bottom: 1px solid var(--color-surface);
	}

	.grid-row:last-child {
		border-bottom: none;
	}

	.header-row {
		background: var(--color-primary);
		position: sticky;
		top: 0;
		z-index: 1;
		color: white;
	}

	.th-btn {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: var(--radius);
		padding: 2px 4px;
		font-size: var(--text-sm);
		font-weight: 600;
		cursor: pointer;
		color: white;
		justify-self: center;
	}

	.th-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.entity-label {
		font-size: var(--text-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	input[type='checkbox'] {
		justify-self: center;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	input[type='checkbox']:disabled {
		cursor: not-allowed;
		opacity: 0.3;
	}

	.panel-right {
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.graph-wrapper {
		flex: 1;
		min-height: 0;
	}
</style>

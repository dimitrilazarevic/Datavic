<script lang="ts">
	import { onMount } from 'svelte';
	import type { BottleWithAnalysis } from '../../../../../electron/lib/types';
	import type { BottleAnalysisTestType } from '../../../../../shared/enums';
	import Button from '$lib/components/Button.svelte';
	import BottleCompareGraph, { COMPARATOR_COLORS } from '$lib/components/BottleCompareGraph.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { bottleSelection } from '$lib/stores/selectionStore.svelte';

	const THICKNESS_TYPES = ['lin', 'tom', 'exp'] as const;

	const TEST_TYPES: { value: BottleAnalysisTestType; label: string }[] = [
		{ value: 'squeeze', label: 'Squeeze' },
		{ value: 'sideload_io', label: 'Sideload IO' },
		{ value: 'sideload_ioi', label: 'Sideload IOI' },
		{ value: 'topload', label: 'Topload' }
	];

	let bottles = $state<BottleWithAnalysis[]>([]);
	let loading = $state(true);
	let selectedTestType = $state<BottleAnalysisTestType>('squeeze');
	let selected = $state(new Set<string>());

	onMount(async () => {
		const api = window.electronAPI;
		if (!api) {
			loading = false;
			return;
		}
		const summaries = (await api.db.bottle.getAll()).filter((s) =>
			bottleSelection.has(String(s.bottleId))
		);
		const all = await Promise.all(summaries.map((s) => api.db.bottle.getById(s.bottleId)));
		bottles = all
			.filter((b): b is BottleWithAnalysis => b != null)
			.sort((a, b) => a.bottleId - b.bottleId);
		selected = new SvelteSet(
			bottles.flatMap((b) => b.analyses.map((a) => makeKey(a.bottleId, a.thicknessType)))
		);
		loading = false;
	});

	const makeKey = (id: number, type: string) => `${id}-${type}`;

	function isSelected(bottleId: number, thicknessType: string) {
		return selected.has(makeKey(bottleId, thicknessType));
	}

	function toggle(bottleId: number, thicknessType: string) {
		const k = makeKey(bottleId, thicknessType);
		if (selected.has(k)) selected.delete(k);
		else selected.add(k);
		selected = new SvelteSet(selected);
	}

	function toggleAll(thicknessType: string) {
		const eligible = bottles.filter((b) =>
			b.analyses.some((a) => a.testType === selectedTestType && a.thicknessType === thicknessType)
		);
		const allSel = eligible.every((b) => isSelected(b.bottleId, thicknessType));
		for (const b of eligible) {
			const k = makeKey(b.bottleId, thicknessType);
			if (allSel) selected.delete(k);
			else selected.add(k);
		}
		selected = new SvelteSet(selected);
	}

	function hasAnalysis(bottle: BottleWithAnalysis, thicknessType: string) {
		return bottle.analyses.some(
			(a) => a.testType === selectedTestType && a.thicknessType === thicknessType
		);
	}

	function bottleLabel(b: BottleWithAnalysis) {
		return `${b.brandName} ${b.bottleTypeName} — ${b.claimMl} mL`;
	}

	let selectedAnalyses = $derived(
		bottles.flatMap((b, i) =>
			b.analyses
				.filter(
					(a) =>
						a.testType === selectedTestType && selected.has(makeKey(a.bottleId, a.thicknessType))
				)
				.map((a) => ({ ...a, bottleIndex: i, bottleLabel: bottleLabel(b) }))
		)
	);
</script>

{#if loading}
	<p class="empty">Chargement...</p>
{:else if bottles.length === 0}
	<p class="empty">Aucun flacon disponible.</p>
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
				{#each THICKNESS_TYPES as tt (tt)}
					<button class="th-btn" onclick={() => toggleAll(tt)}>
						{tt.toUpperCase()}
					</button>
				{/each}
			</div>
			{#each bottles as bottle, i (bottle.bottleId)}
				<div class="grid-row">
					<span
						class="entity-label"
						style="color: {COMPARATOR_COLORS[i % COMPARATOR_COLORS.length]}"
					>
						<strong>{i + 1}</strong>
						{bottleLabel(bottle)}
					</span>
					{#each THICKNESS_TYPES as tt (tt)}
						<input
							type="checkbox"
							checked={isSelected(bottle.bottleId, tt)}
							disabled={!hasAnalysis(bottle, tt)}
							onchange={() => toggle(bottle.bottleId, tt)}
						/>
					{/each}
				</div>
			{/each}
		</div>

		<div class="panel-right">
			<div class="graph-wrapper">
				{#key selectedAnalyses}
					<BottleCompareGraph analyses={selectedAnalyses} />
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

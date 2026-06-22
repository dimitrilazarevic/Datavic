<script module lang="ts">
	export const COMPARATOR_COLORS = [
		'#d20f39',
		'#1e66f5',
		'#40a02b',
		'#df8e1d',
		'#8839ef',
		'#04a5e5'
	];
</script>

<script lang="ts">
	import type { BottleAnalysis } from '../../../electron/lib/types';
	import Graph from './Graph.svelte';
	import type { GraphDataset } from './Graph.svelte';

	const LINE_STYLES: Record<string, { borderDash?: number[] }> = {
		exp: {},
		lin: { borderDash: [6, 3] },
		tom: { borderDash: [2, 2] }
	};

	type AnalysisEntry = BottleAnalysis & { bottleIndex: number; bottleLabel: string };

	let { analyses }: { analyses: AnalysisEntry[] } = $props();

	let datasets: GraphDataset[] | undefined = $derived(
		analyses.length
			? analyses.map((a) => ({
					label: `${a.bottleLabel} – ${a.thicknessType.toUpperCase()}`,
					xCoordinates: a.xCoordinates,
					yCoordinates: a.yCoordinates,
					color: COMPARATOR_COLORS[a.bottleIndex % COMPARATOR_COLORS.length],
					lineStyle: LINE_STYLES[a.thicknessType] ?? {}
				}))
			: undefined
	);
</script>

<Graph {datasets} xLabel="Displacement (mm)" yLabel="Force (N)" />

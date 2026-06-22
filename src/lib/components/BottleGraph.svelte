<script lang="ts">
	import type { BottleAnalysis } from '../../../electron/lib/types';
	import Graph from './Graph.svelte';
	import type { GraphDataset } from './Graph.svelte';

	const COLORS: Record<string, string> = {
		exp: '#d20f39',
		lin: '#1e66f5',
		tom: '#df8e1d'
	};

	const LINE_STYLES: Record<string, { borderDash?: number[] }> = {
		exp: {},
		lin: { borderDash: [6, 3] },
		tom: { borderDash: [2, 2] }
	};

	let { analyses }: { analyses: BottleAnalysis[] | undefined } = $props();

	let datasets: GraphDataset[] | undefined = $derived(
		analyses
			?.slice()
			.sort((a, b) => (a.thicknessType < b.thicknessType ? -1 : 1))
			.map((a) => ({
				label: a.thicknessType,
				xCoordinates: a.xCoordinates,
				yCoordinates: a.yCoordinates,
				color: COLORS[a.thicknessType] ?? '#888',
				lineStyle: LINE_STYLES[a.thicknessType] ?? {}
			}))
	);
</script>

<Graph {datasets} xLabel="Displacement (mm)" yLabel="Force (N)" />

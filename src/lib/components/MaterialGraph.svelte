<script lang="ts">
	import type { MaterialAnalysis } from '../../../electron/lib/types';
	import type { MaterialAnalysisTestType } from '../../../shared/enums';
	import Graph from './Graph.svelte';
	import type { GraphDataset } from './Graph.svelte';

	const COLORS: Record<string, string> = {
		avg: '#1e66f5',
		rad: '#d20f39',
		long: '#40a02b'
	};

	const LINE_STYLES: Record<string, { borderDash?: number[] }> = {
		avg: {},
		rad: { borderDash: [6, 3] },
		long: { borderDash: [2, 2] }
	};

	const AXIS_LABELS: Record<MaterialAnalysisTestType, { x: string; y: string }> = {
		ss: { x: 'Déformation (%)', y: 'Contrainte (MPa)' },
		fd: { x: 'Déplacement (mm)', y: 'Force (N)' }
	};

	let {
		analyses,
		testType
	}: {
		analyses: MaterialAnalysis[] | undefined;
		testType: MaterialAnalysisTestType;
	} = $props();

	let filtered = $derived(analyses?.filter((a) => a.testType === testType));

	let datasets: GraphDataset[] | undefined = $derived(
		filtered
			?.slice()
			.sort((a, b) => (a.testDirection < b.testDirection ? -1 : 1))
			.map((a) => ({
				label: a.testDirection,
				xCoordinates: a.xCoordinates,
				yCoordinates: a.yCoordinates,
				color: COLORS[a.testDirection] ?? '#888',
				lineStyle: LINE_STYLES[a.testDirection] ?? {}
			}))
	);
</script>

<Graph {datasets} xLabel={AXIS_LABELS[testType].x} yLabel={AXIS_LABELS[testType].y} />

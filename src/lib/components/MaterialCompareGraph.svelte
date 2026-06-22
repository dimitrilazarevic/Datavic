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
	import type { MaterialAnalysis } from '../../../electron/lib/types';
	import type { MaterialAnalysisTestType } from '../../../shared/enums';
	import Graph from './Graph.svelte';
	import type { GraphDataset } from './Graph.svelte';

	const LINE_STYLES: Record<string, { borderDash?: number[] }> = {
		avg: {},
		rad: { borderDash: [6, 3] },
		long: { borderDash: [2, 2] }
	};

	const AXIS_LABELS: Record<MaterialAnalysisTestType, { x: string; y: string }> = {
		ss: { x: 'Déformation (%)', y: 'Contrainte (MPa)' },
		fd: { x: 'Déplacement (mm)', y: 'Force (N)' }
	};

	type AnalysisEntry = MaterialAnalysis & { materialIndex: number; materialLabel: string };

	let { analyses, testType }: { analyses: AnalysisEntry[]; testType: MaterialAnalysisTestType } =
		$props();

	let datasets: GraphDataset[] | undefined = $derived(
		analyses.length
			? analyses.map((a) => ({
					label: `${a.materialLabel} – ${a.testDirection.toUpperCase()}`,
					xCoordinates: a.xCoordinates,
					yCoordinates: a.yCoordinates,
					color: COMPARATOR_COLORS[a.materialIndex % COMPARATOR_COLORS.length],
					lineStyle: LINE_STYLES[a.testDirection] ?? {}
				}))
			: undefined
	);
</script>

<Graph {datasets} xLabel={AXIS_LABELS[testType].x} yLabel={AXIS_LABELS[testType].y} />

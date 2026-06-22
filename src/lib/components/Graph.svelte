<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount, onDestroy } from 'svelte';

	export type LineStyle = {
		borderDash?: number[];
		borderWidth?: number;
	};

	export type GraphDataset = {
		label: string;
		xCoordinates: number[] | null;
		yCoordinates: number[] | null;
		color: string;
		lineStyle?: LineStyle;
	};

	let {
		datasets,
		xLabel,
		yLabel
	}: {
		datasets: GraphDataset[] | undefined;
		xLabel: string;
		yLabel: string;
	} = $props();

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let chart: Chart | undefined;

	function sample<T>(arr: T[]): T[] {
		const MAX = 100;
		if (arr.length <= MAX) return arr;
		const step = Math.ceil(arr.length / MAX);
		return arr.filter((_, i) => i % step === 0);
	}

	onMount(() => {
		if (!canvasEl || !datasets?.length) return;
		chart = new Chart(canvasEl, {
			type: 'scatter',
			data: {
				datasets: datasets.map((d) => {
					const xs = d.xCoordinates ?? [];
					const ys = d.yCoordinates ?? [];
					return {
						label: d.label,
						data: sample(xs.map((x, i) => ({ x, y: ys[i] ?? 0 }))),
						borderColor: d.color,
						backgroundColor: 'transparent',
						pointRadius: 0,
						pointHoverRadius: 5,
						showLine: true,
						tension: 0.1,
						...(d.lineStyle ?? {})
					};
				})
			},
			options: {
				parsing: false,
				maintainAspectRatio: false,
				interaction: { mode: 'index', intersect: false },
				plugins: {
					legend: { display: true },
					tooltip: { mode: 'index', intersect: false }
				},
				scales: {
					x: { type: 'linear', title: { display: true, text: xLabel }, min: 0 },
					y: { title: { display: true, text: yLabel }, min: 0 }
				},
				animation: false
			}
		});
	});

	onDestroy(() => chart?.destroy());
</script>

<div class="wrapper">
	{#if datasets?.length}
		<canvas bind:this={canvasEl}></canvas>
	{:else}
		<div class="placeholder">
			<svg
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
			</svg>
			Aucune analyse disponible
		</div>
	{/if}
</div>

<style>
	.wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 300px;
	}

	canvas {
		width: 100%;
		height: 100%;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px dashed var(--color-surface);
		border-radius: var(--radius);
		color: var(--color-text-light);
		font-size: var(--text-sm);
	}
</style>

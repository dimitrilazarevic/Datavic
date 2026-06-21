<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import BottleForm from '$lib/components/BottleForm.svelte';
	import BottleDataTable from '$lib/components/BottleDataTable.svelte';
	import type { Bottle, BottleSummary } from '../../../../../electron/lib/types';
	import { onMount } from 'svelte';

	let bottles = $state<BottleSummary[]>([]);
	let thisOneBottle = $state<Bottle | undefined>();

	async function loadBottles() {
		const api = window.electronAPI;
		if (!api) return;
		bottles = await api.db.bottle.getAll();
	}

	async function loadThisOneBottle() {
		const api = window.electronAPI;
		if (!api) return;
		const bottle = await api.db.bottle.getById(14);
		thisOneBottle = bottle;
		console.log(bottle);
	}

	onMount(() => {
		loadThisOneBottle();
	});
</script>

<h1>Flacons</h1>

<div class="layout">
	<Card title="Nouveau flacon">
		<BottleForm onsave={loadBottles} bottle={thisOneBottle} />
	</Card>

	<Card title="Flacons existants">
		<BottleDataTable {bottles} />
	</Card>
</div>

<style>
	h1 {
		margin-bottom: var(--space-md);
	}

	.layout {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
</style>

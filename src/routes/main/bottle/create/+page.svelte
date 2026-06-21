<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import BottleForm from '$lib/components/BottleForm.svelte';
</script>

<h1>Nouveau flacon</h1>

<Card title="Créer un flacon">
	<BottleForm />
</Card>

<style>
	h1 {
		margin-bottom: var(--space-md);
	}
</style>

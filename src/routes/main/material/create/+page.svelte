<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import MaterialForm from '$lib/components/MaterialForm.svelte';
</script>

<h1>Nouveau matériau</h1>

<Card title="Créer un matériau">
	<MaterialForm />
</Card>

<style>
	h1 {
		margin-bottom: var(--space-md);
	}
</style>

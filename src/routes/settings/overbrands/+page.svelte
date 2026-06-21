<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Sur-marques"
	api={window.electronAPI!.db.overbrand}
	idKey="overBrandId"
	fields={[{ key: 'overbrandName', label: 'Nom de la sur-marque' }]}
/>

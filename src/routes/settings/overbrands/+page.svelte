<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Marques mères"
	api={window.electronAPI!.db.overbrand}
	idKey="overBrandId"
	fields={[{ key: 'overbrandName', label: 'Nom de la sur-marque' }]}
/>

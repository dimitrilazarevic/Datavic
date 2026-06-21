<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Marques"
	api={window.electronAPI!.db.brand}
	idKey="brandId"
	fields={[{ key: 'brandName', label: 'Nom de la marque' }]}
/>

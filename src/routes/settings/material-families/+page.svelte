<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Familles de matériaux"
	api={window.electronAPI!.db.materialFamily}
	idKey="materialFamilyId"
	fields={[{ key: 'materialFamilyName', label: 'Nom de la famille' }]}
/>

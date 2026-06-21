<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Zones"
	api={window.electronAPI!.db.zone}
	idKey="zoneId"
	fields={[{ key: 'zoneName', label: 'Nom de la zone' }]}
/>

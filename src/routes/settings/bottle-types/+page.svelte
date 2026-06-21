<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Types de bouteille"
	api={window.electronAPI!.db.bottleType}
	idKey="bottleTypeId"
	fields={[
		{ key: 'bottleTypeName', label: 'Nom du type' },
		{ key: 'bottleTypeConstant', label: 'Constante', type: 'number' }
	]}
/>

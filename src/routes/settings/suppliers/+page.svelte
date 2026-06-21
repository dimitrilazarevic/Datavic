<script lang="ts">
	import SimpleCrud from '$lib/components/SimpleCrud.svelte';
</script>

<SimpleCrud
	title="Fournisseurs"
	api={window.electronAPI!.db.supplier}
	idKey="supplierId"
	fields={[{ key: 'supplierName', label: 'Nom du fournisseur' }]}
/>

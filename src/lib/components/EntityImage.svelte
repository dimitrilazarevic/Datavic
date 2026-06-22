<script lang="ts">
	let {
		entity,
		folderName,
		imageExtension
	}: {
		entity: 'bottles' | 'materials';
		folderName: string | null | undefined;
		imageExtension: string | null | undefined;
	} = $props();

	let src = $state<string | null>(null);

	$effect(() => {
		const api = window.electronAPI;
		if (!api || !folderName || !imageExtension) {
			src = null;
			return;
		}
		api.getEntityImage(entity, folderName, imageExtension).then((result) => {
			src = result;
		});
	});
</script>

<img src={src ?? '/cat.jpg'} alt={folderName ?? ''} class="entity-image" />

<style>
	.entity-image {
		width: 100%;
		max-height: 260px;
		object-fit: contain;
		border-radius: var(--radius);
		background: white;
		padding: var(--space-sm);
	}
</style>

<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { Square, SquareCheck } from '@lucide/svelte';
	import type { SelectionStore } from '$lib/stores/selectionStore.svelte';

	interface Props {
		id: string;
		selection: SelectionStore;
	}

	let { id, selection }: Props = $props();

	let selected = $derived(selection.has(id));
</script>

<IconButton
	onclick={() => selection.toggle(id)}
	variant={selected ? 'primary' : 'secondary'}
	label={selected ? 'Retirer de la selection' : 'Ajouter a la selection'}
>
	{#if selected}
		<SquareCheck size={16} />
	{:else}
		<Square size={16} />
	{/if}
</IconButton>

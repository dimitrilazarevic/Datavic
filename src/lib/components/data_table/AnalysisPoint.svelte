<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import { XIcon, CircleCheck } from '@lucide/svelte';

	interface Props {
		value: boolean;
		onclick?: () => void;
		label?: string;
	}

	let { value, onclick, label = '' }: Props = $props();
</script>

<IconButton
	onclick={onclick ?? (() => {})}
	variant={value ? 'primary' : 'danger'}
	label={`${label} : ${value ? 'disponible' : 'non disponible'}`}
>
	{#if value}
		<CircleCheck size={18} />
	{:else}
		<XIcon size={18} />
	{/if}
</IconButton>

<script lang="ts">
	import { Search } from '@lucide/svelte';

	interface Props {
		value: string;
		placeholder?: string;
	}

	let { value = $bindable(), placeholder = 'Rechercher...' }: Props = $props();
</script>

<div class="search-bar">
	<Search size={16} />
	<input type="text" {placeholder} bind:value />
</div>

<style>
	.search-bar {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
		color: var(--color-text-light);
		transition: border-color var(--transition);
	}

	.search-bar:focus-within {
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	input {
		all: unset;
		font-size: var(--text-sm);
		width: 250px;
		color: var(--color-text);
	}
</style>

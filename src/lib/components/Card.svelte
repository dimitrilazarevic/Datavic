<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="card">
	{#if title}
		<h2 class="card-title">{title}</h2>
	{/if}
	<div class="card-body">
		{@render children()}
	</div>
</div>

<style>
	.card {
		background: #fff;
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.card-title {
		font-size: var(--text-base);
		font-weight: 600;
		margin-bottom: var(--space-md);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
</style>

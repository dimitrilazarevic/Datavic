<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		actions?: Snippet;
		children: Snippet;
	}

	let { title, actions, children }: Props = $props();
</script>

<div class="card">
	{#if title || actions}
		<div class="card-header">
			{#if title}<h2 class="card-title">{title}</h2>{/if}
			{#if actions}<div class="card-actions">{@render actions()}</div>{/if}
		</div>
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

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-md);
	}

	.card-title {
		font-size: var(--text-base);
		font-weight: 600;
	}

	.card-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
</style>

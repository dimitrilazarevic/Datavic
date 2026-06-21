<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick?: () => void;
		variant?: 'primary' | 'secondary' | 'ghost';
		children: Snippet;
	}

	let { onclick, variant = 'primary', children }: Props = $props();
</script>

<button class="btn {variant}" {onclick}>
	{@render children()}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: none;
		border-radius: var(--radius);
		font-weight: 600;
		font-size: var(--text-sm);
		cursor: pointer;
		transition: background var(--transition);
	}

	.btn.primary {
		background: var(--color-primary);
		color: #fff;
	}

	.btn.primary:hover {
		opacity: 0.9;
	}

	.btn.secondary {
		background: var(--color-surface);
		color: var(--color-text);
	}

	.btn.secondary:hover {
		opacity: 0.8;
	}

	.btn.ghost {
		background: transparent;
		color: var(--color-primary);
		padding: 0;
		font-weight: 500;
	}

	.btn.ghost:hover {
		text-decoration: underline;
	}
</style>

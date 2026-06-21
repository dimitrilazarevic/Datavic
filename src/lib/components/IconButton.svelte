<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		variant?: 'primary' | 'secondary' | 'danger';
		label: string;
		children: Snippet;
	}

	let { onclick, variant = 'secondary', label, children }: Props = $props();
</script>

<button class="icon-btn {variant}" {onclick} aria-label={label} title={label}>
	{@render children()}
</button>

<style>
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.35rem;
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		transition: background var(--transition);
		color: var(--color-text);
		background: transparent;
	}

	.icon-btn:hover {
		background: var(--color-surface);
	}

	.icon-btn.danger {
		color: var(--color-error);
	}

	.icon-btn.danger:hover {
		background: #fde8ec;
	}

	.icon-btn.primary {
		color: var(--color-primary);
	}

	.icon-btn.primary:hover {
		background: var(--color-primary-light);
	}
</style>

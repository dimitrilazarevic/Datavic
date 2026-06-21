<script lang="ts">
	import { page } from '$app/state';

	interface NavItem {
		href: string;
		label: string;
	}

	interface Props {
		title: string;
		items: NavItem[];
	}

	let { title, items }: Props = $props();
</script>

<aside>
	<h2>{title}</h2>
	<nav>
		{#each items as item (item.href)}
			<a href={item.href} class:active={page.url.pathname === item.href}>{item.label}</a>
		{/each}
	</nav>
</aside>

<style>
	aside {
		min-width: 180px;
		padding: var(--space-md);
	}

	h2 {
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-light);
		margin-bottom: var(--space-sm);
	}

	nav {
		display: flex;
		flex-direction: column;
	}

	nav a {
		color: var(--color-text);
		text-decoration: none;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		transition: background var(--transition);
	}

	nav a:hover {
		background: var(--color-surface);
	}

	nav a.active {
		background: var(--color-primary-light);
		color: var(--color-primary);
		font-weight: 500;
	}
</style>

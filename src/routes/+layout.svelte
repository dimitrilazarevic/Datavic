<script lang="ts">
	import { page } from '$app/stores';
	import '$lib/assets/app.css'
	let { children } = $props();
</script>

<svelte:head>
</svelte:head>

<nav>
	<a href="/" class:active={$page.url.pathname === '/'}>Accueil</a>
	<a href="/settings/db" class:active={$page.url.pathname.startsWith('/settings')}>Paramètres</a>
</nav>

<main>
	{@render children()}
</main>

<style>
	nav {
		display: flex;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-primary);
	}

	nav a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		font-weight: 500;
		transition: background var(--transition), color var(--transition);
	}

	nav a:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
	}

	nav a.active {
		background: rgba(255, 255, 255, 0.25);
		color: #fff;
	}

	main {
		padding: var(--space-lg);
	}
</style>

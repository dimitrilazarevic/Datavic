<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<div class="settings">
	<aside>
		<h2>Paramètres</h2>
		<nav>
			<a href="/settings/db" class:active={$page.url.pathname === '/settings/db'}>Base de données</a>
			<a href="/settings/brands" class:active={$page.url.pathname === '/settings/brands'}>Marques</a>
			<a href="/settings/overbrands" class:active={$page.url.pathname === '/settings/overbrands'}>Sur-marques</a>
			<a href="/settings/zones" class:active={$page.url.pathname === '/settings/zones'}>Zones</a>
			<a href="/settings/suppliers" class:active={$page.url.pathname === '/settings/suppliers'}>Fournisseurs</a>
			<a href="/settings/material-families" class:active={$page.url.pathname === '/settings/material-families'}>Familles de matériaux</a>
			<a href="/settings/bottle-types" class:active={$page.url.pathname === '/settings/bottle-types'}>Types de bouteille</a>
		</nav>
	</aside>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.settings {
		display: flex;
		gap: var(--space-lg);
	}

	aside {
		min-width: 180px;
	}

	aside h2 {
		font-size: var(--text-sm);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-light);
		margin-bottom: var(--space-sm);
	}

	aside nav {
		display: flex;
		flex-direction: column;
	}

	aside nav a {
		color: var(--color-text);
		text-decoration: none;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		transition: background var(--transition);
	}

	aside nav a:hover {
		background: var(--color-surface);
	}

	aside nav a.active {
		background: var(--color-primary-light);
		color: var(--color-primary);
		font-weight: 500;
	}

	.content {
		margin-left: var(--space-lg);
		flex: 1;
	}
</style>

<script lang="ts">
	import { page } from '$app/state';
	import '$lib/assets/app.css';
	import { Settings } from '@lucide/svelte';
	import VerticalNav from '$lib/components/VerticalNav.svelte';
	let { children } = $props();

	let isMain = $derived(page.url.pathname.startsWith('/main/'));
	let entitySegment = $derived(page.url.pathname.split('/')[2] ?? 'bottle');
	let specificMenu = $derived(page.url.pathname.split('/')[3] ?? 'explore');

	let sidenavItems = $derived([
		{ href: `/main/${entitySegment}/create`, label: 'Créer' },
		{ href: `/main/${entitySegment}/explore`, label: 'Explorer' },
		{ href: `/main/${entitySegment}/view`, label: 'Visualiser' },
		{ href: `/main/${entitySegment}/compare`, label: 'Comparer' }
	]);
</script>

<svelte:head></svelte:head>

<nav>
	<div class="nav-left">
		<a href={`/main/bottle/${specificMenu}`} class:active={page.url.pathname.includes('bottle/')}
			>Bottle</a
		>
		<a
			href={`/main/material/${specificMenu}`}
			class:active={page.url.pathname.includes('material/')}>Material</a
		>
	</div>
	<div class="nav-right">
		<a
			href="/settings/db"
			class:active={page.url.pathname.startsWith('/settings')}
			title="Paramètres"
		>
			<Settings size={24} />
		</a>
	</div>
</nav>

{#if isMain}
	<div class="main-layout">
		<VerticalNav title="Menus" items={sidenavItems} />
		<main>
			{@render children()}
		</main>
	</div>
{:else}
	<main>
		{@render children()}
	</main>
{/if}

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-sm) var(--space-md);
		background: var(--color-primary);
	}

	.nav-left,
	.nav-right {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}

	nav a {
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		font-weight: 500;
		display: flex;
		align-items: center;
		transition:
			background var(--transition),
			color var(--transition);
	}

	nav a:hover {
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
	}

	nav a.active {
		background: rgba(255, 255, 255, 0.25);
		color: #fff;
	}

	.main-layout {
		display: flex;
		height: calc(100vh - var(--nav-height, 48px));
		gap: var(--space-lg);
		padding: var(--space-lg) 0 0 var(--space-lg);
	}

	.main-layout main {
		flex: 1;
		overflow-y: auto;
		padding-left: 0;
		padding-top: 0;
	}

	main {
		padding: var(--space-lg);
	}
</style>

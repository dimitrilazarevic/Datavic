<script lang="ts">
	import VerticalNav from '$lib/components/VerticalNav.svelte';
	let { children } = $props();

	const items = [
		{ href: '/settings/db', label: 'Base de données' },
		{ href: '/settings/brands', label: 'Marques' },
		{ href: '/settings/overbrands', label: 'Marques mères' },
		{ href: '/settings/zones', label: 'Zones' },
		{ href: '/settings/suppliers', label: 'Fournisseurs' },
		{ href: '/settings/material-families', label: 'Familles de matériaux' },
		{ href: '/settings/bottle-types', label: 'Types de bouteille' }
	];
</script>

<div class="settings">
	<VerticalNav title="Paramètres" {items} />

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.settings {
		display: flex;
		gap: var(--space-lg);
	}

	.content {
		margin-left: var(--space-lg);
		flex: 1;
	}
</style>

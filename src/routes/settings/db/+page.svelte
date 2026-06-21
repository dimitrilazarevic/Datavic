<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { Download, FolderOpen, Upload } from '@lucide/svelte';

	let dbFolder = $state<string | null>(null);
	let dbPath = $state('');
	let backupMessage = $state('');

	async function load() {
		const api = window.electronAPI;
		if (!api) return;
		dbFolder = await api.config.getDbFolder();
		dbPath = await api.config.getDbPath();
	}

	async function selectFolder() {
		const api = window.electronAPI;
		if (!api) return;
		await api.config.selectDbFolder();
	}

	async function resetFolder() {
		const api = window.electronAPI;
		if (!api) return;
		await api.config.resetDbFolder();
	}

	async function restoreDb() {
		const api = window.electronAPI;
		if (!api) return;
		try {
			await api.config.restoreDb();
		} catch (err) {
			backupMessage = `Erreur : ${(err as Error).message}`;
		}
	}

	async function backupDb() {
		const api = window.electronAPI;
		if (!api) return;
		backupMessage = '';
		try {
			const path = await api.config.backupDb();
			if (path) backupMessage = `Backup enregistré : ${path}`;
		} catch (err) {
			backupMessage = `Erreur : ${(err as Error).message}`;
		}
	}

	$effect(() => {
		load();
	});
</script>

<h1>Base de données</h1>

<Card title="Emplacement">
	<div class="path-row">
		<IconButton onclick={selectFolder} variant="primary" label="Changer le dossier"><FolderOpen size={16} /></IconButton>
		<Button variant="ghost" onclick={() => window.electronAPI?.openPath(dbPath.replace(/[/\\][^/\\]+$/, ''))}>{dbPath}</Button>
	</div>
	{#if dbFolder}
		<Button variant="secondary" onclick={resetFolder}>Revenir à l'emplacement par défaut</Button>
	{/if}
</Card>

<Card title="Sauvegarde">
	<p class="description">Exporter ou importer une copie de la base de données.</p>
	<div class="backup-actions">
		<Button onclick={backupDb}>
			<Download size={16} />Exporter
		</Button>
		<Button variant="secondary" onclick={restoreDb}>
			<Upload size={16} />Importer
		</Button>
	</div>
	{#if backupMessage}
		<p class="message">{backupMessage}</p>
	{/if}
</Card>

<style>
	h1 {
		margin-bottom: var(--space-md);
	}

	.path-row {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}


	.backup-actions {
		display: flex;
		gap: var(--space-sm);
	}

	.description {
		color: var(--color-text-light);
		font-size: var(--text-sm);
		margin: 0;
	}

	.message {
		padding: var(--space-sm) var(--space-md);
		background: var(--color-primary-light);
		border-radius: var(--radius);
		color: var(--color-primary);
		font-size: var(--text-sm);
	}
</style>

<script lang="ts">
	import { Upload, Trash2 } from '@lucide/svelte';
	import Button from './Button.svelte';
	import { parseAnalysisContent } from '$shared/utils/parseAnalysisContent';
	import { onMount } from 'svelte';

	interface Props {
		type: 'bottle' | 'material';
		id: number;
		analysisKey: string;
		folderName: string | null;
		hasData: boolean;
		onclose: () => void;
		onchange: () => void;
	}

	const { type, id, analysisKey, folderName, hasData, onclose, onchange }: Props = $props();

	let dbDir = $state('');

	onMount(async () => {
		const dbPath = await window.electronAPI?.config.getDbPath();
		if (dbPath) dbDir = dbPath.replace(/[/\\][^/\\]+$/, '');
	});

	function openFolder() {
		if (folderName && dbDir) {
			const entity = type === 'bottle' ? 'bottles' : 'materials';
			window.electronAPI?.openPath(`${dbDir}/${entity}/${folderName}`);
		}
	}

	let error = $state('');
	let uploading = $state(false);
	let inputEl: HTMLInputElement;

	async function handleUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		error = '';
		uploading = true;

		try {
			const content = await file.text();
			const { x, y, raw } = parseAnalysisContent(content);

			const api = window.electronAPI;
			if (!api) return;

			const data = {
				analysisKey,
				fileName: `${analysisKey}.txt`,
				xCoordinates: x,
				yCoordinates: y,
				fileContentText: raw
			};

			await api.db[type].uploadAnalysis(id, data);
			onchange();
			onclose();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur inconnue';
		} finally {
			uploading = false;
			if (inputEl) inputEl.value = '';
		}
	}

	async function handleDelete() {
		const api = window.electronAPI;
		if (!api) return;

		try {
			await api.db[type].deleteAnalysis(id, analysisKey);
			onchange();
			onclose();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Erreur lors de la suppression';
		}
	}
</script>

<div class="analysis-action">
	<div class="header">
		<span class="tag">{analysisKey.toUpperCase()}</span>
		{#if folderName}
			<Button variant="ghost" onclick={openFolder}>{folderName}</Button>
		{/if}
	</div>

	<hr />

	<p class="status">
		{hasData ? 'Donnée existante' : 'Aucune donnée'}
	</p>

	<input bind:this={inputEl} type="file" accept=".txt" onchange={handleUpload} class="hidden" />

	<div class="actions">
		<Button variant="primary" onclick={() => inputEl?.click()} disabled={uploading}>
			<Upload size={16} />
			{hasData ? 'Remplacer' : 'Ajouter'}
		</Button>

		{#if hasData}
			<Button variant="secondary" onclick={handleDelete}>
				<Trash2 size={16} />
				Supprimer
			</Button>
		{/if}

		<Button variant="ghost" onclick={onclose}>Annuler</Button>
	</div>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>

<style>
	.analysis-action {
		min-width: 300px;
	}

	.header {
		margin-bottom: var(--space-sm);
	}

	.tag {
		display: inline-block;
		background: var(--color-primary);
		color: #fff;
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		margin-bottom: var(--space-sm);
	}

	hr {
		border: none;
		border-top: 1px solid var(--color-surface);
		margin: var(--space-md) 0;
	}

	.status {
		font-weight: 600;
		margin: 0 0 var(--space-md);
	}

	.actions {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}

	.hidden {
		display: none;
	}

	.error {
		color: var(--color-error);
		font-size: 0.8rem;
		margin-top: var(--space-sm);
	}
</style>

<script lang="ts">
	import { FileText, Upload, X } from '@lucide/svelte';

	export interface FileEntry {
		fileName: string;
		fileContent: string;
	}

	interface Props {
		id?: string;
		label?: string;
		accept?: string;
		hint?: string;
		analysisFiles?: FileEntry[];
		error?: string;
	}

	let {
		id = 'files',
		label = 'Fichiers',
		accept = '.txt',
		hint = 'Fichiers texte (.txt)',
		analysisFiles = $bindable<FileEntry[]>([]),
		error
	}: Props = $props();

	let inputEl: HTMLInputElement;

	async function handleFiles(e: Event) {
		const selected = (e.target as HTMLInputElement).files;
		if (!selected) return;

		const promises = Array.from(selected).map(
			(file) =>
				new Promise<FileEntry>((resolve) => {
					const reader = new FileReader();
					reader.onload = () => {
						resolve({ fileName: file.name, fileContent: reader.result as string });
					};
					reader.readAsText(file);
				})
		);

		analysisFiles = await Promise.all(promises);

		if (inputEl) inputEl.value = '';
	}

	function remove(index: number) {
		analysisFiles = analysisFiles.filter((_, i) => i !== index);
	}

	function triggerInput() {
		inputEl?.click();
	}
</script>

<div class="field">
	<label for={id}>{label}</label>
	<input
		bind:this={inputEl}
		{id}
		type="file"
		{accept}
		multiple
		onchange={handleFiles}
		class="hidden"
	/>

	{#if analysisFiles.length > 0}
		<ul class="file-list">
			{#each analysisFiles as file, i (file.fileName + i)}
				<li class="file-item">
					<FileText size={14} />
					<span class="file-name" title={file.fileName}>{file.fileName}</span>
					<button type="button" class="btn-icon" onclick={() => remove(i)} title="Retirer">
						<X size={14} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<button type="button" class="drop-zone" onclick={triggerInput}>
		<Upload size={20} />
		<span>{analysisFiles.length > 0 ? 'Ajouter des fichiers' : 'Choisir des fichiers'}</span>
		<span class="hint-text">{hint}</span>
	</button>

	{#if error}<span class="error">{error}</span>{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	label {
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.hidden {
		display: none;
	}

	.drop-zone {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
		padding: var(--space-md);
		border: 2px dashed var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
		color: var(--color-text-light);
		cursor: pointer;
		transition:
			border-color var(--transition),
			color var(--transition);
	}

	.drop-zone:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.drop-zone span {
		font-size: var(--text-sm);
	}

	.hint-text {
		font-size: 0.7rem !important;
		opacity: 0.6;
	}

	.file-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.file-item {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: var(--color-bg);
	}

	.file-name {
		flex: 1;
		font-size: var(--text-sm);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.2rem;
		border: none;
		border-radius: var(--radius);
		background: transparent;
		color: var(--color-text-light);
		cursor: pointer;
	}

	.btn-icon:hover {
		background: var(--color-surface);
		color: var(--color-error);
	}

	.error {
		color: var(--color-error);
		font-size: 0.75rem;
	}
</style>

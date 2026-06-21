<script lang="ts">
	import { Upload, X } from '@lucide/svelte';

	const ACCEPTED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'svg'] as const;
	const ACCEPT_STRING = ACCEPTED_EXTENSIONS.map((e) => `.${e}`).join(',');

	interface Props {
		id?: string;
		label?: string;
		imageData?: Uint8Array;
		imageExtension?: string;
		error?: string;
	}

	let {
		id = 'image',
		label = 'Image',
		imageData = $bindable<Uint8Array | undefined>(),
		imageExtension = $bindable<string | undefined>(),
		error
	}: Props = $props();

	let fileName = $state('');
	let inputEl: HTMLInputElement;

	function handleFile(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;

		const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
		if (!ACCEPTED_EXTENSIONS.includes(ext as (typeof ACCEPTED_EXTENSIONS)[number])) {
			clear();
			return;
		}

		fileName = file.name;
		imageExtension = ext;

		const reader = new FileReader();
		reader.onload = () => {
			imageData = new Uint8Array(reader.result as ArrayBuffer);
		};
		reader.readAsArrayBuffer(file);
	}

	function clear() {
		imageData = undefined;
		imageExtension = undefined;
		fileName = '';
		if (inputEl) inputEl.value = '';
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
		accept={ACCEPT_STRING}
		onchange={handleFile}
		class="hidden"
	/>

	{#if fileName && imageData && imageExtension}
		<div class="file-selected">
			<span class="file-name" title={fileName}>{fileName}</span>
			<button type="button" class="btn-icon" onclick={clear} title="Retirer">
				<X size={14} />
			</button>
		</div>
	{:else}
		<button type="button" class="drop-zone" onclick={triggerInput}>
			<Upload size={20} />
			<span>Choisir une image</span>
			<span class="hint">png, jpg, jpeg, webp, svg</span>
		</button>
	{/if}

	{#if error}<span class="error">{error}</span>{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
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

	.hint {
		font-size: 0.7rem !important;
		opacity: 0.6;
	}

	.file-selected {
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

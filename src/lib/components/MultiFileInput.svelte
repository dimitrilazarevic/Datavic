<script lang="ts">
	import { FileText, Upload, X } from '@lucide/svelte';

	export interface FileEntry {
		fileName: string;
		fileContent: string;
	}

	interface UploadedFile {
		id: string;
		originalName: string;
		content: string;
	}

	interface Slot {
		name: string;
		file?: UploadedFile;
	}

	interface Props {
		id?: string;
		label?: string;
		accept?: string;
		hint?: string;
		acceptedFilenames?: string[];
		analysisFiles?: FileEntry[];
		error?: string;
	}

	let {
		id = 'files',
		label = 'Fichiers',
		accept = '.txt',
		hint = 'Fichiers texte (.txt)',
		acceptedFilenames = [],
		analysisFiles = $bindable<FileEntry[]>([]),
		error
	}: Props = $props();

	let inputEl: HTMLInputElement;

	let slots = $state<Slot[]>([]);
	let unmatched = $state<UploadedFile[]>([]);
	let dragging = $state<{ file: UploadedFile; source: 'unmatched' | string } | null>(null);
	let dragOverSlot = $state<string | null>(null);

	let idCounter = 0;
	function uid() {
		return `f${++idCounter}`;
	}

	$effect(() => {
		slots = acceptedFilenames.map((name) => ({ name }));
		unmatched = [];
	});

	$effect(() => {
		analysisFiles = slots
			.filter((s) => s.file != null)
			.map((s) => ({ fileName: s.name, fileContent: s.file!.content }));
	});

	async function handleFiles(e: Event) {
		const selected = (e.target as HTMLInputElement).files;
		if (!selected) return;

		const read = await Promise.all(
			Array.from(selected).map(
				(file) =>
					new Promise<UploadedFile>((resolve) => {
						const reader = new FileReader();
						reader.onload = () =>
							resolve({ id: uid(), originalName: file.name, content: reader.result as string });
						reader.readAsText(file);
					})
			)
		);

		if (acceptedFilenames.length === 0) {
			analysisFiles = read.map((f) => ({ fileName: f.originalName, fileContent: f.content }));
			if (inputEl) inputEl.value = '';
			return;
		}

		const newSlots = slots.map((s) => ({ ...s }));
		const newUnmatched = [...unmatched];

		for (const file of read) {
			const idx = newSlots.findIndex((s) => s.name === file.originalName);
			if (idx !== -1) {
				if (newSlots[idx].file) newUnmatched.push(newSlots[idx].file!);
				newSlots[idx] = { ...newSlots[idx], file };
			} else {
				newUnmatched.push(file);
			}
		}

		slots = newSlots;
		unmatched = newUnmatched;
		if (inputEl) inputEl.value = '';
	}

	function onDragStart(file: UploadedFile, source: 'unmatched' | string, e: DragEvent) {
		dragging = { file, source };
		e.dataTransfer?.setData('text/plain', file.id);
	}

	function onDragEnd() {
		dragging = null;
		dragOverSlot = null;
	}

	function onDragEnter(slotName: string) {
		if (dragging) dragOverSlot = slotName;
	}

	function onDragLeave(slotName: string, e: DragEvent) {
		if (
			dragOverSlot === slotName &&
			!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)
		) {
			dragOverSlot = null;
		}
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function onDropSlot(slotName: string) {
		if (!dragging) return;
		const { file, source } = dragging;

		const newSlots = slots.map((s) => ({ ...s }));
		const newUnmatched = [...unmatched];

		const targetIdx = newSlots.findIndex((s) => s.name === slotName);
		if (targetIdx === -1) {
			dragging = null;
			dragOverSlot = null;
			return;
		}

		if (newSlots[targetIdx].file && newSlots[targetIdx].file!.id !== file.id) {
			newUnmatched.push(newSlots[targetIdx].file!);
		}

		if (source === 'unmatched') {
			const i = newUnmatched.findIndex((f) => f.id === file.id);
			if (i !== -1) newUnmatched.splice(i, 1);
		} else {
			const srcIdx = newSlots.findIndex((s) => s.name === source);
			if (srcIdx !== -1) newSlots[srcIdx] = { ...newSlots[srcIdx], file: undefined };
		}

		newSlots[targetIdx] = { ...newSlots[targetIdx], file };
		slots = newSlots;
		unmatched = newUnmatched;
		dragging = null;
		dragOverSlot = null;
	}

	function clearSlot(slotName: string) {
		const slot = slots.find((s) => s.name === slotName);
		if (slot?.file) {
			unmatched = [...unmatched, slot.file];
			slots = slots.map((s) => (s.name === slotName ? { ...s, file: undefined } : s));
		}
	}

	function removeUnmatched(fileId: string) {
		unmatched = unmatched.filter((f) => f.id !== fileId);
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

	<button type="button" class="upload-btn" onclick={triggerInput}>
		<Upload size={16} />
		<span>Importer des fichiers</span>
		<span class="hint-text">{hint}</span>
	</button>

	{#if acceptedFilenames.length > 0}
		{#if unmatched.length > 0}
			<div class="unmatched-section">
				<p class="section-hint">Fichiers non reconnus — glisser vers un emplacement :</p>
				<div class="chip-list">
					{#each unmatched as file (file.id)}
						<div
							class="chip"
							class:dragging={dragging?.file.id === file.id}
							draggable="true"
							ondragstart={(e) => onDragStart(file, 'unmatched', e)}
							ondragend={onDragEnd}
							role="button"
							tabindex="0"
						>
							<FileText size={12} />
							<span class="chip-name" title={file.originalName}>{file.originalName}</span>
							<button
								type="button"
								class="btn-icon"
								onclick={() => removeUnmatched(file.id)}
								title="Retirer"
							>
								<X size={12} />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="slots-grid">
			{#each slots as slot (slot.name)}
				<div
					class="slot"
					class:filled={slot.file != null}
					class:drag-over={dragOverSlot === slot.name}
					ondragover={onDragOver}
					ondragenter={() => onDragEnter(slot.name)}
					ondragleave={(e) => onDragLeave(slot.name, e)}
					ondrop={() => onDropSlot(slot.name)}
					role="region"
					aria-label={slot.name}
				>
					<span class="slot-label">{slot.name}</span>
					{#if slot.file}
						<div
							class="slot-file"
							class:dragging={dragging?.file.id === slot.file.id}
							draggable="true"
							ondragstart={(e) => onDragStart(slot.file!, slot.name, e)}
							ondragend={onDragEnd}
							role="button"
							tabindex="0"
						>
							<span class="slot-file-name" title={slot.file.originalName}>
								{slot.file.originalName}
							</span>
							<button
								type="button"
								class="btn-icon"
								onclick={() => clearSlot(slot.name)}
								title="Retirer"
							>
								<X size={12} />
							</button>
						</div>
					{:else}
						<span class="slot-empty">Déposer ici</span>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		{#if analysisFiles.length > 0}
			<ul class="file-list">
				{#each analysisFiles as file, i (file.fileName + i)}
					<li class="file-item">
						<FileText size={14} />
						<span class="file-name" title={file.fileName}>{file.fileName}</span>
						<button
							type="button"
							class="btn-icon"
							onclick={() => {
								analysisFiles = analysisFiles.filter((_, j) => j !== i);
							}}
							title="Retirer"
						>
							<X size={14} />
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	{/if}

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

	.upload-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: 1px dashed var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
		color: var(--color-text-light);
		font-size: var(--text-sm);
		cursor: pointer;
		align-self: flex-start;
		transition:
			border-color var(--transition),
			color var(--transition);
	}

	.upload-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.hint-text {
		font-size: 0.7rem;
		opacity: 0.6;
	}

	/* Unmatched */
	.unmatched-section {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.section-hint {
		font-size: 0.72rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.chip-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.2rem 0.5rem;
		background: var(--color-primary-light, #e8f0fe);
		color: var(--color-primary);
		border: 1px solid var(--color-primary);
		border-radius: var(--radius);
		font-size: 0.72rem;
		cursor: grab;
		user-select: none;
	}

	.chip.dragging {
		opacity: 0.4;
	}

	.chip-name {
		max-width: 140px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Slots grid */
	.slots-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 0.4rem;
	}

	.slot {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.4rem 0.5rem;
		border: 1.5px dashed var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
		min-height: 56px;
		transition:
			border-color var(--transition),
			background var(--transition);
	}

	.slot.drag-over {
		border-color: var(--color-primary);
		background: var(--color-primary-light, #e8f0fe);
	}

	.slot.filled {
		border-style: solid;
		border-color: var(--color-surface);
	}

	.slot-label {
		font-size: 0.68rem;
		font-weight: 600;
		color: var(--color-text-light);
		font-family: monospace;
	}

	.slot-empty {
		font-size: 0.7rem;
		color: var(--color-text-light);
		opacity: 0.5;
		font-style: italic;
	}

	.slot-file {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		cursor: grab;
		user-select: none;
	}

	.slot-file.dragging {
		opacity: 0.4;
	}

	.slot-file-name {
		flex: 1;
		font-size: 0.72rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--color-text);
	}

	/* Legacy file list */
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
		flex-shrink: 0;
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

<script lang="ts">
	import Card from './Card.svelte';
	import IconButton from './IconButton.svelte';
	import { Pencil, Trash2, Check, X } from '@lucide/svelte';

	type Item = Record<string, unknown>;

	interface FieldConfig {
		key: string;
		label: string;
		type?: 'text' | 'number';
	}

	interface Props {
		title: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		api: { getAll: () => Promise<any[]>; create: (data: any) => Promise<any>; update: (id: number, data: any) => Promise<any>; delete: (id: number) => Promise<any> };
		idKey: string;
		fields: FieldConfig[];
	}

	let { title, api, idKey, fields }: Props = $props();

	let items = $state<Item[]>([]);
	let error = $state('');
	let editingId = $state<number | null>(null);
	let formValues = $state<Record<string, string | number>>({});
	let editValues = $state<Record<string, string | number>>({});

	function resetForm() {
		formValues = Object.fromEntries(fields.map((f) => [f.key, f.type === 'number' ? 0 : '']));
	}

	function isFormValid(): boolean {
		return fields.every((f) => {
			const v = formValues[f.key];
			return f.type === 'number' ? v !== '' && !isNaN(Number(v)) : String(v).trim() !== '';
		});
	}

	async function load() {
		if (!window.electronAPI) return;
		items = await api.getAll();
	}

	async function create() {
		if (!isFormValid()) return;
		error = '';
		try {
			const data = Object.fromEntries(
				fields.map((f) => [f.key, f.type === 'number' ? Number(formValues[f.key]) : String(formValues[f.key]).trim()])
			) as Item;
			await api.create(data);
			resetForm();
			await load();
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function startEdit(item: Item) {
		editingId = item[idKey] as number;
		editValues = Object.fromEntries(fields.map((f) => [f.key, item[f.key] as string | number]));
	}

	function cancelEdit() {
		editingId = null;
	}

	async function saveEdit() {
		if (editingId === null) return;
		error = '';
		try {
			const data = Object.fromEntries(
				fields.map((f) => [f.key, f.type === 'number' ? Number(editValues[f.key]) : String(editValues[f.key]).trim()])
			) as Item;
			await api.update(editingId, data);
			cancelEdit();
			await load();
		} catch (err) {
			error = (err as Error).message;
		}
	}

	async function remove(id: number) {
		error = '';
		try {
			await api.delete(id);
			await load();
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') create();
	}

	function handleEditKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') saveEdit();
		if (e.key === 'Escape') cancelEdit();
	}

	$effect(() => {
		resetForm();
		load();
	});
</script>

<h1>{title}</h1>

<div class="layout">
	<Card title="Ajouter">
		{#each fields as field (field.key)}
			<div class="field">
				<label for="create-{field.key}">{field.label}</label>
				{#if field.type === 'number'}
					<input
						id="create-{field.key}"
						type="number"
						step="any"
						bind:value={formValues[field.key]}
						onkeydown={handleKeydown}
					/>
				{:else}
					<input
						id="create-{field.key}"
						type="text"
						bind:value={formValues[field.key]}
						onkeydown={handleKeydown}
					/>
				{/if}
			</div>
		{/each}
		{#if error}
			<p class="error">{error}</p>
		{/if}
		<button class="btn-primary" onclick={create}>Ajouter</button>
	</Card>

	<Card title="Liste">
		{#if items.length === 0}
			<p class="empty">Aucun élément enregistré.</p>
		{:else}
			<ul>
				{#each items as item (item[idKey])}
					<li>
						{#if editingId === item[idKey]}
							<div class="edit-form">
								<div class="edit-fields">
									{#each fields as field (field.key)}
										{#if field.type === 'number'}
											<input
												type="number"
												step="any"
												bind:value={editValues[field.key]}
												onkeydown={handleEditKeydown}
											/>
										{:else}
											<input
												type="text"
												bind:value={editValues[field.key]}
												onkeydown={handleEditKeydown}
											/>
										{/if}
									{/each}
								</div>
								<div class="edit-actions">
									<IconButton onclick={saveEdit} variant="primary" label="Valider"><Check size={16} /></IconButton>
									<IconButton onclick={cancelEdit} label="Annuler"><X size={16} /></IconButton>
								</div>
							</div>
						{:else}
							<span class="item-label">
								{#each fields as field, i (field.key)}
									{#if i > 0}<span class="separator">·</span>{/if}
									{item[field.key]}
								{/each}
							</span>
							<div class="item-actions">
								<IconButton onclick={() => startEdit(item)} label="Modifier"><Pencil size={16} /></IconButton>
								<IconButton onclick={() => remove(item[idKey] as number)} variant="danger" label="Supprimer"><Trash2 size={16} /></IconButton>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</Card>
</div>

<style>
	h1 {
		margin-bottom: var(--space-md);
	}

	.layout {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		max-width: 600px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	label {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	input {
		padding: var(--space-sm) var(--space-md);
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
	}

	input:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
	}

	button {
		padding: var(--space-sm) var(--space-md);
		border: none;
		border-radius: var(--radius);
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
	}

	.btn-primary {
		background: var(--color-primary);
		color: #fff;
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

.error {
		padding: var(--space-sm) var(--space-md);
		background: #fde8ec;
		border-radius: var(--radius);
		color: var(--color-error);
		font-size: var(--text-sm);
	}

	.empty {
		color: var(--color-text-light);
		font-size: var(--text-sm);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius);
		transition: background var(--transition);
	}

	li:hover {
		background: var(--color-bg);
	}

	.item-label {
		font-weight: 500;
	}

	.separator {
		margin: 0 var(--space-sm);
		color: var(--color-text-light);
	}

	.item-actions {
		display: flex;
		gap: var(--space-sm);
	}

.edit-form {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
	}

	.edit-fields {
		display: flex;
		flex: 1;
		gap: var(--space-sm);
	}

	.edit-fields input {
		flex: 1;
		min-width: 0;
	}

	.edit-actions {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
	}
</style>

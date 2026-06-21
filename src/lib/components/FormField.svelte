<script lang="ts">
	interface SelectOption {
		value: string | number;
		label: string;
	}

	interface Props {
		id: string;
		label: string;
		type?: 'text' | 'number' | 'select';
		value?: string | number;
		placeholder?: string;
		step?: string;
		error?: string;
		options?: SelectOption[];
		onchange?: (value: string | number) => void;
	}

	let {
		id,
		label,
		type = 'text',
		value = $bindable(),
		placeholder,
		step,
		error,
		options = [],
		onchange
	}: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement | HTMLSelectElement;
		if (type === 'number') {
			value = target.value === '' ? undefined : Number(target.value);
		} else if (type === 'select') {
			const match = options.find((o) => String(o.value) === target.value);
			value = match ? match.value : target.value;
		} else {
			value = target.value;
		}
		onchange?.(value as string | number);
	}
</script>

<div class="field">
	<label for={id}>{label}</label>
	{#if type === 'select'}
		<select {id} value={value ?? ''} onchange={handleInput}>
			{#each options as opt (opt.value)}
				<option value={opt.value} disabled={opt.value === 0 || opt.value === ''}>{opt.label}</option
				>
			{/each}
		</select>
	{:else if type === 'number'}
		<input {id} type="number" {step} {placeholder} value={value ?? ''} oninput={handleInput} />
	{:else}
		<input {id} type="text" {placeholder} value={value ?? ''} oninput={handleInput} />
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

	input,
	select {
		padding: var(--space-sm);
		border: 1px solid var(--color-surface);
		border-radius: var(--radius);
		background: #fff;
	}

	input:focus,
	select:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
	}

	.error {
		color: var(--color-error);
		font-size: 0.75rem;
	}
</style>

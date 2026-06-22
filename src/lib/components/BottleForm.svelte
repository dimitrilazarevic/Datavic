<script lang="ts">
	import { bottleInsertSchema, bottleUpdateSchema } from '../../../shared/schemas/bottle';
	import { BOTTLE_ANALYSIS_FILENAMES, BOTTLE_STATUS } from '../../../shared/enums';
	import FormField from './FormField.svelte';
	import ImageInput from './ImageInput.svelte';
	import type {
		Bottle,
		BottleType,
		Brand,
		MaterialSummary,
		Overbrand,
		Zone
	} from '../../../electron/lib/types';
	import { onMount } from 'svelte';
	import { createMaterialFileName } from '$shared/utils/create_filename';
	import MultiFileInput from './MultiFileInput.svelte';
	import type { FileEntry } from './MultiFileInput.svelte';

	interface Props {
		bottle?: Bottle;
		onsave?: () => void;
	}

	let { bottle, onsave }: Props = $props();

	let isEdit = $derived(!!bottle);

	let bottleTypes = $state<BottleType[]>([]);
	let brands = $state<Brand[]>([]);
	let overbrands = $state<Overbrand[]>([]);
	let zones = $state<Zone[]>([]);
	let materials = $state<MaterialSummary[]>([]);

	onMount(async () => {
		const api = window.electronAPI;
		if (!api) return;
		[bottleTypes, brands, overbrands, zones, materials] = await Promise.all([
			api.db.bottleType.getAll(),
			api.db.brand.getAll(),
			api.db.overbrand.getAll(),
			api.db.zone.getAll(),
			api.db.material.getAll()
		]);
	});

	function initForm(b: Bottle | undefined = undefined) {
		return {
			bottleTypeId: b?.bottleTypeId ?? 0,
			brandId: b?.brandId ?? 0,
			overbrandId: b?.overbrandId ?? 0,
			zoneId: b?.zoneId ?? 0,
			materialId: b?.materialId ?? 0,
			claimMl: b?.claimMl ?? (undefined as number | undefined),
			overflowCapacityMl: b?.overflowCapacityMl ?? (undefined as number | undefined),
			surfaceCm2: b?.surfaceCm2 ?? (undefined as number | undefined),
			thicknessMm: b?.thicknessMm ?? (undefined as number | undefined),
			version: b?.version ?? '',
			pdmNumber: b?.pdmNumber ?? (undefined as number | undefined),
			status: b?.status ?? (undefined as string | undefined),
			massG: b?.massG ?? '',
			massLossExp: b?.massLossExp ?? (undefined as number | undefined)
		};
	}

	let form = $state(initForm());
	let imageData = $state<Uint8Array | undefined>();
	let imageExtension = $state<string | undefined>();
	let analysisFiles = $state<FileEntry[]>([]);
	let errors = $state<Record<string, string>>({});
	let submitError = $state('');

	$effect(() => {
		form = initForm(bottle);
		errors = {};
		submitError = '';
	});

	function cleanData() {
		const data: Record<string, unknown> = { ...form };
		if (!data.status) delete data.status;
		if (data.massLossExp == null) delete data.massLossExp;
		if (imageData && imageExtension) {
			data.rawImageContent = imageData;
			data.imageExtension = imageExtension;
		}
		if (analysisFiles) {
			data.analysisFiles = analysisFiles;
		}
		return data;
	}

	function applyErrors(zodError: { issues: { path: PropertyKey[]; message: string }[] }) {
		for (const issue of zodError.issues) {
			const key = issue.path[0];
			if (key != null) errors[String(key)] = issue.message;
		}
	}

	async function handleSubmit() {
		errors = {};
		submitError = '';
		const data = cleanData();
		console.log(data);

		try {
			if (isEdit) {
				const result = bottleUpdateSchema.safeParse({ ...data, bottleId: bottle!.bottleId });
				if (!result.success) {
					applyErrors(result.error);
					return;
				}
				const { bottleId, ...updateData } = result.data;
				await window.electronAPI!.db.bottle.update(bottleId, updateData);
			} else {
				const result = await bottleInsertSchema.safeParseAsync(data);
				console.log(result);

				if (!result.success) {
					applyErrors(result.error);
					return;
				}

				await window.electronAPI!.db.bottle.create(result.data);

				form = initForm();
				imageData = undefined;
				imageExtension = undefined;
			}
			onsave?.();
		} catch (err) {
			submitError = (err as Error).message;
		}
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault();
		handleSubmit();
	}}
>
	<section>
		<h3>Références</h3>
		<div class="fields-grid">
			<FormField
				id="bottleTypeId"
				label="Type de flacon"
				type="select"
				bind:value={form.bottleTypeId}
				error={errors.bottleTypeId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...bottleTypes.map((bt) => ({ value: bt.bottleTypeId, label: bt.bottleTypeName }))
				]}
			/>
			<FormField
				id="brandId"
				label="Marque"
				type="select"
				bind:value={form.brandId}
				error={errors.brandId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...brands.map((b) => ({ value: b.brandId, label: b.brandName }))
				]}
			/>
			<FormField
				id="overbrandId"
				label="Marque mère"
				type="select"
				bind:value={form.overbrandId}
				error={errors.overbrandId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...overbrands.map((ob) => ({ value: ob.overBrandId, label: ob.overbrandName }))
				]}
			/>
			<FormField
				id="zoneId"
				label="Zone"
				type="select"
				bind:value={form.zoneId}
				error={errors.zoneId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...zones.map((z) => ({ value: z.zoneId, label: z.zoneName }))
				]}
			/>
			<FormField
				id="materialId"
				label="Matériau"
				type="select"
				bind:value={form.materialId}
				error={errors.materialId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...materials.map((m) => ({
						value: m.materialId,
						label: m.folderName ?? `${createMaterialFileName(m)}`
					}))
				]}
			/>
		</div>
	</section>

	<section>
		<h3>Identification</h3>
		<div class="fields-grid">
			<FormField
				id="version"
				label="Version"
				placeholder="V00S00"
				bind:value={form.version}
				error={errors.version}
			/>
			<FormField
				id="pdmNumber"
				label="N° PDM"
				type="number"
				bind:value={form.pdmNumber}
				error={errors.pdmNumber}
			/>
			<FormField
				id="status"
				label="Statut"
				type="select"
				bind:value={form.status}
				options={[{ value: '', label: '—' }, ...BOTTLE_STATUS.map((s) => ({ value: s, label: s }))]}
			/>
		</div>
	</section>

	<section>
		<h3>Dimensions</h3>
		<div class="fields-grid">
			<FormField
				id="claimMl"
				label="Contenance (mL)"
				type="number"
				step="any"
				bind:value={form.claimMl}
				error={errors.claimMl}
			/>
			<FormField
				id="overflowCapacityMl"
				label="Cap. débordement (mL)"
				type="number"
				step="any"
				bind:value={form.overflowCapacityMl}
				error={errors.overflowCapacityMl}
			/>
			<FormField
				id="surfaceCm2"
				label="Surface (cm²)"
				type="number"
				step="any"
				bind:value={form.surfaceCm2}
				error={errors.surfaceCm2}
			/>
			<FormField
				id="thicknessMm"
				label="Épaisseur (mm)"
				type="number"
				step="any"
				bind:value={form.thicknessMm}
				error={errors.thicknessMm}
			/>
		</div>
	</section>

	<section>
		<h3>Masse</h3>
		<div class="fields-grid">
			<FormField
				id="massG"
				label="Masse"
				placeholder="20g5"
				bind:value={form.massG}
				error={errors.massG}
			/>
			<FormField
				id="massLossExp"
				label="Perte exp."
				type="number"
				step="any"
				bind:value={form.massLossExp}
				error={errors.massLossExp}
			/>
		</div>
	</section>

	<section>
		<h3>Image</h3>
		<ImageInput id="bottleImage" bind:imageData bind:imageExtension error={errors.imageExtension} />
	</section>

	{#if !isEdit}
		<section>
			<h3>Analyses</h3>
			<MultiFileInput
				id="analysisInput"
				acceptedFilenames={BOTTLE_ANALYSIS_FILENAMES}
				bind:analysisFiles
				error={errors.analysisFiles}
			/>
		</section>
	{/if}

	{#if submitError}
		<p class="submit-error">{submitError}</p>
	{/if}

	<button type="submit" class="btn-primary">{isEdit ? 'Modifier' : 'Créer le flacon'}</button>
</form>

<style>
	section {
		margin-bottom: var(--space-md);
	}

	section h3 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-sm);
	}

	.fields-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: var(--space-sm);
	}

	.submit-error {
		padding: var(--space-sm) var(--space-md);
		background: #fde8ec;
		border-radius: var(--radius);
		color: var(--color-error);
		font-size: var(--text-sm);
	}

	.btn-primary {
		padding: var(--space-sm) var(--space-md);
		border: none;
		border-radius: var(--radius);
		background: var(--color-primary);
		color: #fff;
		font-weight: 600;
		cursor: pointer;
	}

	.btn-primary:hover {
		opacity: 0.9;
	}
</style>

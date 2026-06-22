<script lang="ts">
	import { materialInsertSchema, materialUpdateSchema } from '../../../shared/schemas/material';
	import { MATERIAL_ANALYSIS_FILENAMES } from '../../../shared/enums';
	import { propertiesSchema } from '../../../shared/schemas/propertiesFile';
	import FormField from './FormField.svelte';
	import ImageInput from './ImageInput.svelte';
	import MultiFileInput from './MultiFileInput.svelte';
	import type { FileEntry } from './MultiFileInput.svelte';
	import type { Material, MaterialFamily, Supplier } from '../../../electron/lib/types';
	import { FileText, X } from '@lucide/svelte';
	import IconButton from './IconButton.svelte';
	import { onMount } from 'svelte';

	interface Props {
		material?: Material;
		onsave?: () => void;
	}

	let { material, onsave }: Props = $props();

	let isEdit = $derived(!!material);

	let materialFamilies = $state<MaterialFamily[]>([]);
	let suppliers = $state<Supplier[]>([]);

	onMount(async () => {
		const api = window.electronAPI;
		if (!api) return;
		[materialFamilies, suppliers] = await Promise.all([
			api.db.materialFamily.getAll(),
			api.db.supplier.getAll()
		]);
	});

	function initForm(m?: Material) {
		return {
			materialFamilyId: m?.materialFamilyId ?? 0,
			supplierId1: m?.supplierId1 ?? 0,
			supplierId2: m?.supplierId2 ?? (undefined as number | undefined),
			ref1: m?.ref1 ?? '',
			pct1: m?.pct1 ?? 100,
			ref2: m?.ref2 ?? '',
			pct2: m?.pct2 ?? (undefined as number | undefined),
			temperatureC: m?.temperatureC ?? (undefined as number | undefined),
			productionYear: m?.productionYear ?? (undefined as number | undefined),
			avgElasticModulus: m?.avgElasticModulus ?? (undefined as number | undefined),
			avgElasticLimit: m?.avgElasticLimit ?? (undefined as number | undefined),
			longiAvgElasticModulus: m?.longiAvgElasticModulus ?? (undefined as number | undefined),
			longiAvgElasticLimit: m?.longiAvgElasticLimit ?? (undefined as number | undefined),
			radAvgElasticModulus: m?.radAvgElasticModulus ?? (undefined as number | undefined),
			radAvgElasticLimit: m?.radAvgElasticLimit ?? (undefined as number | undefined),
			syneAbaqusElasticModulus: m?.syneAbaqusElasticModulus ?? (undefined as number | undefined),
			syneAbaqusElasticLimit: m?.syneAbaqusElasticLimit ?? (undefined as number | undefined)
		};
	}

	let form = $state(initForm());
	let imageData = $state<Uint8Array | undefined>();
	let imageExtension = $state<string | undefined>();
	let analysisFiles = $state<FileEntry[]>([]);
	let propertiesFileName = $state('');
	let propertiesError = $state('');
	let errors = $state<Record<string, string>>({});
	let submitError = $state('');

	async function handlePropertiesFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		propertiesError = '';
		propertiesFileName = '';

		try {
			const content = await file.text();
			const parsed = JSON.parse(content);
			const result = propertiesSchema.safeParse(parsed);

			if (!result.success) {
				propertiesError =
					'Structure du fichier invalide : toutes les proprietes ne sont pas renseignees';
				input.value = '';
				return;
			}

			const p = result.data.properties;
			form.avgElasticModulus = p.avg_elastic_modulus.nom;
			form.avgElasticLimit = p.avg_elastic_limit.nom;
			form.longiAvgElasticModulus = p.LONGI_avg_elastic_modulus.nom;
			form.longiAvgElasticLimit = p.LONGI_avg_elastic_limit.nom;
			form.radAvgElasticModulus = p.RAD_avg_elastic_modulus.nom;
			form.radAvgElasticLimit = p.RAD_avg_elastic_limit.nom;
			form.syneAbaqusElasticModulus = p.syne_abaqus_elastic_modulus.nom;
			form.syneAbaqusElasticLimit = p.syne_abaqus_elastic_limit.nom;
			propertiesFileName = file.name;
		} catch {
			propertiesError = 'Fichier JSON invalide';
		}

		input.value = '';
	}

	function clearProperties() {
		propertiesFileName = '';
		form.avgElasticModulus = undefined;
		form.avgElasticLimit = undefined;
		form.longiAvgElasticModulus = undefined;
		form.longiAvgElasticLimit = undefined;
		form.radAvgElasticModulus = undefined;
		form.radAvgElasticLimit = undefined;
		form.syneAbaqusElasticModulus = undefined;
		form.syneAbaqusElasticLimit = undefined;
	}

	$effect(() => {
		form = initForm(material);
		errors = {};
		submitError = '';
	});

	let hasSupplier2 = $derived(form.supplierId2 != null && form.supplierId2 > 0);

	function cleanData() {
		const data: Record<string, unknown> = { ...form };
		if (!hasSupplier2) {
			delete data.supplierId2;
			delete data.ref2;
			delete data.pct2;
			data.pct1 = 100;
		}
		if (data.productionYear == null) delete data.productionYear;
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

		try {
			if (isEdit) {
				const result = materialUpdateSchema.safeParse({
					...data,
					materialId: material!.materialId
				});
				if (!result.success) {
					applyErrors(result.error);
					return;
				}
				const { materialId, ...updateData } = result.data;
				await window.electronAPI!.db.material.update(materialId, updateData);
			} else {
				const result = materialInsertSchema.safeParse(data);
				if (!result.success) {
					applyErrors(result.error);
					return;
				}
				await window.electronAPI!.db.material.create(result.data);
				form = initForm();
				imageData = undefined;
				imageExtension = undefined;
			}
			onsave?.();
		} catch (err) {
			submitError = (err as Error).message;
		}
	}

	const supplierOptions = $derived([
		{ value: 0, label: 'Choisir…' },
		...suppliers.map((s) => ({ value: s.supplierId, label: s.supplierName }))
	]);
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
				id="materialFamilyId"
				label="Famille de matériaux"
				type="select"
				bind:value={form.materialFamilyId}
				error={errors.materialFamilyId}
				options={[
					{ value: 0, label: 'Choisir…' },
					...materialFamilies.map((mf) => ({
						value: mf.materialFamilyId,
						label: mf.materialFamilyName
					}))
				]}
			/>
			<FormField
				id="temperatureC"
				label="Température (°C)"
				type="number"
				bind:value={form.temperatureC}
				error={errors.temperatureC}
			/>
			<FormField
				id="productionYear"
				label="Année de production"
				type="number"
				bind:value={form.productionYear}
				error={errors.productionYear}
			/>
		</div>
	</section>

	<section>
		<h3>Fournisseur principal</h3>
		<div class="fields-grid">
			<FormField
				id="supplierId1"
				label="Fournisseur"
				type="select"
				bind:value={form.supplierId1}
				error={errors.supplierId1}
				options={supplierOptions}
			/>
			<FormField id="ref1" label="Référence" bind:value={form.ref1} error={errors.ref1} />
			{#if hasSupplier2}
				<FormField
					id="pct1"
					label="Pourcentage (%)"
					type="number"
					bind:value={form.pct1}
					error={errors.pct1}
				/>
			{/if}
		</div>
	</section>

	<section>
		<h3>Second fournisseur (optionnel)</h3>
		<div class="fields-grid">
			<FormField
				id="supplierId2"
				label="Fournisseur"
				type="select"
				bind:value={form.supplierId2}
				error={errors.supplierId2}
				options={[
					{ value: 0, label: 'Aucun' },
					...suppliers.map((s) => ({ value: s.supplierId, label: s.supplierName }))
				]}
			/>
			{#if hasSupplier2}
				<FormField id="ref2" label="Référence" bind:value={form.ref2} error={errors.ref2} />
				<FormField
					id="pct2"
					label="Pourcentage (%)"
					type="number"
					bind:value={form.pct2}
					error={errors.pct2}
				/>
			{/if}
		</div>
	</section>

	<section>
		<h3>Proprietes mecaniques</h3>
		<p class="accepted-files">
			Importer un fichier <code>.json</code> ou <code>.txt</code> contenant les proprietes
		</p>
		<div class="properties-input">
			{#if propertiesFileName}
				<span class="file-badge">
					<FileText size={14} />
					{propertiesFileName}
					<IconButton onclick={clearProperties} variant="danger" label="Retirer">
						<X size={14} />
					</IconButton>
				</span>
			{:else}
				<label class="file-label">
					<FileText size={16} />
					Choisir un fichier
					<input type="file" accept=".json,.txt" onchange={handlePropertiesFile} hidden />
				</label>
			{/if}
		</div>
		{#if propertiesError}
			<p class="field-error">{propertiesError}</p>
		{/if}
		{#if form.avgElasticModulus != null}
			<div class="fields-grid">
				<FormField
					id="avgElasticModulus"
					label="E ref"
					type="number"
					step="any"
					bind:value={form.avgElasticModulus}
				/>
				<FormField
					id="avgElasticLimit"
					label="σe ref"
					type="number"
					step="any"
					bind:value={form.avgElasticLimit}
				/>
				<FormField
					id="longiAvgElasticModulus"
					label="E longi"
					type="number"
					step="any"
					bind:value={form.longiAvgElasticModulus}
				/>
				<FormField
					id="longiAvgElasticLimit"
					label="σe longi"
					type="number"
					step="any"
					bind:value={form.longiAvgElasticLimit}
				/>
				<FormField
					id="radAvgElasticModulus"
					label="E rad"
					type="number"
					step="any"
					bind:value={form.radAvgElasticModulus}
				/>
				<FormField
					id="radAvgElasticLimit"
					label="σe rad"
					type="number"
					step="any"
					bind:value={form.radAvgElasticLimit}
				/>
				<FormField
					id="syneAbaqusElasticModulus"
					label="E sim"
					type="number"
					step="any"
					bind:value={form.syneAbaqusElasticModulus}
				/>
				<FormField
					id="syneAbaqusElasticLimit"
					label="σe sim"
					type="number"
					step="any"
					bind:value={form.syneAbaqusElasticLimit}
				/>
			</div>
		{/if}
	</section>

	<section>
		<h3>Image</h3>
		<ImageInput
			id="materialImage"
			bind:imageData
			bind:imageExtension
			error={errors.imageExtension}
		/>
	</section>

	{#if !isEdit}
		<section>
			<h3>Analyses</h3>
			<MultiFileInput
				id="analysisInput"
				acceptedFilenames={MATERIAL_ANALYSIS_FILENAMES}
				bind:analysisFiles
				error={errors.analysisFiles}
			/>
		</section>
	{/if}

	{#if submitError}
		<p class="submit-error">{submitError}</p>
	{/if}

	<button type="submit" class="btn-primary">{isEdit ? 'Modifier' : 'Créer le matériau'}</button>
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

	.accepted-files {
		font-size: var(--text-sm);
		color: var(--color-text-light);
		margin: 0 0 var(--space-sm) 0;
	}

	.properties-input {
		margin-bottom: var(--space-sm);
	}

	.file-label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		border: 1px dashed var(--color-surface);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-text-light);
		cursor: pointer;
		transition: border-color var(--transition);
	}

	.file-label:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.file-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 0.25rem var(--space-sm);
		background: var(--color-primary-light);
		color: var(--color-primary);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.field-error {
		color: var(--color-error);
		font-size: var(--text-sm);
		margin: var(--space-sm) 0 0;
	}

	.accepted-files code {
		font-size: 0.75rem;
		background: var(--color-surface);
		padding: 0.1rem 0.3rem;
		border-radius: var(--radius);
	}
</style>

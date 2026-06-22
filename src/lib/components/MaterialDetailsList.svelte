<script lang="ts">
	import type { MaterialWithAnalysis } from '../../../electron/lib/types';
	import { renderDateTime } from '$lib/utils/renderDateTime';
	import TechnicalDetailsList from './TechnicalDetailsList.svelte';
	import type { TechnicalDetail } from './technicalDetails.types';

	let { material }: { material: MaterialWithAnalysis | null | undefined } = $props();

	const r = (v: number | null | undefined) => (v != null ? Math.round(v * 100) / 100 : null);

	const details: TechnicalDetail<MaterialWithAnalysis>[] = [
		{ label: 'Famille de matériau', accessor: (m) => m.materialFamilyName },
		{ label: 'Fournisseur 1', accessor: (m) => m.supplierName1 },
		{ label: 'Référence 1', accessor: (m) => m.ref1 },
		{ label: '% Fournisseur 1', accessor: (m) => m.pct1 },
		{ label: 'Fournisseur 2', accessor: (m) => m.supplierName2 },
		{ label: 'Référence 2', accessor: (m) => m.ref2 },
		{ label: '% Fournisseur 2', accessor: (m) => m.pct2 },
		{ label: 'Température (°C)', accessor: (m) => m.temperatureC },
		{ label: 'Année de production', accessor: (m) => m.productionYear },
		{ label: 'Module élastique moyen (MPa)', accessor: (m) => r(m.avgElasticModulus) },
		{ label: 'Limite élastique moyenne (MPa)', accessor: (m) => r(m.avgElasticLimit) },
		{ label: 'Module élastique longitudinal (MPa)', accessor: (m) => r(m.longiAvgElasticModulus) },
		{ label: 'Limite élastique longitudinale (MPa)', accessor: (m) => r(m.longiAvgElasticLimit) },
		{ label: 'Module élastique radial (MPa)', accessor: (m) => r(m.radAvgElasticModulus) },
		{ label: 'Limite élastique radiale (MPa)', accessor: (m) => r(m.radAvgElasticLimit) },
		{ label: 'Module élastique Abaqus (MPa)', accessor: (m) => r(m.syneAbaqusElasticModulus) },
		{ label: 'Limite élastique Abaqus (MPa)', accessor: (m) => r(m.syneAbaqusElasticLimit) },
		{ label: 'Dernière modification', accessor: (m) => renderDateTime(m.lastModified) }
	];
</script>

<TechnicalDetailsList item={material} detailsToDisplay={details} />

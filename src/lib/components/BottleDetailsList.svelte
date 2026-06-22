<script lang="ts">
	import type { BottleWithAnalysis } from '../../../electron/lib/types';
	import { renderDateTime } from '$lib/utils/renderDateTime';
	import TechnicalDetailsList from './TechnicalDetailsList.svelte';
	import type { TechnicalDetail } from './technicalDetails.types';

	let { bottle }: { bottle: BottleWithAnalysis | null | undefined } = $props();

	const details: TechnicalDetail<BottleWithAnalysis>[] = [
		{ label: 'Marque mère', accessor: (b) => b.overbrandName },
		{ label: 'Marque', accessor: (b) => b.brandName },
		{ label: 'Zone', accessor: (b) => b.zoneName },
		{ label: 'Type de flacon', accessor: (b) => b.bottleTypeName },
		{ label: 'Claim (mL)', accessor: (b) => b.claimMl },
		{ label: 'N° PDM', accessor: (b) => b.pdmNumber },
		{ label: 'Famille de matériau', accessor: (b) => b.materialFamilyName },
		{ label: 'Matériau', accessor: (b) => b.materialFolderName },
		{ label: 'Masse (g)', accessor: (b) => b.massG },
		{ label: 'Épaisseur moyenne (mm)', accessor: (b) => b.thicknessMm },
		{ label: 'Perte de masse expérimentale (mg)', accessor: (b) => b.massLossExp },
		{ label: 'Perte de masse numérique (mg)', accessor: (b) => b.massLossNum?.toFixed(2) },
		{ label: 'Version', accessor: (b) => b.version },
		{ label: 'Statut', accessor: (b) => b.status },
		{ label: 'Surface (cm²)', accessor: (b) => b.surfaceCm2 },
		{ label: 'Cap. débordement (mL)', accessor: (b) => b.overflowCapacityMl },
		{ label: 'Dernière modification', accessor: (b) => renderDateTime(b.lastModified) }
	];
</script>

<TechnicalDetailsList item={bottle} detailsToDisplay={details} />

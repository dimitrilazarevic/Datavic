import type { BottleSummary, MaterialSummary } from '../../electron/lib/types';

export function createBottleFileName(b: BottleSummary) {
	return `${b.overbrandName}_${b.brandName}_${b.overflowCapacityMl}Ml_${b.version}_${b.massG}_${b.materialFamilyName}_${b.bottleId}`;
}

export function createMaterialFileName(m: MaterialSummary) {
	return `${m.materialFamilyName}_${m.supplierName1}${m.pct1}p${m.supplierId2 ? `${m.supplierName2}${m.pct2}` : ``}_${m.materialId}`;
}

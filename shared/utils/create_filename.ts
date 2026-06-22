type BottleFileNameFields = {
	overbrandName: string;
	brandName: string;
	overflowCapacityMl: number | null | undefined;
	version: string | null | undefined;
	massG: string | null | undefined;
	materialFamilyName: string;
	bottleId: number;
};

type MaterialFileNameFields = {
	materialFamilyName: string;
	supplierName1: string;
	pct1: number | null | undefined;
	supplierId2: number | null | undefined;
	supplierName2: string | null | undefined;
	pct2: number | null | undefined;
	materialId: number;
};

export function createBottleFileName(b: BottleFileNameFields) {
	return `${b.overbrandName}_${b.brandName}_${b.overflowCapacityMl}Ml_${b.version}_${b.massG}_${b.materialFamilyName}_${b.bottleId}`;
}

export function createMaterialFileName(m: MaterialFileNameFields) {
	return `${m.materialFamilyName}_${m.supplierName1}${m.pct1}p${m.supplierId2 ? `${m.supplierName2}${m.pct2}` : ``}_${m.materialId}`;
}

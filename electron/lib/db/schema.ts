import { sqliteTable, text, integer, real, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// --- Enum types (validated at TypeScript level, stored as text in SQLite) ---

export const BOTTLE_STATUS = ['DES', 'PIL', 'MOD'] as const;
export type BottleStatus = (typeof BOTTLE_STATUS)[number];

export const BOTTLE_ANALYSIS_TEST_TYPE = ['squeeze', 'sideload_io', 'sideload_ioi', 'topload'] as const;
export type BottleAnalysisTestType = (typeof BOTTLE_ANALYSIS_TEST_TYPE)[number];

export const BOTTLE_ANALYSIS_THICKNESS_TYPE = ['exp', 'lin', 'tom'] as const;
export type BottleAnalysisThicknessType = (typeof BOTTLE_ANALYSIS_THICKNESS_TYPE)[number];

export const MATERIAL_ANALYSIS_TEST_TYPE = ['ss', 'fd'] as const;
export type MaterialAnalysisTestType = (typeof MATERIAL_ANALYSIS_TEST_TYPE)[number];

export const MATERIAL_ANALYSIS_TEST_DIRECTION = ['avg', 'rad', 'long'] as const;
export type MaterialAnalysisTestDirection = (typeof MATERIAL_ANALYSIS_TEST_DIRECTION)[number];

// --- Lookup tables ---

export const bottleType = sqliteTable('bottle_type', {
	bottleTypeId: integer('bottle_type_id').primaryKey({ autoIncrement: true }),
	bottleTypeName: text('bottle_type_name', { length: 100 }).notNull().unique(),
	bottleTypeConstant: real('bottle_type_constant').notNull()
});

export const brand = sqliteTable('brand', {
	brandId: integer('brand_id').primaryKey({ autoIncrement: true }),
	brandName: text('brand_name', { length: 100 }).notNull().unique()
});

export const overbrand = sqliteTable('overbrand', {
	overBrandId: integer('overbrand_id').primaryKey({ autoIncrement: true }),
	overbrandName: text('overbrand_name', { length: 100 }).notNull().unique()
});

export const zone = sqliteTable('zone', {
	zoneId: integer('zone_id').primaryKey({ autoIncrement: true }),
	zoneName: text('zone_name', { length: 100 }).notNull().unique()
});

export const materialFamily = sqliteTable('material_family', {
	materialFamilyId: integer('material_family_id').primaryKey({ autoIncrement: true }),
	materialFamilyName: text('material_family_name', { length: 100 }).notNull().unique()
});

export const supplier = sqliteTable('supplier', {
	supplierId: integer('supplier_id').primaryKey({ autoIncrement: true }),
	supplierName: text('supplier_name', { length: 100 }).notNull().unique()
});

// --- Main tables ---

export const bottle = sqliteTable(
	'bottle',
	{
		bottleId: integer('bottle_id').primaryKey({ autoIncrement: true }),
		folderName: text('folder_name', { length: 255 }).unique(),
		imagePath: text('image_path'),
		claimMl: real('claim_ml'),
		massG: text('mass_g', { length: 20 }),
		version: text('version'),
		status: text('status', { enum: BOTTLE_STATUS }),
		pdmNumber: integer('pdm_number'),
		overflowCapacityMl: real('overflow_capacity_ml'),
		surfaceCm2: real('surface_cm2'),
		thicknessMm: real('thickness_mm'),
		massLossExp: real('mass_loss_exp'),
		massLossNum: real('mass_loss_num'),
		createdAt: text('created_at'),
		lastModified: text('last_modified'),
		bottleTypeId: integer('bottle_type_id').notNull().references(() => bottleType.bottleTypeId),
		brandId: integer('brand_id').notNull().references(() => brand.brandId),
		materialId: integer('material_id').notNull().references(() => material.materialId),
		overbrandId: integer('overbrand_id').notNull().references(() => overbrand.overBrandId),
		zoneId: integer('zone_id').notNull().references(() => zone.zoneId)
	}
);

export const material = sqliteTable(
	'material',
	{
		materialId: integer('material_id').primaryKey({ autoIncrement: true }),
		folderName: text('folder_name', { length: 255 }).unique(),
		imagePath: text('image_path'),
		temperatureC: integer('temperature_c').notNull(),
		productionYear: integer('production_year'),
		avgElasticModulus: real('avg_elastic_modulus'),
		avgElasticLimit: real('avg_elastic_limit'),
		longiAvgElasticModulus: real('longi_avg_elastic_modulus'),
		longiAvgElasticLimit: real('longi_avg_elastic_limit'),
		radAvgElasticModulus: real('rad_avg_elastic_modulus'),
		radAvgElasticLimit: real('rad_avg_elastic_limit'),
		syneAbaqusElasticModulus: real('syne_abaqus_elastic_modulus'),
		syneAbaqusElasticLimit: real('syne_abaqus_elastic_limit'),
		createdAt: text('created_at'),
		lastModified: text('last_modified'),
		ref1: text('ref1', { length: 100 }),
		pct1: integer('pct1').default(100),
		ref2: text('ref2', { length: 100 }),
		pct2: integer('pct2'),
		materialFamilyId: integer('material_family_id').notNull().references(() => materialFamily.materialFamilyId),
		supplierId1: integer('supplier_id_1').notNull().references(() => supplier.supplierId),
		supplierId2: integer('supplier_id_2').references(() => supplier.supplierId)
	},
	(table) => [
		check('pct_sum_100', sql`(COALESCE(${table.pct1}, 0) + COALESCE(${table.pct2}, 0)) = 100`)
	]
);

export const bottleAnalysis = sqliteTable(
	'bottle_analysis',
	{
		bottleAnalysisId: integer('bottle_analysis_id').primaryKey({ autoIncrement: true }),
		testType: text('test_type', { enum: BOTTLE_ANALYSIS_TEST_TYPE }).notNull(),
		thicknessType: text('thickness_type', { enum: BOTTLE_ANALYSIS_THICKNESS_TYPE }).notNull(),
		bottleAnalysisKey: text('bottle_analysis_key', { length: 40 }),
		fileName: text('file_name', { length: 255 }),
		xCoordinates: text('x_coordinates', { mode: 'json' }).notNull().$type<number[]>(),
		yCoordinates: text('y_coordinates', { mode: 'json' }).notNull().$type<number[]>(),
		bottleId: integer('bottle_id').notNull().references(() => bottle.bottleId, { onDelete: 'cascade' }),
		fileContentText: text('file_content_text').notNull()
	}
);

export const materialAnalysis = sqliteTable(
	'material_analysis',
	{
		materialAnalysisId: integer('material_analysis_id').primaryKey({ autoIncrement: true }),
		testType: text('test_type', { enum: MATERIAL_ANALYSIS_TEST_TYPE }).notNull(),
		testDirection: text('test_direction', { enum: MATERIAL_ANALYSIS_TEST_DIRECTION }).notNull(),
		materialAnalysisKey: text('material_analysis_key', { length: 40 }),
		fileName: text('file_name', { length: 255 }),
		xCoordinates: text('x_coordinates', { mode: 'json' }).notNull().$type<number[]>(),
		yCoordinates: text('y_coordinates', { mode: 'json' }).notNull().$type<number[]>(),
		materialId: integer('material_id').notNull().references(() => material.materialId, { onDelete: 'cascade' }),
		fileContentText: text('file_content_text').notNull()
	}
);

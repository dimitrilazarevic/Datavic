import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
	bottleType,
	brand,
	overbrand,
	zone,
	materialFamily,
	supplier,
	bottle,
	material,
	bottleAnalysis,
	materialAnalysis
} from '../db/schema';

export type BottleType = InferSelectModel<typeof bottleType>;
export type BottleTypeInsert = InferInsertModel<typeof bottleType>;

export type Brand = InferSelectModel<typeof brand>;
export type BrandInsert = InferInsertModel<typeof brand>;

export type Overbrand = InferSelectModel<typeof overbrand>;
export type OverbrandInsert = InferInsertModel<typeof overbrand>;

export type Zone = InferSelectModel<typeof zone>;
export type ZoneInsert = InferInsertModel<typeof zone>;

export type MaterialFamily = InferSelectModel<typeof materialFamily>;
export type MaterialFamilyInsert = InferInsertModel<typeof materialFamily>;

export type Supplier = InferSelectModel<typeof supplier>;
export type SupplierInsert = InferInsertModel<typeof supplier>;

export type Bottle = InferSelectModel<typeof bottle>;
export type BottleInsert = InferInsertModel<typeof bottle>;

export type Material = InferSelectModel<typeof material>;
export type MaterialInsert = InferInsertModel<typeof material>;

export type BottleAnalysis = InferSelectModel<typeof bottleAnalysis>;
export type BottleAnalysisInsert = InferInsertModel<typeof bottleAnalysis>;

export type MaterialAnalysis = InferSelectModel<typeof materialAnalysis>;
export type MaterialAnalysisInsert = InferInsertModel<typeof materialAnalysis>;

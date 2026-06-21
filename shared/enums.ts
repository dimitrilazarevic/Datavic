export const BOTTLE_STATUS = ['DES', 'PIL', 'MOD'] as const;
export type BottleStatus = (typeof BOTTLE_STATUS)[number];

export const BOTTLE_ANALYSIS_TEST_TYPE = [
	'squeeze',
	'sideload_io',
	'sideload_ioi',
	'topload'
] as const;
export type BottleAnalysisTestType = (typeof BOTTLE_ANALYSIS_TEST_TYPE)[number];

export const BOTTLE_ANALYSIS_THICKNESS_TYPE = ['exp', 'lin', 'tom'] as const;

export type BottleAnalysisThicknessType = (typeof BOTTLE_ANALYSIS_THICKNESS_TYPE)[number];

export const BOTTLE_ANALYSIS_KEYS = BOTTLE_ANALYSIS_TEST_TYPE.flatMap((t) =>
	BOTTLE_ANALYSIS_THICKNESS_TYPE.map((b) => `${t}_${b}` as const)
);
export type BottleAnalysisKey = (typeof BOTTLE_ANALYSIS_KEYS)[number];

export const BOTTLE_ANALYSIS_FILENAMES = BOTTLE_ANALYSIS_KEYS.map((k) => `${k}.txt`);

export const MATERIAL_ANALYSIS_TEST_TYPE = ['ss', 'fd'] as const;
export type MaterialAnalysisTestType = (typeof MATERIAL_ANALYSIS_TEST_TYPE)[number];

export const MATERIAL_ANALYSIS_TEST_DIRECTION = ['avg', 'rad', 'long'] as const;
export type MaterialAnalysisTestDirection = (typeof MATERIAL_ANALYSIS_TEST_DIRECTION)[number];

export const MATERIAL_ANALYSIS_KEYS = MATERIAL_ANALYSIS_TEST_TYPE.flatMap((t) =>
	MATERIAL_ANALYSIS_TEST_DIRECTION.map((d) => `${t}_${d}` as const)
);
export type MaterialAnalysisKey = (typeof MATERIAL_ANALYSIS_KEYS)[number];

export const MATERIAL_ANALYSIS_FILENAMES = MATERIAL_ANALYSIS_KEYS.map((k) => `${k}.txt`);

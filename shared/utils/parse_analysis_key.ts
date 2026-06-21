import * as enums from '../enums';

/**
 * Décompose une clé d'analyse en ses composantes : type de test et type d'épaisseur.
 *
 * Les clés suivent le format `{testType}_{thicknessType}`, où `testType` peut lui-même
 * contenir des underscores (ex. `sideload_io`). La décomposition se fait en cherchant
 * un suffixe correspondant à un type d'épaisseur connu, plutôt qu'en splitant sur le
 * premier underscore.
 *
 * @param key - La clé à décomposer (ex. `"squeeze_exp"`, `"sideload_io_lin"`).
 * @returns Un tuple `[testType, thicknessType]`.
 *
 * @throws {Error} Si `key` ne se termine pas par un suffixe d'épaisseur reconnu.
 *
 * @example
 * parseBottleAnalysisKey("squeeze_exp");     // → ["squeeze", "exp"]
 * parseBottleAnalysisKey("sideload_io_lin"); // → ["sideload_io", "lin"]
 */

export function parseBottleAnalysisKey(
	key: string
): [enums.BottleAnalysisTestType, enums.BottleAnalysisThicknessType] {
	// "squeeze_exp" → ["squeeze", "exp"]
	// "sideload_io_lin" → ["sideload_io", "lin"]

	for (const thickness of enums.BOTTLE_ANALYSIS_THICKNESS_TYPE) {
		if (key.endsWith(`_${thickness}`)) {
			const testType = key.slice(0, -(thickness.length + 1)) as unknown;
			return [testType as enums.BottleAnalysisTestType, thickness];
		}
	}

	throw new Error(`Invalid analysis key: ${key}`);
}

/**
 * Décompose une clé d'analyse matériau en ses composantes : type de test et direction.
 *
 * Les clés suivent le format `{testType}_{testDirection}`.
 *
 * @param key - La clé à décomposer (ex. `"ss_avg"`, `"fd_long"`).
 * @returns Un tuple `[testType, testDirection]`.
 *
 * @throws {Error} Si `key` ne correspond pas au format attendu.
 *
 * @example
 * parseMaterialAnalysisKey("ss_avg");  // → ["ss", "avg"]
 * parseMaterialAnalysisKey("fd_long"); // → ["fd", "long"]
 */
export function parseMaterialAnalysisKey(
	key: string
): [enums.MaterialAnalysisTestType, enums.MaterialAnalysisTestDirection] {
	for (const direction of enums.MATERIAL_ANALYSIS_TEST_DIRECTION) {
		if (key.endsWith(`_${direction}`)) {
			const testType = key.slice(0, -(direction.length + 1)) as unknown;
			return [testType as enums.MaterialAnalysisTestType, direction];
		}
	}

	throw new Error(`Invalid material analysis key: ${key}`);
}

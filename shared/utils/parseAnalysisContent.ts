/**
 * Parse le contenu textuel d'un fichier d'analyse pour en extraire les coordonnées x/y.
 *
 * Le contenu est attendu avec une paire de valeurs numériques séparées par des espaces
 * sur chaque ligne (ex. `"1.23  4.56"`).
 * Si le fichier n'est pas valide, une erreur est thrown
 *
 * @param content - Le contenu brut du fichier, déjà lu sous forme de chaîne.
 * @returns Un objet `{ x, y, raw }` contenant les coordonnées extraites et le contenu brut.
 * @throws Error("Le fichier n'est pas valide !")
 * @example
 * parseAnalysisContent("0.0  1.5\n2.0  3.7");
 * // → { x: [0.0, 2.0], y: [1.5, 3.7], raw: "0.0  1.5\n2.0  3.7" }
 */
export function parseAnalysisContent(content: string) {
	const lines = content.trim().split('\n');

	const xCoords: number[] = [];
	const yCoords: number[] = [];

	for (const line of lines) {
		const parts = line.trim().split(/\s+/);
		if (parts.length === 2) {
			const [xCoord, yCoord] = parts.map((el) => parseFloat(el));

			if (Number.isNaN(xCoord) || Number.isNaN(yCoord)) {
				throw new Error(
					"Le fichier n'est pas valide : au moins une valeur n'a pas pu être interprétée comme un nombre"
				);
			}
			xCoords.push(xCoord);
			yCoords.push(yCoord);
		} else if (parts.length === 1) {
			// do nothing
		} else {
			throw new Error("Le fichier n'est pas valide : au moins une ligne contient 3 valeurs");
		}
	}

	return { x: xCoords, y: yCoords, raw: content };
}

import { z } from 'zod';
import { parseAnalysisContent } from '../utils/parseAnalysisContent';

export const analysisFileSchema = z
	.instanceof(File)
	.optional()
	.superRefine(async (file, ctx) => {
		if (!file || file.size === 0) return;
		try {
			const content = await file.text();
			const parsed = parseAnalysisContent(content);
			if (parsed.x.length !== parsed.y.length || parsed.x.length === 0) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Fichier invalide ou vide' });
			}
		} catch (error) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: error instanceof Error ? error.message : 'Fichier invalide'
			});
		}
	})
	.transform(async (file) => {
		if (!file || file.size === 0) return null;
		try {
			const content = await file.text();
			return parseAnalysisContent(content);
		} catch {
			return null;
		}
	});

export const fileEntrySchema = z.object({
	fileName: z.string(),
	fileContent: z.string()
});

export type FileEntry = z.infer<typeof fileEntrySchema>;

export const analysisFilesSchema = z.array(fileEntrySchema).transform((files, ctx) => {
	return files.map((file, i) => {
		const key = file.fileName.replace(/\.[^.]+$/, '');

		try {
			const parsed = parseAnalysisContent(file.fileContent);
			if (parsed.x.length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: `Fichier "${file.fileName}" : aucune donnée valide`,
					path: [i]
				});
				return z.NEVER;
			}
			return {
				analysisKey: key,
				fileName: file.fileName,
				xCoordinates: parsed.x,
				yCoordinates: parsed.y,
				fileContentText: parsed.raw
			};
		} catch (err) {
			ctx.addIssue({
				code: 'custom',
				message: `Fichier "${file.fileName}" : ${err instanceof Error ? err.message : 'invalide'}`,
				path: [i]
			});
			return z.NEVER;
		}
	});
});

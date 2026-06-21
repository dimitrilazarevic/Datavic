import { createInsertSchema } from 'drizzle-zod';
import * as z from 'zod';
import * as schema from '../../electron/lib/db/schema';
import { parseBottleAnalysisKey } from '$shared/utils/parse_analysis_key';
import { analysisFileSchema } from './analysisFile';

const insertSchema = createInsertSchema(schema.bottleAnalysis, {}).omit({
	bottleAnalysisId: true,
	fileName: true
});

const upsertSchema = insertSchema
	.omit({
		testType: true,
		thicknessType: true,
		xCoordinates: true,
		yCoordinates: true,
		fileContentText: true
	})
	.extend({ analysisFile: analysisFileSchema })
	.transform((data, ctx) => {
		if (!data.analysisFile) {
			ctx.addIssue({ code: 'custom', message: `Le fichier d'analyse est requis` });
			return z.NEVER;
		}
		const [testType, thicknessType] = parseBottleAnalysisKey(data.bottleAnalysisKey ?? '');
		return {
			...data,
			testType,
			thicknessType,
			xCoordinates: data.analysisFile?.x,
			yCoordinates: data.analysisFile?.y,
			fileContentText: data.analysisFile?.raw
		};
	});

export const bottleAnalysisZod = { insertSchema, upsertSchema };

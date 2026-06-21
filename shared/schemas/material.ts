import { z } from 'zod';
import { analysisFilesSchema } from './analysisFile';

const materialBaseSchema = z.object({
	materialFamilyId: z.number().int().positive({ message: 'Sélectionnez une famille de matériaux' }),
	supplierId1: z.number().int().positive({ message: 'Sélectionnez un fournisseur' }),
	supplierId2: z.number().int().positive().optional(),

	ref1: z.string().min(1, { message: 'Référence requise' }),
	pct1: z.number().int().min(0).max(100),
	ref2: z.string().optional(),
	pct2: z.number().int().min(0).max(100).optional(),

	temperatureC: z.number().int({ message: 'La température doit être un entier' }),
	productionYear: z.number().int().min(1900).max(2100).optional(),

	avgElasticModulus: z.number().optional(),
	avgElasticLimit: z.number().optional(),
	longiAvgElasticModulus: z.number().optional(),
	longiAvgElasticLimit: z.number().optional(),
	radAvgElasticModulus: z.number().optional(),
	radAvgElasticLimit: z.number().optional(),
	syneAbaqusElasticModulus: z.number().optional(),
	syneAbaqusElasticLimit: z.number().optional(),

	imageExtension: z
		.enum(['png', 'jpg', 'jpeg', 'webp', 'svg'], {
			message: 'Extensions autorisées : png, jpg, jpeg, webp, svg'
		})
		.optional(),

	rawImageContent: z.instanceof(Uint8Array).optional(),

	analysisFiles: analysisFilesSchema.optional()
});

function refinePct(data: Record<string, unknown>, ctx: z.RefinementCtx) {
	const hasSupplier2 = data.supplierId2 != null;
	const pct1 = data.pct1 as number | undefined;
	const pct2 = data.pct2 as number | undefined;

	if (hasSupplier2 && (pct1 == null || pct2 == null)) {
		ctx.addIssue({
			code: 'custom',
			message: 'pct1 et pct2 doivent être définis avec 2 fournisseurs',
			path: ['pct1']
		});
		return;
	}

	if (hasSupplier2 && pct1 != null && pct2 != null && pct1 + pct2 !== 100) {
		ctx.addIssue({
			code: 'custom',
			message: `La somme des pourcentages doit être 100% (actuellement ${pct1 + pct2}%)`,
			path: ['pct2']
		});
	}

	if (!hasSupplier2 && pct2 != null) {
		ctx.addIssue({
			code: 'custom',
			message: 'pct2 ne peut pas être défini sans second fournisseur',
			path: ['pct2']
		});
	}
}

export const materialInsertSchema = materialBaseSchema.superRefine((data, ctx) => {
	refinePct(data, ctx);
});

export const materialUpdateSchema = materialBaseSchema
	.partial()
	.extend({ materialId: z.number().int().positive() })
	.superRefine((data, ctx) => {
		refinePct(data, ctx);
	});

export type MaterialInsertZod = z.infer<typeof materialInsertSchema>;
export type MaterialUpdateZod = z.infer<typeof materialUpdateSchema>;

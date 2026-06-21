import { z } from 'zod';
import { BOTTLE_STATUS } from '../enums';
import { analysisFilesSchema } from './analysisFile';

export const bottleInsertSchema = z.object({
	bottleTypeId: z.number().int().positive({ message: 'Sélectionnez un type de flacon' }),
	overbrandId: z.number().int().positive({ message: 'Sélectionnez une marque mère' }),
	brandId: z.number().int().positive({ message: 'Sélectionnez une marque' }),
	zoneId: z.number().int().positive({ message: 'Sélectionnez une zone' }),
	materialId: z.number().int().positive({ message: 'Sélectionnez un matériau' }),

	claimMl: z.number().positive({ message: 'La contenance doit être positive' }),
	overflowCapacityMl: z
		.number()
		.positive({ message: 'La capacité de débordement doit être positive' }),
	surfaceCm2: z.number().positive({ message: 'La surface doit être positive' }),
	thicknessMm: z.number().positive({ message: "L'épaisseur doit être positive" }),

	version: z
		.string()
		.regex(/^V\d{2}S\d{2}$/, { message: 'Format de version invalide (ex : V00S00)' }),
	pdmNumber: z.number().int(),
	status: z.enum(BOTTLE_STATUS).optional(),

	massG: z.string().regex(/^\d+g\d{1,2}$/, { message: 'Format de masse invalide (ex : 20g5)' }),

	massLossExp: z.number().min(0, { message: 'La perte de masse ne peut être négative' }).optional(),

	imageExtension: z
		.enum(['png', 'jpg', 'jpeg', 'webp', 'svg'], {
			message: 'Extensions autorisées : png, jpg, jpeg, webp, svg'
		})
		.optional(),

	rawImageContent: z.instanceof(Uint8Array).optional(),

	analysisFiles: analysisFilesSchema.optional()
});

export const bottleUpdateSchema = bottleInsertSchema.partial().extend({
	bottleId: z.number().int().positive()
});

export type BottleInsert = z.infer<typeof bottleInsertSchema>;
export type BottleUpdate = z.infer<typeof bottleUpdateSchema>;

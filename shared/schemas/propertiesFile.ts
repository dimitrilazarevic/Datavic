import { z } from 'zod';

const propertySchema = z.object({
	nom: z.number(),
	std: z.number()
});

export const propertiesSchema = z.object({
	properties: z.object({
		avg_elastic_modulus: propertySchema,
		avg_elastic_limit: propertySchema,
		LONGI_avg_elastic_modulus: propertySchema,
		LONGI_avg_elastic_limit: propertySchema,
		RAD_avg_elastic_modulus: propertySchema,
		RAD_avg_elastic_limit: propertySchema,
		syne_abaqus_elastic_modulus: propertySchema,
		syne_abaqus_elastic_limit: propertySchema
	})
});

export type MaterialProperties = z.infer<typeof propertiesSchema>['properties'];

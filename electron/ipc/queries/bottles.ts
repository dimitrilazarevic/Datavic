import { ipcMain } from 'electron';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '../../lib/db';
import { handleDbError } from './utils/handleDbError';
import {
	bottle,
	bottleType,
	brand,
	material,
	materialFamily,
	overbrand,
	zone,
	bottleAnalysis
} from '../../lib/db/schema';
import { inArray } from 'drizzle-orm';
import { createBottleFileName } from '../../../shared/utils/create_filename';
import {
	saveImage,
	saveAnalysisFile,
	ensureEntityDir,
	deleteEntityDir,
	deleteImage
} from '../../lib/fileutil';
import { exportEntitiesZip } from './utils/exportEntitiesZip';
import { parseBottleAnalysisKey } from '../../../shared/utils/parse_analysis_key';
import { BOTTLE_ANALYSIS_KEYS } from '../../../shared/enums';
import type { BottleWithAnalysis } from '../../lib/types';

interface ParsedAnalysisFile {
	analysisKey: string;
	fileName: string;
	xCoordinates: number[];
	yCoordinates: number[];
	fileContentText: string;
}

function computeMassLossNum(
	constant: number,
	surface: number | null,
	thickness: number | null
): number | null {
	if (!surface || !thickness) return null;
	return constant * (1 / 10000) * (surface / thickness) * 60;
}

function getByIdWithJoins(id: number): BottleWithAnalysis | undefined {
	const row = getDb()
		.select({
			bottle,
			bottleTypeName: bottleType.bottleTypeName,
			bottleTypeConstant: bottleType.bottleTypeConstant,
			brandName: brand.brandName,
			overbrandName: overbrand.overbrandName,
			zoneName: zone.zoneName,
			materialFolderName: material.folderName,
			materialFamilyName: materialFamily.materialFamilyName
		})
		.from(bottle)
		.innerJoin(bottleType, eq(bottle.bottleTypeId, bottleType.bottleTypeId))
		.innerJoin(brand, eq(bottle.brandId, brand.brandId))
		.innerJoin(material, eq(bottle.materialId, material.materialId))
		.innerJoin(materialFamily, eq(material.materialFamilyId, materialFamily.materialFamilyId))
		.innerJoin(overbrand, eq(bottle.overbrandId, overbrand.overBrandId))
		.innerJoin(zone, eq(bottle.zoneId, zone.zoneId))
		.where(eq(bottle.bottleId, id))
		.get();

	if (!row) return undefined;

	const analyses = getDb()
		.select()
		.from(bottleAnalysis)
		.where(eq(bottleAnalysis.bottleId, id))
		.all();

	const massLossNum = computeMassLossNum(
		row.bottleTypeConstant,
		row.bottle.surfaceCm2,
		row.bottle.thicknessMm
	);

	return {
		...row.bottle,
		bottleTypeName: row.bottleTypeName,
		brandName: row.brandName,
		overbrandName: row.overbrandName,
		zoneName: row.zoneName,
		materialFolderName: row.materialFolderName,
		materialFamilyName: row.materialFamilyName,
		massLossNum,
		analyses
	};
}

function updateFolderName(id: number) {
	const summary = getByIdWithJoins(id);
	if (!summary) return summary;
	const folderName = createBottleFileName(summary);
	getDb().update(bottle).set({ folderName }).where(eq(bottle.bottleId, id)).run();
	return folderName;
}

const bottleQueries = {
	getAll() {
		try {
			const availableDataColumns = BOTTLE_ANALYSIS_KEYS.reduce(
				(acc, key) => {
					const [testType, thicknessType] = parseBottleAnalysisKey(key);
					acc[key] = sql<boolean>`(
						SELECT COUNT(*) > 0 FROM bottle_analysis
						WHERE bottle_analysis.bottle_id = ${bottle.bottleId}
						AND bottle_analysis.test_type = ${testType}
						AND bottle_analysis.thickness_type = ${thicknessType}
					)`;
					return acc;
				},
				{} as Record<string, ReturnType<typeof sql<boolean>>>
			);

			return getDb()
				.select({
					bottle,
					bottleTypeName: bottleType.bottleTypeName,
					bottleTypeConstant: bottleType.bottleTypeConstant,
					brandName: brand.brandName,
					overbrandName: overbrand.overbrandName,
					zoneName: zone.zoneName,
					materialFolderName: material.folderName,
					materialFamilyName: materialFamily.materialFamilyName,
					...availableDataColumns
				})
				.from(bottle)
				.innerJoin(bottleType, eq(bottle.bottleTypeId, bottleType.bottleTypeId))
				.innerJoin(brand, eq(bottle.brandId, brand.brandId))
				.innerJoin(material, eq(bottle.materialId, material.materialId))
				.innerJoin(materialFamily, eq(material.materialFamilyId, materialFamily.materialFamilyId))
				.innerJoin(overbrand, eq(bottle.overbrandId, overbrand.overBrandId))
				.innerJoin(zone, eq(bottle.zoneId, zone.zoneId))
				.all()
				.map((row) => {
					const {
						bottle: b,
						bottleTypeName,
						bottleTypeConstant,
						brandName,
						overbrandName,
						zoneName,
						materialFolderName,
						materialFamilyName,
						...dataFlags
					} = row;
					const availableData = {} as Record<string, boolean>;
					for (const key of BOTTLE_ANALYSIS_KEYS) {
						availableData[key] = !!(dataFlags as Record<string, unknown>)[key];
					}
					const massLossNum = computeMassLossNum(bottleTypeConstant, b.surfaceCm2, b.thicknessMm);
					return {
						...b,
						bottleTypeName,
						brandName,
						overbrandName,
						zoneName,
						materialFolderName,
						materialFamilyName,
						massLossNum,
						availableData
					};
				});
		} catch (err) {
			handleDbError(err, 'bottle.getAll');
		}
	},

	getById(id: number) {
		try {
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'bottle.getById');
		}
	},

	create(data: Record<string, unknown>) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data as typeof bottle.$inferInsert & {
				rawImageContent?: Uint8Array;
				analysisFiles?: ParsedAnalysisFile[];
			};
			const now = new Date().toISOString();

			const row = getDb().transaction((tx) => {
				const inserted = tx
					.insert(bottle)
					.values({ ...dbData, createdAt: now, lastModified: now })
					.returning()
					.get();

				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						const [testType, thicknessType] = parseBottleAnalysisKey(af.analysisKey);
						tx.insert(bottleAnalysis)
							.values({
								bottleId: inserted.bottleId,
								testType,
								thicknessType,
								bottleAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
				}

				return inserted;
			});

			const folderName = updateFolderName(row.bottleId);
			if (folderName) {
				ensureEntityDir('bottles', folderName);
				if (rawImageContent && row.imageExtension) {
					saveImage('bottles', folderName, row.imageExtension, rawImageContent);
				}
				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						saveAnalysisFile('bottles', folderName, af.fileName, af.fileContentText);
					}
				}
			}
			return getByIdWithJoins(row.bottleId);
		} catch (err) {
			handleDbError(err, 'bottle.create');
		}
	},

	update(id: number, data: Record<string, unknown>) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data as Partial<
				typeof bottle.$inferInsert
			> & { rawImageContent?: Uint8Array; analysisFiles?: ParsedAnalysisFile[] };

			const oldImageExtension = rawImageContent
				? (getDb()
						.select({ imageExtension: bottle.imageExtension })
						.from(bottle)
						.where(eq(bottle.bottleId, id))
						.get()?.imageExtension ?? undefined)
				: undefined;

			getDb().transaction((tx) => {
				tx.update(bottle)
					.set({ ...dbData, lastModified: new Date().toISOString() })
					.where(eq(bottle.bottleId, id))
					.run();

				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						const [testType, thicknessType] = parseBottleAnalysisKey(af.analysisKey);
						tx.delete(bottleAnalysis)
							.where(
								and(
									eq(bottleAnalysis.bottleId, id),
									eq(bottleAnalysis.testType, testType),
									eq(bottleAnalysis.thicknessType, thicknessType)
								)
							)
							.run();
						tx.insert(bottleAnalysis)
							.values({
								bottleId: id,
								testType,
								thicknessType,
								bottleAnalysisKey: af.analysisKey,
								fileName: af.fileName,
								xCoordinates: af.xCoordinates,
								yCoordinates: af.yCoordinates,
								fileContentText: af.fileContentText
							})
							.run();
					}
				}
			});

			const folderName = updateFolderName(id);
			if (folderName) {
				if (rawImageContent) {
					const row = getDb()
						.select({ imageExtension: bottle.imageExtension })
						.from(bottle)
						.where(eq(bottle.bottleId, id))
						.get();
					if (row?.imageExtension) {
						if (oldImageExtension && oldImageExtension !== row.imageExtension) {
							deleteImage('bottles', folderName, oldImageExtension);
						}
						saveImage('bottles', folderName, row.imageExtension, rawImageContent);
					}
				}
				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						saveAnalysisFile('bottles', folderName, af.fileName, af.fileContentText);
					}
				}
			}
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'bottle.update');
		}
	},

	delete(id: number) {
		try {
			const row = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where(eq(bottle.bottleId, id))
				.get();
			const result = getDb().delete(bottle).where(eq(bottle.bottleId, id)).returning().get();
			if (row?.folderName) {
				deleteEntityDir('bottles', row.folderName);
			}
			return result;
		} catch (err) {
			handleDbError(err, 'bottle.delete');
		}
	},

	deleteMany(ids: number[]) {
		try {
			const rows = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where(inArray(bottle.bottleId, ids))
				.all();
			getDb().delete(bottle).where(inArray(bottle.bottleId, ids)).run();
			for (const row of rows) {
				if (row.folderName) deleteEntityDir('bottles', row.folderName);
			}
		} catch (err) {
			handleDbError(err, 'bottle.deleteMany');
		}
	},

	async exportZip(ids: number[]) {
		try {
			const rows = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where(inArray(bottle.bottleId, ids))
				.all();
			const folderNames = rows.map((r) => r.folderName).filter((f): f is string => !!f);
			return exportEntitiesZip('bottles', folderNames);
		} catch (err) {
			handleDbError(err, 'bottle.exportZip');
		}
	},

	uploadAnalysis(id: number, analysisFile: ParsedAnalysisFile) {
		try {
			const [testType, thicknessType] = parseBottleAnalysisKey(analysisFile.analysisKey);
			getDb().transaction((tx) => {
				tx.delete(bottleAnalysis)
					.where(
						and(
							eq(bottleAnalysis.bottleId, id),
							eq(bottleAnalysis.testType, testType),
							eq(bottleAnalysis.thicknessType, thicknessType)
						)
					)
					.run();
				tx.insert(bottleAnalysis)
					.values({
						bottleId: id,
						testType,
						thicknessType,
						bottleAnalysisKey: analysisFile.analysisKey,
						fileName: analysisFile.fileName,
						xCoordinates: analysisFile.xCoordinates,
						yCoordinates: analysisFile.yCoordinates,
						fileContentText: analysisFile.fileContentText
					})
					.run();
			});
			const row = getDb()
				.select({ folderName: bottle.folderName })
				.from(bottle)
				.where(eq(bottle.bottleId, id))
				.get();
			if (row?.folderName) {
				saveAnalysisFile(
					'bottles',
					row.folderName,
					analysisFile.fileName,
					analysisFile.fileContentText
				);
			}
		} catch (err) {
			handleDbError(err, 'bottle.uploadAnalysis');
		}
	},

	deleteAnalysis(id: number, analysisKey: string) {
		try {
			const [testType, thicknessType] = parseBottleAnalysisKey(analysisKey);
			getDb()
				.delete(bottleAnalysis)
				.where(
					and(
						eq(bottleAnalysis.bottleId, id),
						eq(bottleAnalysis.testType, testType),
						eq(bottleAnalysis.thicknessType, thicknessType)
					)
				)
				.run();
		} catch (err) {
			handleDbError(err, 'bottle.deleteAnalysis');
		}
	}
};

export function registerBottleHandlers() {
	ipcMain.handle('db:bottle:getAll', () => bottleQueries.getAll());
	ipcMain.handle('db:bottle:getById', (_e, id: number) => bottleQueries.getById(id));
	ipcMain.handle('db:bottle:create', (_e, data) => bottleQueries.create(data));
	ipcMain.handle('db:bottle:update', (_e, id: number, data) => bottleQueries.update(id, data));
	ipcMain.handle('db:bottle:delete', (_e, id: number) => bottleQueries.delete(id));
	ipcMain.handle('db:bottle:deleteMany', (_e, ids: number[]) => bottleQueries.deleteMany(ids));
	ipcMain.handle('db:bottle:exportZip', (_e, ids: number[]) => bottleQueries.exportZip(ids));
	ipcMain.handle('db:bottle:uploadAnalysis', (_e, id: number, data: ParsedAnalysisFile) =>
		bottleQueries.uploadAnalysis(id, data)
	);
	ipcMain.handle('db:bottle:deleteAnalysis', (_e, id: number, key: string) =>
		bottleQueries.deleteAnalysis(id, key)
	);
}

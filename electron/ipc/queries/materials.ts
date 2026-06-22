import { ipcMain } from 'electron';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { getDb } from '../../lib/db';
import { handleDbError } from './utils/handleDbError';
import { material, materialFamily, supplier, materialAnalysis } from '../../lib/db/schema';
import { createMaterialFileName } from '../../../shared/utils/create_filename';
import {
	saveImage,
	saveAnalysisFile,
	ensureEntityDir,
	deleteEntityDir,
	deleteImage
} from '../../lib/fileutil';
import { exportEntitiesZip } from './utils/exportEntitiesZip';
import { parseMaterialAnalysisKey } from '../../../shared/utils/parse_analysis_key';
import { MATERIAL_ANALYSIS_KEYS } from '../../../shared/enums';
import type { MaterialWithAnalysis } from '../../lib/types';

interface ParsedAnalysisFile {
	analysisKey: string;
	fileName: string;
	xCoordinates: number[];
	yCoordinates: number[];
	fileContentText: string;
}

const supplier2 = alias(supplier, 'supplier2');

function getByIdWithJoins(id: number): MaterialWithAnalysis | undefined {
	const row = getDb()
		.select({
			material,
			materialFamilyName: materialFamily.materialFamilyName,
			supplierName1: supplier.supplierName,
			supplierName2: supplier2.supplierName
		})
		.from(material)
		.innerJoin(materialFamily, eq(material.materialFamilyId, materialFamily.materialFamilyId))
		.innerJoin(supplier, eq(material.supplierId1, supplier.supplierId))
		.leftJoin(supplier2, eq(material.supplierId2, supplier2.supplierId))
		.where(eq(material.materialId, id))
		.get();

	if (!row) return undefined;

	const analyses = getDb()
		.select()
		.from(materialAnalysis)
		.where(eq(materialAnalysis.materialId, id))
		.all();

	return {
		...row.material,
		materialFamilyName: row.materialFamilyName,
		supplierName1: row.supplierName1,
		supplierName2: row.supplierName2,
		analyses
	};
}

function updateFolderName(id: number) {
	const summary = getByIdWithJoins(id);
	if (!summary) return summary;
	const folderName = createMaterialFileName(summary);
	getDb().update(material).set({ folderName }).where(eq(material.materialId, id)).run();
	return folderName;
}

const materialQueries = {
	getAll() {
		try {
			const availableDataColumns = MATERIAL_ANALYSIS_KEYS.reduce(
				(acc, key) => {
					const [testType, testDirection] = parseMaterialAnalysisKey(key);
					acc[key] = sql<boolean>`(
						SELECT COUNT(*) > 0 FROM material_analysis
						WHERE material_analysis.material_id = ${material.materialId}
						AND material_analysis.test_type = ${testType}
						AND material_analysis.test_direction = ${testDirection}
					)`;
					return acc;
				},
				{} as Record<string, ReturnType<typeof sql<boolean>>>
			);

			const isLinkedColumn = sql<boolean>`(
						SELECT COUNT(*) > 0 FROM bottle
						WHERE bottle.material_id = ${material.materialId}
					)`;

			return getDb()
				.select({
					material,
					materialFamilyName: materialFamily.materialFamilyName,
					supplierName1: supplier.supplierName,
					supplierName2: supplier2.supplierName,
					isLinked: isLinkedColumn,
					...availableDataColumns
				})
				.from(material)
				.innerJoin(materialFamily, eq(material.materialFamilyId, materialFamily.materialFamilyId))
				.innerJoin(supplier, eq(material.supplierId1, supplier.supplierId))
				.leftJoin(supplier2, eq(material.supplierId2, supplier2.supplierId))
				.all()
				.map((row) => {
					const {
						material: m,
						materialFamilyName,
						supplierName1,
						supplierName2,
						isLinked,
						...dataFlags
					} = row;
					const availableData = {} as Record<string, boolean>;
					for (const key of MATERIAL_ANALYSIS_KEYS) {
						availableData[key] = !!(dataFlags as Record<string, unknown>)[key];
					}
					return {
						...m,
						materialFamilyName,
						supplierName1,
						supplierName2,
						availableData,
						isLinked: !!isLinked
					};
				});
		} catch (err) {
			handleDbError(err, 'material.getAll');
		}
	},

	getById(id: number) {
		try {
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'material.getById');
		}
	},

	create(data: Record<string, unknown>) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data as typeof material.$inferInsert & {
				rawImageContent?: Uint8Array;
				analysisFiles?: ParsedAnalysisFile[];
			};
			const now = new Date().toISOString();

			const row = getDb().transaction((tx) => {
				const inserted = tx
					.insert(material)
					.values({ ...dbData, createdAt: now, lastModified: now })
					.returning()
					.get();

				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						const [testType, testDirection] = parseMaterialAnalysisKey(af.analysisKey);
						tx.insert(materialAnalysis)
							.values({
								materialId: inserted.materialId,
								testType,
								testDirection,
								materialAnalysisKey: af.analysisKey,
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

			const folderName = updateFolderName(row.materialId);
			if (folderName) {
				ensureEntityDir('materials', folderName);
				if (rawImageContent && row.imageExtension) {
					saveImage('materials', folderName, row.imageExtension, rawImageContent);
				}
				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						saveAnalysisFile('materials', folderName, af.fileName, af.fileContentText);
					}
				}
			}
			return getByIdWithJoins(row.materialId);
		} catch (err) {
			handleDbError(err, 'material.create');
		}
	},

	update(id: number, data: Record<string, unknown>) {
		try {
			const { rawImageContent, analysisFiles, ...dbData } = data as Partial<
				typeof material.$inferInsert
			> & { rawImageContent?: Uint8Array; analysisFiles?: ParsedAnalysisFile[] };

			const oldImageExtension = rawImageContent
				? (getDb()
						.select({ imageExtension: material.imageExtension })
						.from(material)
						.where(eq(material.materialId, id))
						.get()?.imageExtension ?? undefined)
				: undefined;

			getDb().transaction((tx) => {
				tx.update(material)
					.set({ ...dbData, lastModified: new Date().toISOString() })
					.where(eq(material.materialId, id))
					.run();

				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						const [testType, testDirection] = parseMaterialAnalysisKey(af.analysisKey);
						tx.delete(materialAnalysis)
							.where(
								and(
									eq(materialAnalysis.materialId, id),
									eq(materialAnalysis.testType, testType),
									eq(materialAnalysis.testDirection, testDirection)
								)
							)
							.run();
						tx.insert(materialAnalysis)
							.values({
								materialId: id,
								testType,
								testDirection,
								materialAnalysisKey: af.analysisKey,
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
						.select({ imageExtension: material.imageExtension })
						.from(material)
						.where(eq(material.materialId, id))
						.get();
					if (row?.imageExtension) {
						if (oldImageExtension && oldImageExtension !== row.imageExtension) {
							deleteImage('materials', folderName, oldImageExtension);
						}
						saveImage('materials', folderName, row.imageExtension, rawImageContent);
					}
				}
				if (analysisFiles?.length) {
					for (const af of analysisFiles) {
						saveAnalysisFile('materials', folderName, af.fileName, af.fileContentText);
					}
				}
			}
			return getByIdWithJoins(id);
		} catch (err) {
			handleDbError(err, 'material.update');
		}
	},

	delete(id: number) {
		try {
			const row = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where(eq(material.materialId, id))
				.get();
			const result = getDb().delete(material).where(eq(material.materialId, id)).returning().get();
			if (row?.folderName) {
				deleteEntityDir('materials', row.folderName);
			}
			return result;
		} catch (err) {
			handleDbError(err, 'material.delete');
		}
	},

	deleteMany(ids: number[]) {
		try {
			const rows = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where(inArray(material.materialId, ids))
				.all();
			getDb().delete(material).where(inArray(material.materialId, ids)).run();
			for (const row of rows) {
				if (row.folderName) deleteEntityDir('materials', row.folderName);
			}
		} catch (err) {
			handleDbError(err, 'material.deleteMany');
		}
	},

	async exportZip(ids: number[]) {
		try {
			const rows = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where(inArray(material.materialId, ids))
				.all();
			const folderNames = rows.map((r) => r.folderName).filter((f): f is string => !!f);
			return exportEntitiesZip('materials', folderNames);
		} catch (err) {
			handleDbError(err, 'material.exportZip');
		}
	},

	uploadAnalysis(id: number, analysisFile: ParsedAnalysisFile) {
		try {
			const [testType, testDirection] = parseMaterialAnalysisKey(analysisFile.analysisKey);
			getDb().transaction((tx) => {
				tx.delete(materialAnalysis)
					.where(
						and(
							eq(materialAnalysis.materialId, id),
							eq(materialAnalysis.testType, testType),
							eq(materialAnalysis.testDirection, testDirection)
						)
					)
					.run();
				tx.insert(materialAnalysis)
					.values({
						materialId: id,
						testType,
						testDirection,
						materialAnalysisKey: analysisFile.analysisKey,
						fileName: analysisFile.fileName,
						xCoordinates: analysisFile.xCoordinates,
						yCoordinates: analysisFile.yCoordinates,
						fileContentText: analysisFile.fileContentText
					})
					.run();
			});
			const row = getDb()
				.select({ folderName: material.folderName })
				.from(material)
				.where(eq(material.materialId, id))
				.get();
			if (row?.folderName) {
				saveAnalysisFile(
					'materials',
					row.folderName,
					analysisFile.fileName,
					analysisFile.fileContentText
				);
			}
		} catch (err) {
			handleDbError(err, 'material.uploadAnalysis');
		}
	},

	deleteAnalysis(id: number, analysisKey: string) {
		try {
			const [testType, testDirection] = parseMaterialAnalysisKey(analysisKey);
			getDb()
				.delete(materialAnalysis)
				.where(
					and(
						eq(materialAnalysis.materialId, id),
						eq(materialAnalysis.testType, testType),
						eq(materialAnalysis.testDirection, testDirection)
					)
				)
				.run();
		} catch (err) {
			handleDbError(err, 'material.deleteAnalysis');
		}
	}
};

export function registerMaterialHandlers() {
	ipcMain.handle('db:material:getAll', () => materialQueries.getAll());
	ipcMain.handle('db:material:getById', (_e, id: number) => materialQueries.getById(id));
	ipcMain.handle('db:material:create', (_e, data) => materialQueries.create(data));
	ipcMain.handle('db:material:update', (_e, id: number, data) => materialQueries.update(id, data));
	ipcMain.handle('db:material:delete', (_e, id: number) => materialQueries.delete(id));
	ipcMain.handle('db:material:deleteMany', (_e, ids: number[]) => materialQueries.deleteMany(ids));
	ipcMain.handle('db:material:exportZip', (_e, ids: number[]) => materialQueries.exportZip(ids));
	ipcMain.handle('db:material:uploadAnalysis', (_e, id: number, data: ParsedAnalysisFile) =>
		materialQueries.uploadAnalysis(id, data)
	);
	ipcMain.handle('db:material:deleteAnalysis', (_e, id: number, key: string) =>
		materialQueries.deleteAnalysis(id, key)
	);
}

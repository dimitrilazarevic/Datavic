import { ipcMain } from 'electron';
import {
	bottleType,
	brand,
	overbrand,
	zone,
	materialFamily,
	supplier,
	bottle,
	material
} from '../../../lib/db/schema';
import { getDb } from '../../../lib/db';
import { createSimpleQueries } from './simpleQueries';

export const tables = {
	bottleType: createSimpleQueries(bottleType, bottleType.bottleTypeId, 'bottleType', () => {
		return new Set(
			getDb()
				.select({ id: bottle.bottleTypeId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	brand: createSimpleQueries(brand, brand.brandId, 'brand', () => {
		return new Set(
			getDb()
				.select({ id: bottle.brandId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	overbrand: createSimpleQueries(overbrand, overbrand.overBrandId, 'overbrand', () => {
		return new Set(
			getDb()
				.select({ id: bottle.overbrandId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	zone: createSimpleQueries(zone, zone.zoneId, 'zone', () => {
		return new Set(
			getDb()
				.select({ id: bottle.zoneId })
				.from(bottle)
				.all()
				.map((r) => r.id)
		);
	}),
	materialFamily: createSimpleQueries(
		materialFamily,
		materialFamily.materialFamilyId,
		'materialFamily',
		() => {
			return new Set(
				getDb()
					.select({ id: material.materialFamilyId })
					.from(material)
					.all()
					.map((r) => r.id)
			);
		}
	),
	supplier: createSimpleQueries(supplier, supplier.supplierId, 'supplier', () => {
		const rows = getDb()
			.select({ id1: material.supplierId1, id2: material.supplierId2 })
			.from(material)
			.all();
		const ids = new Set<number>();
		for (const row of rows) {
			ids.add(row.id1);
			if (row.id2 !== null) ids.add(row.id2);
		}
		return ids;
	})
};

type TableName = keyof typeof tables;

export function registerSimpleHandlers() {
	for (const [name, queries] of Object.entries(tables) as [
		TableName,
		(typeof tables)[TableName]
	][]) {
		ipcMain.handle(`db:${name}:getAll`, () => queries.getAll());
		ipcMain.handle(`db:${name}:create`, (_event, data) => queries.create(data));
		ipcMain.handle(`db:${name}:update`, (_event, id: number, data) => queries.update(id, data));
		ipcMain.handle(`db:${name}:delete`, (_event, id: number) => queries.delete(id));
	}
}

import { ipcMain } from 'electron';
import {
	bottleType,
	brand,
	overbrand,
	zone,
	materialFamily,
	supplier
} from '../../../lib/db/schema';
import { createSimpleQueries } from './simpleQueries';

const tables = {
	bottleType: createSimpleQueries(bottleType, bottleType.bottleTypeId, 'bottleType'),
	brand: createSimpleQueries(brand, brand.brandId, 'brand'),
	overbrand: createSimpleQueries(overbrand, overbrand.overBrandId, 'overbrand'),
	zone: createSimpleQueries(zone, zone.zoneId, 'zone'),
	materialFamily: createSimpleQueries(materialFamily, materialFamily.materialFamilyId, 'materialFamily'),
	supplier: createSimpleQueries(supplier, supplier.supplierId, 'supplier')
};

type TableName = keyof typeof tables;

export function registerSimpleHandlers() {
	for (const [name, queries] of Object.entries(tables) as [TableName, (typeof tables)[TableName]][]) {
		ipcMain.handle(`db:${name}:getAll`, () => queries.getAll());
		ipcMain.handle(`db:${name}:create`, (_event, data) => queries.create(data));
		ipcMain.handle(`db:${name}:update`, (_event, id: number, data) => queries.update(id, data));
		ipcMain.handle(`db:${name}:delete`, (_event, id: number) => queries.delete(id));
	}
}

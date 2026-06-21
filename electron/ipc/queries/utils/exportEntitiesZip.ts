import { app, BrowserWindow, dialog } from 'electron';
import fs from 'fs';
import path from 'path';
import { ZipArchive } from 'archiver';
import { getDbPath } from '../../../lib/config';
import { formatDateForFilename } from '../../../../shared/utils/formatDate';

export async function exportEntitiesZip(
	entity: 'bottles' | 'materials',
	folderNames: string[]
): Promise<string | null> {
	const win = BrowserWindow.getFocusedWindow();
	if (!win) return null;

	const defaultName = `datavic-${entity}-${formatDateForFilename()}.zip`;

	const result = await dialog.showSaveDialog(win, {
		title: `Exporter ${entity}`,
		defaultPath: defaultName,
		filters: [{ name: 'Archive ZIP', extensions: ['zip'] }]
	});

	if (result.canceled || !result.filePath) return null;

	const dbDir = path.dirname(getDbPath());

	await new Promise<void>((resolve, reject) => {
		const output = fs.createWriteStream(result.filePath!);
		const archive = new ZipArchive({ zlib: { level: 9 } });

		output.on('close', resolve);
		archive.on('error', reject);

		archive.pipe(output);

		for (const folderName of folderNames) {
			const folderPath = path.join(dbDir, entity, folderName);
			if (fs.existsSync(folderPath)) {
				archive.directory(folderPath, folderName);
			}
		}

		archive.finalize();
	});

	return result.filePath;
}

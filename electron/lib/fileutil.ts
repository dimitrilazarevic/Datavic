import path from 'path';
import fs from 'fs';
import { getDbPath } from './config';

function getEntityDir(entity: 'bottles' | 'materials', folderName: string): string {
	const dbDir = path.dirname(getDbPath());
	return path.join(dbDir, entity, folderName);
}

export function ensureEntityDir(entity: 'bottles' | 'materials', folderName: string): string {
	const dir = getEntityDir(entity, folderName);
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}

export function deleteEntityDir(entity: 'bottles' | 'materials', folderName: string): void {
	const dir = getEntityDir(entity, folderName);
	try {
		fs.rmSync(dir, { recursive: true });
	} catch {
		// dir may not exist
	}
}

export function saveImage(
	entity: 'bottles' | 'materials',
	folderName: string,
	ext: string,
	data: Uint8Array
): string {
	const dir = ensureEntityDir(entity, folderName);
	const filePath = path.join(dir, `image.${ext}`);
	fs.writeFileSync(filePath, data);
	return filePath;
}

export function saveAnalysisFile(
	entity: 'bottles' | 'materials',
	folderName: string,
	fileName: string,
	content: string
): string {
	const dir = ensureEntityDir(entity, folderName);
	const filePath = path.join(dir, fileName);
	fs.writeFileSync(filePath, content, 'utf-8');
	return filePath;
}

export function getImagePath(
	entity: 'bottles' | 'materials',
	folderName: string,
	ext: string
): string | null {
	const filePath = path.join(getEntityDir(entity, folderName), `image.${ext}`);
	return fs.existsSync(filePath) ? filePath : null;
}

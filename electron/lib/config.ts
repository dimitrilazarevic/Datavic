import { app } from 'electron';
import path from 'path';
import fs from 'fs';

interface AppConfig {
	dbFolder: string | null;
}

const configPath = path.join(app.getPath('userData'), 'config.json');

const defaults: AppConfig = { dbFolder: null };

function read(): AppConfig {
	try {
		return { ...defaults, ...JSON.parse(fs.readFileSync(configPath, 'utf-8')) };
	} catch {
		return { ...defaults };
	}
}

function write(config: AppConfig) {
	fs.writeFileSync(configPath, JSON.stringify(config, null, '\t'));
}

export function getDbPath(): string {
	const { dbFolder } = read();
	const folder = dbFolder ?? app.getPath('userData');
	return path.join(folder, 'datavic.db');
}

export function setDbFolder(folder: string | null) {
	const config = read();
	config.dbFolder = folder;
	write(config);
}

export function getDbFolder(): string | null {
	return read().dbFolder;
}

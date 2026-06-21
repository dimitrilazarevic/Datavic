import { registerAppHandlers } from './appHandlers';
import { registerConfigHandlers } from './configHandlers';
import { registerSimpleHandlers } from './queries/simple';
import { registerBottleHandlers } from './queries/bottles';
import { registerMaterialHandlers } from './queries/materials';

export function registerIpcHandlers() {
	registerAppHandlers();
	registerConfigHandlers();
	registerSimpleHandlers();
	registerBottleHandlers();
	registerMaterialHandlers();
}

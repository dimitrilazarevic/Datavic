import { registerAppHandlers } from './appHandlers';
import { registerConfigHandlers } from './configHandlers';
import { registerSimpleHandlers } from './queries/simple';

export function registerIpcHandlers() {
	registerAppHandlers();
	registerConfigHandlers();
	registerSimpleHandlers();
}

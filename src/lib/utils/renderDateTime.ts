export function renderDateTime(dateStr: string | null | undefined): string | undefined {
	if (!dateStr) return undefined;
	return new Date(dateStr).toLocaleString('fr-FR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

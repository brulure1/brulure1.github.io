/** Convertit le markdown minimal des cartes (**gras**) en HTML sûr */
export function renderCardTitle(text: string): string {
	const escaped = text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

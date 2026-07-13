import { Language } from './language.enum';

export const DEFAULT_LANGUAGE = Language.RU;

const SUPPORTED_LANGUAGES = new Set<string>(Object.values(Language));

export function resolveLanguage(acceptLanguage?: string | null): Language {
	if (!acceptLanguage) {
		return DEFAULT_LANGUAGE;
	}

	for (const part of acceptLanguage.split(',')) {
		const code = part.split(';')[0].trim().toLowerCase().slice(0, 2);
		if (SUPPORTED_LANGUAGES.has(code)) {
			return code as Language;
		}
	}

	return DEFAULT_LANGUAGE;
}

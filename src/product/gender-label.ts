import { Language } from '../i18n/language.enum';

import { Gender } from './enums/gender.enum';

const GENDER_LABELS: Record<Language, Record<Gender, string>> = {
	[Language.RU]: { [Gender.MALE]: 'Мужской', [Gender.FEMALE]: 'Женский' },
	[Language.EN]: { [Gender.MALE]: 'Male', [Gender.FEMALE]: 'Female' },
};

export function genderLabel(gender: Gender, lang: Language): string {
	return (GENDER_LABELS[lang] ?? GENDER_LABELS[Language.RU])[gender];
}

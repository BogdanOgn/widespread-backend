import { Gender } from './enums/gender.enum';

const GENDER_LABELS: Record<Gender, string> = {
	[Gender.MALE]: 'Male',
	[Gender.FEMALE]: 'Female',
};

export function genderLabel(gender: Gender): string {
	return GENDER_LABELS[gender];
}

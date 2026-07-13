import { IsString } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	name_ru!: string;

	@IsString()
	name_en!: string;

	@IsString()
	slug!: string;
}

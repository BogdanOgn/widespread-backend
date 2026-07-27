import { ApiProperty } from '@nestjs/swagger';

import { IsString } from 'class-validator';

export class CreateCategoryDto {
	@ApiProperty()
	@IsString()
	name_ru!: string;

	@ApiProperty()
	@IsString()
	name_en!: string;

	@ApiProperty()
	@IsString()
	slug!: string;
}

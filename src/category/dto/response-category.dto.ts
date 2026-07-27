import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, IsString } from 'class-validator';

export class ResponseCategoryDto {
	@ApiProperty()
	@IsNumber()
	id!: number;

	@ApiProperty()
	@IsString()
	name!: string;

	@ApiProperty()
	@IsString()
	slug!: string;
}

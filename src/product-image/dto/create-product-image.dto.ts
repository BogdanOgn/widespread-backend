import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductImageDto {
	@ApiProperty()
	@Type(() => Number)
	@IsInt()
	product_id!: number;

	@ApiProperty()
	@IsString()
	url!: string;

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	alt?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	order?: number;
}

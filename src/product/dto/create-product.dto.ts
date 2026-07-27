import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

import { Gender } from '../enums/gender.enum';

export class CreateProductDto {
	@ApiProperty()
	@IsString()
	title!: string;

	@ApiProperty()
	@IsString()
	description!: string;

	@ApiProperty({ minimum: 0 })
	@IsNumber()
	@Min(0)
	price!: number;

	@ApiPropertyOptional({ minimum: 0 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	sale_price?: number;

	@ApiProperty()
	@IsString()
	slug!: string;

	@ApiProperty({ enum: Gender })
	@IsEnum(Gender)
	gender!: Gender;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	is_published?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@IsBoolean()
	is_archived?: boolean;

	@ApiPropertyOptional({ nullable: true })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	category_id?: number | null;

	@ApiPropertyOptional({ nullable: true })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	brand_id?: number | null;

	@ApiPropertyOptional({ type: [Number] })
	@IsOptional()
	@IsArray()
	@Type(() => Number)
	@IsInt({ each: true })
	size_ids?: number[];
}

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
	@IsString()
	title!: string;

	@IsString()
	description!: string;

	@IsNumber()
	@Min(0)
	price!: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	sale_price?: number;

	@IsString()
	slug!: string;

	@IsEnum(Gender)
	gender!: Gender;

	@IsOptional()
	@IsBoolean()
	is_published?: boolean;

	@IsOptional()
	@IsBoolean()
	is_archived?: boolean;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	category_id?: number | null;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	brand_id?: number | null;

	@IsOptional()
	@IsArray()
	@Type(() => Number)
	@IsInt({ each: true })
	size_ids?: number[];
}

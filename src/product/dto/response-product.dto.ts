import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

import { ResponseBrandDto } from '../../brand/dto/response-brand.dto';
import { ResponseCategoryDto } from '../../category/dto/response-category.dto';
import { ResponseProductImageDto } from '../../product-image/dto/response-product-image.dto';
import { ResponseSizeDto } from '../../size/dto/response-size.dto';
import { Gender } from '../enums/gender.enum';

export class ResponseProductDto {
	@IsNumber()
	id!: number;

	@IsString()
	title!: string;

	@IsString()
	description!: string;

	@IsNumber()
	price!: number;

	@IsNumber()
	@IsOptional()
	sale_price?: number;

	@IsString()
	slug!: string;

	@IsEnum(Gender)
	gender!: Gender;

	@IsString()
	gender_label!: string;

	@IsBoolean()
	is_published!: boolean;

	@IsBoolean()
	is_archived!: boolean;

	@Type(() => ResponseCategoryDto)
	@IsOptional()
	category?: ResponseCategoryDto | null;

	@Type(() => ResponseBrandDto)
	@IsOptional()
	brand?: ResponseBrandDto | null;

	@Type(() => ResponseSizeDto)
	@IsOptional()
	sizes?: ResponseSizeDto[];

	@Type(() => ResponseProductImageDto)
	@IsOptional()
	images?: ResponseProductImageDto[];
}

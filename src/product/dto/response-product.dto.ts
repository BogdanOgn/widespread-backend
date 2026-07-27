import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
	@ApiProperty()
	@IsNumber()
	id!: number;

	@ApiProperty()
	@IsString()
	title!: string;

	@ApiProperty()
	@IsString()
	description!: string;

	@ApiProperty()
	@IsNumber()
	price!: number;

	@ApiPropertyOptional()
	@IsNumber()
	@IsOptional()
	sale_price?: number;

	@ApiProperty()
	@IsString()
	slug!: string;

	@ApiProperty({ enum: Gender })
	@IsEnum(Gender)
	gender!: Gender;

	@ApiProperty()
	@IsString()
	gender_label!: string;

	@ApiProperty()
	@IsBoolean()
	is_published!: boolean;

	@ApiProperty()
	@IsBoolean()
	is_archived!: boolean;

	@ApiPropertyOptional({ type: ResponseCategoryDto, nullable: true })
	@Type(() => ResponseCategoryDto)
	@IsOptional()
	category?: ResponseCategoryDto | null;

	@ApiPropertyOptional({ type: ResponseBrandDto, nullable: true })
	@Type(() => ResponseBrandDto)
	@IsOptional()
	brand?: ResponseBrandDto | null;

	@ApiPropertyOptional({ type: [ResponseSizeDto] })
	@Type(() => ResponseSizeDto)
	@IsOptional()
	sizes?: ResponseSizeDto[];

	@ApiPropertyOptional({ type: [ResponseProductImageDto] })
	@Type(() => ResponseProductImageDto)
	@IsOptional()
	images?: ResponseProductImageDto[];
}

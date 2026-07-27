import { ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, Type } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

import { Gender } from '../enums/gender.enum';
import { ProductSortField } from '../enums/product-sort-field.enum';
import { SortOrder } from '../enums/sort-order.enum';

const toBoolean = ({ value }: { value: unknown }): boolean | undefined => {
	if (value === undefined) return undefined;
	return value === true || value === 'true';
};

const toIntArray = ({ value }: { value: unknown }): number[] | undefined => {
	if (value === undefined) return undefined;
	const values = Array.isArray(value) ? value : [value];
	return values.map((v) => Number(v));
};

export class FiltersProductDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	search?: string;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	category_id?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	brand_id?: number;

	@ApiPropertyOptional({ enum: Gender })
	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender;

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(toBoolean)
	@IsBoolean()
	is_published?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@Transform(toBoolean)
	@IsBoolean()
	is_archived?: boolean;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	min_price?: number;

	@ApiPropertyOptional()
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	max_price?: number;

	@ApiPropertyOptional({ type: [Number] })
	@IsOptional()
	@Transform(toIntArray)
	@IsArray()
	@IsInt({ each: true })
	size_ids?: number[];

	@ApiPropertyOptional({ enum: ProductSortField })
	@IsOptional()
	@IsEnum(ProductSortField)
	sort_by?: ProductSortField;

	@ApiPropertyOptional({ enum: SortOrder })
	@IsOptional()
	@IsEnum(SortOrder)
	order?: SortOrder;

	@ApiPropertyOptional({ minimum: 1 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@ApiPropertyOptional({ minimum: 1, maximum: 100 })
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	page_size?: number;
}

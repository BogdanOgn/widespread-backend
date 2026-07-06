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
	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	category_id?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	brand_id?: number;

	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender;

	@IsOptional()
	@Transform(toBoolean)
	@IsBoolean()
	is_published?: boolean;

	@IsOptional()
	@Transform(toBoolean)
	@IsBoolean()
	is_archived?: boolean;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	min_price?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	max_price?: number;

	@IsOptional()
	@Transform(toIntArray)
	@IsArray()
	@IsInt({ each: true })
	size_ids?: number[];

	@IsOptional()
	@IsEnum(ProductSortField)
	sort_by?: ProductSortField;

	@IsOptional()
	@IsEnum(SortOrder)
	order?: SortOrder;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	page_size?: number;
}

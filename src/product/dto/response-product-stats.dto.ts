import { Type } from 'class-transformer';
import {
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class ResponsePriceStatsDto {
	@IsNumber()
	@IsOptional()
	min?: number | null;

	@IsNumber()
	@IsOptional()
	max?: number | null;

	@IsNumber()
	@IsOptional()
	avg?: number | null;
}

export class ResponseCategoryStatDto {
	@IsInt()
	id!: number;

	@IsString()
	name!: string;

	@IsInt()
	count!: number;
}

export class ResponseBrandStatDto {
	@IsInt()
	id!: number;

	@IsString()
	name!: string;

	@IsInt()
	count!: number;
}

export class ResponseGenderStatsDto {
	@IsInt()
	male!: number;

	@IsInt()
	female!: number;
}

export class ResponsePriceBucketDto {
	@IsNumber()
	from!: number;

	@IsNumber()
	@IsOptional()
	to?: number | null;

	@IsInt()
	count!: number;
}

export class ResponseProductStatsDto {
	@IsInt()
	total!: number;

	@IsInt()
	published!: number;

	@IsInt()
	archived!: number;

	@IsInt()
	drafts!: number;

	@IsInt()
	on_sale!: number;

	@Type(() => ResponsePriceStatsDto)
	@ValidateNested()
	price!: ResponsePriceStatsDto;

	@ValidateNested({ each: true })
	@Type(() => ResponseCategoryStatDto)
	by_category!: ResponseCategoryStatDto[];

	@ValidateNested({ each: true })
	@Type(() => ResponseBrandStatDto)
	by_brand!: ResponseBrandStatDto[];

	@Type(() => ResponseGenderStatsDto)
	@ValidateNested()
	by_gender!: ResponseGenderStatsDto;

	@ValidateNested({ each: true })
	@Type(() => ResponsePriceBucketDto)
	price_buckets!: ResponsePriceBucketDto[];
}

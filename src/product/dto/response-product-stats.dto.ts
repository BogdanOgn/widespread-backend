import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
	IsInt,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';

export class ResponsePriceStatsDto {
	@ApiPropertyOptional({ nullable: true })
	@IsNumber()
	@IsOptional()
	min?: number | null;

	@ApiPropertyOptional({ nullable: true })
	@IsNumber()
	@IsOptional()
	max?: number | null;

	@ApiPropertyOptional({ nullable: true })
	@IsNumber()
	@IsOptional()
	avg?: number | null;
}

export class ResponseCategoryStatDto {
	@ApiProperty()
	@IsInt()
	id!: number;

	@ApiProperty()
	@IsString()
	name!: string;

	@ApiProperty()
	@IsInt()
	count!: number;
}

export class ResponseBrandStatDto {
	@ApiProperty()
	@IsInt()
	id!: number;

	@ApiProperty()
	@IsString()
	name!: string;

	@ApiProperty()
	@IsInt()
	count!: number;
}

export class ResponseGenderStatsDto {
	@ApiProperty()
	@IsInt()
	male!: number;

	@ApiProperty()
	@IsInt()
	female!: number;
}

export class ResponsePriceBucketDto {
	@ApiProperty()
	@IsNumber()
	from!: number;

	@ApiPropertyOptional({ nullable: true })
	@IsNumber()
	@IsOptional()
	to?: number | null;

	@ApiProperty()
	@IsInt()
	count!: number;
}

export class ResponseProductStatsDto {
	@ApiProperty()
	@IsInt()
	total!: number;

	@ApiProperty()
	@IsInt()
	published!: number;

	@ApiProperty()
	@IsInt()
	archived!: number;

	@ApiProperty()
	@IsInt()
	drafts!: number;

	@ApiProperty()
	@IsInt()
	on_sale!: number;

	@ApiProperty({ type: ResponsePriceStatsDto })
	@Type(() => ResponsePriceStatsDto)
	@ValidateNested()
	price!: ResponsePriceStatsDto;

	@ApiProperty({ type: [ResponseCategoryStatDto] })
	@ValidateNested({ each: true })
	@Type(() => ResponseCategoryStatDto)
	by_category!: ResponseCategoryStatDto[];

	@ApiProperty({ type: [ResponseBrandStatDto] })
	@ValidateNested({ each: true })
	@Type(() => ResponseBrandStatDto)
	by_brand!: ResponseBrandStatDto[];

	@ApiProperty({ type: ResponseGenderStatsDto })
	@Type(() => ResponseGenderStatsDto)
	@ValidateNested()
	by_gender!: ResponseGenderStatsDto;

	@ApiProperty({ type: [ResponsePriceBucketDto] })
	@ValidateNested({ each: true })
	@Type(() => ResponsePriceBucketDto)
	price_buckets!: ResponsePriceBucketDto[];
}

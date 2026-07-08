import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductImageDto {
	@Type(() => Number)
	@IsInt()
	product_id!: number;

	@IsString()
	url!: string;

	@IsOptional()
	@IsString()
	alt?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	order?: number;
}

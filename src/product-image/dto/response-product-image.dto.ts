import { IsInt, IsOptional, IsString } from 'class-validator';

export class ResponseProductImageDto {
	@IsInt()
	id!: number;

	@IsInt()
	product_id!: number;

	@IsString()
	url!: string;

	@IsOptional()
	@IsString()
	alt?: string | null;

	@IsInt()
	order!: number;
}

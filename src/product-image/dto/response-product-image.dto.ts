import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsInt, IsOptional, IsString } from 'class-validator';

export class ResponseProductImageDto {
	@ApiProperty()
	@IsInt()
	id!: number;

	@ApiProperty()
	@IsInt()
	product_id!: number;

	@ApiProperty()
	@IsString()
	url!: string;

	@ApiPropertyOptional({ nullable: true })
	@IsOptional()
	@IsString()
	alt?: string | null;

	@ApiProperty()
	@IsInt()
	order!: number;
}

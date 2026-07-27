import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { ResponseProductDto } from './response-product.dto';

export class ListResponseProductDto {
	@ApiProperty({ type: [ResponseProductDto] })
	@ValidateNested({ each: true })
	@Type(() => ResponseProductDto)
	items!: ResponseProductDto[];

	@ApiProperty()
	@IsNumber()
	total!: number;

	@ApiProperty()
	@IsNumber()
	page!: number;

	@ApiProperty()
	@IsNumber()
	page_size!: number;

	@ApiProperty()
	@IsNumber()
	pages!: number;
}

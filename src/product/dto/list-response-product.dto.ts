import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

import { ResponseProductDto } from './response-product.dto';

export class ListResponseProductDto {
	@ValidateNested({ each: true })
	@Type(() => ResponseProductDto)
	items!: ResponseProductDto[];

	@IsNumber()
	total!: number;

	@IsNumber()
	page!: number;

	@IsNumber()
	page_size!: number;

	@IsNumber()
	pages!: number;
}

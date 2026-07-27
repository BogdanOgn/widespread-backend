import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateProductImageDto } from './create-product-image.dto';

export class UpdateProductImageDto extends PartialType(
	OmitType(CreateProductImageDto, ['product_id'] as const),
) {}

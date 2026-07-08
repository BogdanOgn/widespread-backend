import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImageService } from './product-image.service';

@Controller('images')
export class ProductImageController {
	constructor(private readonly productImageService: ProductImageService) {}

	@Get('get_images_by_product/:productId')
	findByProduct(@Param('productId', ParseIntPipe) productId: number) {
		return this.productImageService.findByProduct(productId);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productImageService.findOne(id);
	}

	@Post('')
	create(@Body() dto: CreateProductImageDto) {
		return this.productImageService.create(dto);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateProductImageDto,
	) {
		return this.productImageService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productImageService.remove(id);
	}
}

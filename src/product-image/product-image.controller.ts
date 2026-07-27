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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImageService } from './product-image.service';

@ApiTags('Product Images')
@Controller('images')
export class ProductImageController {
	constructor(private readonly productImageService: ProductImageService) {}

	@ApiOperation({ summary: 'List images for a product' })
	@ApiParam({ name: 'productId', type: Number })
	@Get('get_images_by_product/:productId')
	findByProduct(@Param('productId', ParseIntPipe) productId: number) {
		return this.productImageService.findByProduct(productId);
	}

	@ApiOperation({ summary: 'Get a product image by id' })
	@ApiParam({ name: 'id', type: Number })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productImageService.findOne(id);
	}

	@ApiOperation({ summary: 'Create a product image' })
	@Post('')
	create(@Body() dto: CreateProductImageDto) {
		return this.productImageService.create(dto);
	}

	@ApiOperation({ summary: 'Update a product image' })
	@ApiParam({ name: 'id', type: Number })
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateProductImageDto,
	) {
		return this.productImageService.update(id, dto);
	}

	@ApiOperation({ summary: 'Delete a product image' })
	@ApiParam({ name: 'id', type: Number })
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productImageService.remove(id);
	}
}

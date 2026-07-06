import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.productService.create(dto);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.productService.findOne(id);
	}

	@Get('')
	findAll(@Query() filters: FiltersProductDto) {
		return this.productService.findAll(filters);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
		return this.productService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productService.remove(id);
	}
}

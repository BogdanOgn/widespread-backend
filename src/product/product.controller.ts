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

import { Lang } from '../i18n/lang.decorator';
import { Language } from '../i18n/language.enum';

import { CreateProductDto } from './dto/create-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	create(@Body() dto: CreateProductDto, @Lang() lang: Language) {
		return this.productService.create(dto, lang);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Lang() lang: Language) {
		return this.productService.findOne(id, lang);
	}

	@Get('')
	findAll(@Query() filters: FiltersProductDto, @Lang() lang: Language) {
		return this.productService.findAll(filters, lang);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateProductDto,
		@Lang() lang: Language,
	) {
		return this.productService.update(id, dto, lang);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productService.remove(id);
	}
}

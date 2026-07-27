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
import {
	ApiHeader,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

import { Lang } from '../i18n/lang.decorator';
import { Language } from '../i18n/language.enum';

import { CreateProductDto } from './dto/create-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';
import { ListResponseProductDto } from './dto/list-response-product.dto';
import { ResponseProductStatsDto } from './dto/response-product-stats.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags('Products')
@ApiHeader({
	name: 'accept-language',
	required: false,
	enum: Language,
	description: 'Response localization language',
})
@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@ApiOperation({ summary: 'Create a product' })
	@ApiResponse({ status: 201, type: ResponseProductDto })
	@Post()
	create(@Body() dto: CreateProductDto, @Lang() lang: Language) {
		return this.productService.create(dto, lang);
	}

	@ApiOperation({ summary: 'Get aggregated product statistics' })
	@ApiResponse({ status: 200, type: ResponseProductStatsDto })
	@Get('stats')
	getStats(@Lang() lang: Language) {
		return this.productService.getStats(lang);
	}

	@ApiOperation({ summary: 'Get a product by id' })
	@ApiParam({ name: 'id', type: Number })
	@ApiResponse({ status: 200, type: ResponseProductDto })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Lang() lang: Language) {
		return this.productService.findOne(id, lang);
	}

	@ApiOperation({ summary: 'List products with filters and pagination' })
	@ApiResponse({ status: 200, type: ListResponseProductDto })
	@Get('')
	findAll(@Query() filters: FiltersProductDto, @Lang() lang: Language) {
		return this.productService.findAll(filters, lang);
	}

	@ApiOperation({ summary: 'Update a product' })
	@ApiParam({ name: 'id', type: Number })
	@ApiResponse({ status: 200, type: ResponseProductDto })
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateProductDto,
		@Lang() lang: Language,
	) {
		return this.productService.update(id, dto, lang);
	}

	@ApiOperation({ summary: 'Delete a product' })
	@ApiParam({ name: 'id', type: Number })
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.productService.remove(id);
	}
}

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

import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
	constructor(private readonly brandService: BrandService) {}

	@ApiOperation({ summary: 'Create a brand' })
	@Post()
	create(@Body() dto: CreateBrandDto) {
		return this.brandService.create(dto);
	}

	@ApiOperation({ summary: 'List all brands' })
	@Get()
	findAll() {
		return this.brandService.findAll();
	}

	@ApiOperation({ summary: 'Get a brand by id' })
	@ApiParam({ name: 'id', type: Number })
	@Get(':id')
	findById(@Param('id', ParseIntPipe) id: number) {
		return this.brandService.findById(id);
	}

	@ApiOperation({ summary: 'Update a brand' })
	@ApiParam({ name: 'id', type: Number })
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBrandDto) {
		return this.brandService.update(id, dto);
	}

	@ApiOperation({ summary: 'Delete a brand' })
	@ApiParam({ name: 'id', type: Number })
	@Delete(':id')
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.brandService.delete(id);
	}
}

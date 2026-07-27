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

import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizeService } from './size.service';

@ApiTags('Sizes')
@Controller('sizes')
export class SizeController {
	constructor(private readonly sizeService: SizeService) {}

	@ApiOperation({ summary: 'List all sizes' })
	@Get()
	findAll() {
		return this.sizeService.findAll();
	}

	@ApiOperation({ summary: 'Get a size by id' })
	@ApiParam({ name: 'id', type: Number })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.sizeService.findOne(id);
	}

	@ApiOperation({ summary: 'Create a size' })
	@Post()
	create(@Body() dto: CreateSizeDto) {
		return this.sizeService.create(dto);
	}

	@ApiOperation({ summary: 'Update a size' })
	@ApiParam({ name: 'id', type: Number })
	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSizeDto) {
		return this.sizeService.update(id, dto);
	}

	@ApiOperation({ summary: 'Delete a size' })
	@ApiParam({ name: 'id', type: Number })
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.sizeService.remove(id);
	}
}

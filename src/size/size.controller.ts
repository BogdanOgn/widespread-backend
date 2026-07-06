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

import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizeService } from './size.service';

@Controller('sizes')
export class SizeController {
	constructor(private readonly sizeService: SizeService) {}

	@Get()
	findAll() {
		return this.sizeService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.sizeService.findOne(id);
	}

	@Post()
	create(@Body() dto: CreateSizeDto) {
		return this.sizeService.create(dto);
	}

	@Patch(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSizeDto) {
		return this.sizeService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.sizeService.remove(id);
	}
}

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

import { Lang } from '../i18n/lang.decorator';
import { Language } from '../i18n/language.enum';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post('')
	create(@Body() dto: CreateCategoryDto, @Lang() lang: Language) {
		return this.categoryService.create(dto, lang);
	}

	@Get('')
	findAll(@Lang() lang: Language) {
		return this.categoryService.findAll(lang);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Lang() lang: Language) {
		return this.categoryService.findOne(id, lang);
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateCategoryDto,
		@Lang() lang: Language,
	) {
		return this.categoryService.update(id, dto, lang);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.remove(id);
	}
}

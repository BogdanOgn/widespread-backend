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
import { ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { Lang } from '../i18n/lang.decorator';
import { Language } from '../i18n/language.enum';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiHeader({
	name: 'accept-language',
	required: false,
	enum: Language,
	description: 'Response localization language',
})
@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@ApiOperation({ summary: 'Create a category' })
	@Post('')
	create(@Body() dto: CreateCategoryDto, @Lang() lang: Language) {
		return this.categoryService.create(dto, lang);
	}

	@ApiOperation({ summary: 'List all categories' })
	@Get('')
	findAll(@Lang() lang: Language) {
		return this.categoryService.findAll(lang);
	}

	@ApiOperation({ summary: 'Get a category by id' })
	@ApiParam({ name: 'id', type: Number })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number, @Lang() lang: Language) {
		return this.categoryService.findOne(id, lang);
	}

	@ApiOperation({ summary: 'Update a category' })
	@ApiParam({ name: 'id', type: Number })
	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateCategoryDto,
		@Lang() lang: Language,
	) {
		return this.categoryService.update(id, dto, lang);
	}

	@ApiOperation({ summary: 'Delete a category' })
	@ApiParam({ name: 'id', type: Number })
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoryService.remove(id);
	}
}

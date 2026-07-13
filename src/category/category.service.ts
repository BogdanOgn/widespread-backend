import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { CategoryModel } from '../generated/prisma/models';
import { Language } from '../i18n/language.enum';
import { DEFAULT_LANGUAGE } from '../i18n/resolve-language';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(
		dto: CreateCategoryDto,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseCategoryDto> {
		const category = await this.prismaService.category.create({
			data: { nameRu: dto.name_ru, nameEn: dto.name_en, slug: dto.slug },
		});
		return this.toResponse(category, lang);
	}

	async findAll(
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseCategoryDto[]> {
		const categories = await this.prismaService.category.findMany();
		return categories.map((category) => this.toResponse(category, lang));
	}

	async findOne(
		id: number,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseCategoryDto> {
		const category = await this.getOrThrow(id);
		return this.toResponse(category, lang);
	}

	async update(
		id: number,
		dto: UpdateCategoryDto,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseCategoryDto> {
		await this.getOrThrow(id);
		const category = await this.prismaService.category.update({
			where: { id },
			data: { nameRu: dto.name_ru, nameEn: dto.name_en, slug: dto.slug },
		});
		return this.toResponse(category, lang);
	}

	async remove(id: number): Promise<void> {
		await this.getOrThrow(id);

		try {
			await this.prismaService.category.delete({ where: { id } });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2003'
			) {
				throw new ConflictException(
					`Category ${id} is still assigned to products`,
				);
			}
			throw error;
		}
	}

	async getOrThrow(id: number): Promise<CategoryModel> {
		const category = await this.prismaService.category.findUnique({
			where: { id },
		});

		if (!category) {
			throw new NotFoundException(`Category ${id} not found`);
		}

		return category;
	}

	toResponse(
		category: CategoryModel,
		lang: Language = DEFAULT_LANGUAGE,
	): ResponseCategoryDto {
		return {
			id: Number(category.id),
			name: lang === Language.EN ? category.nameEn : category.nameRu,
			slug: category.slug,
		};
	}
}

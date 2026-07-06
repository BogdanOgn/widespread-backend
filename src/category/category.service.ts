import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { CategoryModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { ResponseCategoryDto } from './dto/response-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateCategoryDto): Promise<ResponseCategoryDto> {
		const category = await this.prismaService.category.create({
			data: { name: dto.name, slug: dto.slug },
		});
		return this.toResponse(category);
	}

	async findAll(): Promise<ResponseCategoryDto[]> {
		const categories = await this.prismaService.category.findMany();
		return categories.map((category) => this.toResponse(category));
	}

	async findOne(id: number): Promise<ResponseCategoryDto> {
		const category = await this.getOrThrow(id);
		return this.toResponse(category);
	}

	async update(
		id: number,
		dto: UpdateCategoryDto,
	): Promise<ResponseCategoryDto> {
		await this.getOrThrow(id);
		const category = await this.prismaService.category.update({
			where: { id },
			data: { name: dto.name, slug: dto.slug },
		});
		return this.toResponse(category);
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

	toResponse(category: CategoryModel): ResponseCategoryDto {
		return {
			id: Number(category.id),
			name: category.name,
			slug: category.slug,
		};
	}
}

import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { Prisma } from '../generated/prisma/client';
import { BrandModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

import { CreateBrandDto } from './dto/create-brand.dto';
import { ResponseBrandDto } from './dto/response-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateBrandDto): Promise<ResponseBrandDto> {
		try {
			const brand = await this.prismaService.brand.create({ data: dto });
			return this.toResponse(brand);
		} catch (error) {
			throw this.toConflictIfUniqueViolation(error, dto.slug);
		}
	}

	async findAll(): Promise<ResponseBrandDto[]> {
		const brands = await this.prismaService.brand.findMany();

		return brands.map((brand) => this.toResponse(brand));
	}

	async findById(id: number): Promise<ResponseBrandDto> {
		const brand = await this.getOrThrow(id);

		return this.toResponse(brand);
	}

	async update(id: number, dto: UpdateBrandDto): Promise<ResponseBrandDto> {
		await this.getOrThrow(id);

		try {
			const brand = await this.prismaService.brand.update({
				where: { id },
				data: dto,
			});
			return this.toResponse(brand);
		} catch (error) {
			throw this.toConflictIfUniqueViolation(error, dto.slug);
		}
	}

	async delete(id: number): Promise<void> {
		await this.getOrThrow(id);

		try {
			await this.prismaService.brand.delete({
				where: {
					id,
				},
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2003'
			) {
				throw new ConflictException(
					`Brand ${id} is still assigned to products`,
				);
			}
			throw error;
		}
	}

	async getOrThrow(id: number): Promise<BrandModel> {
		const brand = await this.prismaService.brand.findUnique({
			where: {
				id,
			},
		});

		if (!brand) {
			throw new NotFoundException(`Brand with id '${id}' not found`);
		}

		return brand;
	}

	toConflictIfUniqueViolation(error: unknown, slug?: string) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return new ConflictException(
				slug
					? `Brand with slug '${slug}' already exists`
					: 'Brand already exists',
			);
		}

		return error;
	}

	toResponse(brand: BrandModel): ResponseBrandDto {
		return {
			id: Number(brand.id),
			name: brand.name,
			slug: brand.slug,
		};
	}
}

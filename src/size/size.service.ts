import { Injectable, NotFoundException } from '@nestjs/common';

import { SizeModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

import { CreateSizeDto } from './dto/create-size.dto';
import { ResponseSizeDto } from './dto/response-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';

@Injectable()
export class SizeService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateSizeDto): Promise<ResponseSizeDto> {
		const size = await this.prismaService.size.create({ data: dto });

		return this.toResponse(size);
	}

	async findAll() {
		const sizes = await this.prismaService.size.findMany();
		return sizes.map((size) => this.toResponse(size));
	}

	async findOne(id: number): Promise<ResponseSizeDto> {
		const size = await this.getOrThrow(id);
		return this.toResponse(size);
	}

	async update(id: number, dto: UpdateSizeDto): Promise<ResponseSizeDto> {
		await this.getOrThrow(id);
		const size = await this.prismaService.size.update({
			where: { id },
			data: dto,
		});
		return this.toResponse(size);
	}

	async remove(id: number): Promise<void> {
		await this.getOrThrow(id);
		await this.prismaService.size.delete({ where: { id } });
	}

	async getOrThrow(id: number): Promise<SizeModel> {
		const size = await this.prismaService.size.findUnique({ where: { id } });

		if (!size) {
			throw new NotFoundException(`Size ${id} not found`);
		}

		return size;
	}

	toResponse(size: SizeModel): ResponseSizeDto {
		return {
			id: Number(size.id),
			name: size.name,
		};
	}
}

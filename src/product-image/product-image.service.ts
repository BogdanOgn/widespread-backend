import { Injectable, NotFoundException } from '@nestjs/common';

import { ProductImageModel } from '../generated/prisma/models';
import { PrismaService } from '../prisma/prisma.service';

import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ResponseProductImageDto } from './dto/response-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImageService {
	constructor(private readonly prisma: PrismaService) {}

	async findByProduct(productId: number): Promise<ResponseProductImageDto[]> {
		const images = await this.prisma.productImage.findMany({
			where: { productId },
			orderBy: { order: 'asc' },
		});
		return images.map((image) => this.toResponse(image));
	}

	async findOne(id: number): Promise<ResponseProductImageDto> {
		const image = await this.getOrThrow(id);
		return this.toResponse(image);
	}

	async create(dto: CreateProductImageDto): Promise<ResponseProductImageDto> {
		const product = await this.prisma.product.findUnique({
			where: { id: dto.product_id },
		});
		if (!product) {
			throw new NotFoundException(`Product ${dto.product_id} not found`);
		}

		const image = await this.prisma.productImage.create({
			data: {
				productId: dto.product_id,
				url: dto.url,
				alt: dto.alt,
				order: dto.order ?? 0,
			},
		});
		return this.toResponse(image);
	}

	async update(
		id: number,
		dto: UpdateProductImageDto,
	): Promise<ResponseProductImageDto> {
		await this.getOrThrow(id);
		const image = await this.prisma.productImage.update({
			where: { id },
			data: { url: dto.url, alt: dto.alt, order: dto.order },
		});
		return this.toResponse(image);
	}

	async remove(id: number): Promise<void> {
		await this.getOrThrow(id);
		await this.prisma.productImage.delete({ where: { id } });
	}

	private async getOrThrow(id: number): Promise<ProductImageModel> {
		const image = await this.prisma.productImage.findUnique({
			where: { id },
		});

		if (!image) {
			throw new NotFoundException(`Image ${id} not found`);
		}

		return image;
	}

	private toResponse(image: ProductImageModel): ResponseProductImageDto {
		return {
			id: Number(image.id),
			product_id: Number(image.productId),
			url: image.url,
			alt: image.alt,
			order: image.order,
		};
	}
}

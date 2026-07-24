import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';

import { BrandService } from '../brand/brand.service';
import { CategoryService } from '../category/category.service';
import { Prisma } from '../generated/prisma/client';
import { GenderEnum } from '../generated/prisma/enums';
import { ProductGetPayload } from '../generated/prisma/models';
import { Language } from '../i18n/language.enum';
import { DEFAULT_LANGUAGE } from '../i18n/resolve-language';
import { PrismaService } from '../prisma/prisma.service';
import { SizeService } from '../size/size.service';

import { CreateProductDto } from './dto/create-product.dto';
import { FiltersProductDto } from './dto/filters-product.dto';
import { ListResponseProductDto } from './dto/list-response-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseProductImageDto } from '../product-image/dto/response-product-image.dto';
import { Gender } from './enums/gender.enum';
import { ProductSortField } from './enums/product-sort-field.enum';
import { SortOrder } from './enums/sort-order.enum';
import { genderLabel } from './gender-label';
import { ResponseProductStatsDto } from './dto/response-product-stats.dto';

const GENDER_TO_ENUM: Record<Gender, GenderEnum> = {
	[Gender.MALE]: GenderEnum.MALE,
	[Gender.FEMALE]: GenderEnum.FEMALE,
};

const ENUM_TO_GENDER: Record<GenderEnum, Gender> = {
	[GenderEnum.MALE]: Gender.MALE,
	[GenderEnum.FEMALE]: Gender.FEMALE,
};

const PRODUCT_INCLUDE = {
	category: true,
	brand: true,
	sizes: true,
	images: { orderBy: { order: 'asc' } },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = ProductGetPayload<{
	include: typeof PRODUCT_INCLUDE;
}>;

const PRICE_BUCKETS: ReadonlyArray<[number, number | null]> = [
	[0, 50],
	[50, 100],
	[100, 200],
	[200, 500],
	[500, 1000],
	[1000, null],
];

@Injectable()
export class ProductService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly categoryService: CategoryService,
		private readonly brandService: BrandService,
		private readonly sizeService: SizeService,
	) {}

	async create(
		dto: CreateProductDto,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseProductDto> {
		this.assertValidPricing(dto.price, dto.sale_price);

		if (dto.category_id !== undefined && dto.category_id !== null) {
			await this.categoryService.getOrThrow(dto.category_id);
		}
		if (dto.brand_id !== undefined && dto.brand_id !== null) {
			await this.brandService.getOrThrow(dto.brand_id);
		}

		const sizeIds = dto.size_ids ?? [];
		await Promise.all(
			sizeIds.map((sizeId) => this.sizeService.getOrThrow(sizeId)),
		);

		const product = await this.withSlugConflictHandling(dto.slug, () =>
			this.prisma.product.create({
				data: {
					title: dto.title,
					description: dto.description,
					price: dto.price,
					salePrice: dto.sale_price,
					slug: dto.slug,
					gender: GENDER_TO_ENUM[dto.gender ?? Gender.MALE],
					isPublished: dto.is_published ?? false,
					isArchived: dto.is_archived ?? false,
					categoryId: dto.category_id,
					brandId: dto.brand_id,
					sizes: {
						connect: sizeIds.map((sizeId) => ({ id: sizeId })),
					},
				},
				include: PRODUCT_INCLUDE,
			}),
		);

		return this.toResponse(product, lang);
	}

	async findOne(
		id: number,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseProductDto> {
		const product = await this.getOrThrow(id);
		return this.toResponse(product, lang);
	}

	async findAll(
		filters: FiltersProductDto,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ListResponseProductDto> {
		const page = filters.page ?? 1;
		const pageSize = filters.page_size ?? 10;

		const where = this.buildWhere(filters);

		const [total, products] = await Promise.all([
			this.prisma.product.count({ where }),
			this.prisma.product.findMany({
				where,
				include: PRODUCT_INCLUDE,
				orderBy: this.buildOrderBy(filters),
				skip: (page - 1) * pageSize,
				take: pageSize,
			}),
		]);

		return {
			items: products.map((product) => this.toResponse(product, lang)),
			total,
			page,
			page_size: pageSize,
			pages: total > 0 ? Math.ceil(total / pageSize) : 0,
		};
	}

	async getStats(
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseProductStatsDto> {
		const [
			total,
			published,
			archived,
			drafts,
			onSale,
			priceAgg,
			male,
			female,
			bucketCounts,
			categoryGroups,
			brandGroups,
		] = await Promise.all([
			this.prisma.product.count(),
			this.prisma.product.count({ where: { isPublished: true } }),
			this.prisma.product.count({ where: { isArchived: true } }),
			this.prisma.product.count({
				where: { isPublished: false, isArchived: false },
			}),
			this.prisma.product.count({ where: { salePrice: { not: null } } }),
			this.prisma.product.aggregate({
				_min: { price: true },
				_max: { price: true },
				_avg: { price: true },
			}),
			this.prisma.product.count({ where: { gender: GenderEnum.MALE } }),
			this.prisma.product.count({ where: { gender: GenderEnum.FEMALE } }),
			Promise.all(
				PRICE_BUCKETS.map(([from, to]) =>
					this.prisma.product.count({
						where: {
							price: to === null ? { gte: from } : { gte: from, lt: to },
						},
					}),
				),
			),
			this.prisma.product.groupBy({
				by: ['categoryId'],
				where: { categoryId: { not: null } },
				_count: { _all: true },
			}),
			this.prisma.product.groupBy({
				by: ['brandId'],
				where: { brandId: { not: null } },
				_count: { _all: true },
			}),
		]);

		const categories = await this.prisma.category.findMany({
			where: { id: { in: categoryGroups.map((g) => g.categoryId!) } },
		});
		const byCategory = categoryGroups
			.map((g) => {
				const category = categories.find((c) => c.id === g.categoryId)!;
				return {
					id: Number(category.id),
					name: lang === Language.EN ? category.nameEn : category.nameRu,
					count: g._count._all,
				};
			})
			.sort((a, b) => b.count - a.count);

		const brands = await this.prisma.brand.findMany({
			where: { id: { in: brandGroups.map((g) => g.brandId!) } },
		});
		const byBrand = brandGroups
			.map((g) => {
				const brand = brands.find((b) => b.id === g.brandId)!;
				return {
					id: Number(brand.id),
					name: brand.name,
					count: g._count._all,
				};
			})
			.sort((a, b) => b.count - a.count);

		return {
			total,
			published,
			archived,
			drafts,
			on_sale: onSale,
			price: {
				min: priceAgg._min.price !== null ? Number(priceAgg._min.price) : null,
				max: priceAgg._max.price !== null ? Number(priceAgg._max.price) : null,
				avg:
					priceAgg._avg.price !== null
						? Math.round(Number(priceAgg._avg.price) * 100) / 100
						: null,
			},
			by_category: byCategory,
			by_brand: byBrand,
			by_gender: { male, female },
			price_buckets: PRICE_BUCKETS.map(([from, to], i) => ({
				from,
				to,
				count: bucketCounts[i],
			})),
		};
	}

	async update(
		id: number,
		dto: UpdateProductDto,
		lang: Language = DEFAULT_LANGUAGE,
	): Promise<ResponseProductDto> {
		const existing = await this.getOrThrow(id);

		const effectivePrice = dto.price ?? Number(existing.price);
		const effectiveSalePrice =
			dto.sale_price !== undefined
				? dto.sale_price
				: existing.salePrice !== null
					? Number(existing.salePrice)
					: undefined;
		this.assertValidPricing(effectivePrice, effectiveSalePrice);

		if (dto.category_id !== undefined && dto.category_id !== null) {
			await this.categoryService.getOrThrow(dto.category_id);
		}
		if (dto.brand_id !== undefined && dto.brand_id !== null) {
			await this.brandService.getOrThrow(dto.brand_id);
		}
		if (dto.size_ids !== undefined) {
			await Promise.all(
				dto.size_ids.map((sizeId) => this.sizeService.getOrThrow(sizeId)),
			);
		}

		const product = await this.withSlugConflictHandling(dto.slug, () =>
			this.prisma.product.update({
				where: { id },
				data: {
					title: dto.title,
					description: dto.description,
					price: dto.price,
					salePrice: dto.sale_price,
					slug: dto.slug,
					gender:
						dto.gender !== undefined ? GENDER_TO_ENUM[dto.gender] : undefined,
					isPublished: dto.is_published,
					isArchived: dto.is_archived,
					categoryId: dto.category_id,
					brandId: dto.brand_id,
					sizes:
						dto.size_ids !== undefined
							? { set: dto.size_ids.map((sizeId) => ({ id: sizeId })) }
							: undefined,
				},
				include: PRODUCT_INCLUDE,
			}),
		);

		return this.toResponse(product, lang);
	}

	async remove(id: number): Promise<void> {
		await this.getOrThrow(id);
		await this.prisma.product.delete({ where: { id } });
	}

	private buildWhere(filters: FiltersProductDto): Prisma.ProductWhereInput {
		const where: Prisma.ProductWhereInput = {};

		if (filters.search) {
			where.OR = [
				{ title: { contains: filters.search, mode: 'insensitive' } },
				{ description: { contains: filters.search, mode: 'insensitive' } },
			];
		}
		if (filters.category_id !== undefined) {
			where.categoryId = filters.category_id;
		}
		if (filters.brand_id !== undefined) {
			where.brandId = filters.brand_id;
		}
		if (filters.gender !== undefined) {
			where.gender = GENDER_TO_ENUM[filters.gender];
		}
		if (filters.is_published !== undefined) {
			where.isPublished = filters.is_published;
		}
		if (filters.is_archived !== undefined) {
			where.isArchived = filters.is_archived;
		}
		if (filters.min_price !== undefined) {
			where.price = { ...(where.price as object), gte: filters.min_price };
		}
		if (filters.max_price !== undefined) {
			where.price = { ...(where.price as object), lte: filters.max_price };
		}
		if (filters.size_ids && filters.size_ids.length > 0) {
			where.sizes = { some: { id: { in: filters.size_ids } } };
		}

		return where;
	}

	private buildOrderBy(
		filters: FiltersProductDto,
	): Prisma.ProductOrderByWithRelationInput {
		const order = filters.order === SortOrder.DESC ? 'desc' : 'asc';
		const column = {
			[ProductSortField.ID]: 'id',
			[ProductSortField.TITLE]: 'title',
			[ProductSortField.PRICE]: 'price',
		}[filters.sort_by ?? ProductSortField.ID];

		return { [column]: order };
	}

	private assertValidPricing(
		price: number,
		salePrice: number | null | undefined,
	): void {
		if (salePrice !== undefined && salePrice !== null && salePrice >= price) {
			throw new BadRequestException('sale_price must be less than price');
		}
	}

	private async getOrThrow(id: number): Promise<ProductWithRelations> {
		const product = await this.prisma.product.findUnique({
			where: { id },
			include: PRODUCT_INCLUDE,
		});

		if (!product) {
			throw new NotFoundException(`Product ${id} not found`);
		}

		return product;
	}

	private async withSlugConflictHandling<T>(
		slug: string | undefined,
		fn: () => Promise<T>,
	): Promise<T> {
		try {
			return await fn();
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2002'
			) {
				throw new ConflictException(`Slug '${slug}' already exists`);
			}
			throw error;
		}
	}

	private toResponse(
		product: ProductWithRelations,
		lang: Language = DEFAULT_LANGUAGE,
	): ResponseProductDto {
		const gender = ENUM_TO_GENDER[product.gender];

		return {
			id: Number(product.id),
			title: product.title,
			description: product.description,
			price: Number(product.price),
			sale_price:
				product.salePrice !== null ? Number(product.salePrice) : undefined,
			slug: product.slug,
			gender,
			gender_label: genderLabel(gender, lang),
			is_published: product.isPublished,
			is_archived: product.isArchived,
			category: product.category
				? this.categoryService.toResponse(product.category, lang)
				: null,
			brand: product.brand ? this.brandService.toResponse(product.brand) : null,
			sizes: product.sizes.map((size) => this.sizeService.toResponse(size)),
			images: product.images.map((image) => this.toImageResponse(image)),
		};
	}

	private toImageResponse(
		image: ProductWithRelations['images'][number],
	): ResponseProductImageDto {
		return {
			id: Number(image.id),
			product_id: Number(image.productId),
			url: image.url,
			alt: image.alt,
			order: image.order,
		};
	}
}

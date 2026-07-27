import { Module } from '@nestjs/common';

import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { SizeModule } from '../size/size.module';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
	imports: [CategoryModule, BrandModule, SizeModule],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}

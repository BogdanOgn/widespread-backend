import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { validateEnv } from './config/env.validation';
import { globalConfig } from './config/global.config';
import { jwtConfig } from './config/jwt.config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { SizeModule } from './size/size.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductImageModule } from './product-image/product-image.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig, jwtConfig],
      validate: validateEnv,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProductModule,
    SizeModule,
    CategoryModule,
    BrandModule,
    ProductImageModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

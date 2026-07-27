import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { MEDIA_ROOT, MEDIA_URL_PREFIX } from './upload/config/upload.constants';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.useStaticAssets(MEDIA_ROOT, { prefix: MEDIA_URL_PREFIX });
	app.use(cookieParser());
	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Widespread API')
		.setDescription('API documentation for the Widespread backend')
		.setVersion('1.0')
		.addBearerAuth()
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, swaggerDocument);

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

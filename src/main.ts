import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './shared/pipes';
import { ExceptionsHandler } from './shared/exceptions/exceptions-handler';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.setBaseViewsDir(`${process.env.ROOT_PATH}`);
	app.setViewEngine('hbs');
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new ExceptionsHandler());
	app.setGlobalPrefix('api');
	app.enableCors();

	const options = new DocumentBuilder()
		.setTitle('Tetrapak  Vindija')
		.setDescription('Tetrapak  Vindija API')
		.addTag('api')
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	await app.listen(process.env.PORT);
}
bootstrap();

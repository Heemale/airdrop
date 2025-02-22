import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import {
	SWAGGER_DESCRIPTION,
	SWAGGER_TITLE,
	SWAGGER_VERSION,
} from './config/base';

export function setupSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle(SWAGGER_TITLE)
		.setDescription(SWAGGER_DESCRIPTION)
		.setVersion(SWAGGER_VERSION)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document);
}

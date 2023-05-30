import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Meetup API')
    .setDescription('Meetup API microservices')
    .setVersion('1.0')
    .addTag('meetup')
    .addTag('auth')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);

  const configService = app.get<ConfigService>(ConfigService);

  const PORT = configService.get<string>('PORT') || 5000;
  await app.listen(PORT);
}
bootstrap();

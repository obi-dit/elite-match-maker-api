import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './exception/custom-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors();
  app.use(bodyParser.json({ limit: '60mb' }));
  app.use(bodyParser.urlencoded({ limit: '60mb', extended: true }));
  const globalPrefix = process.env.PREFIX;
  app.setGlobalPrefix(globalPrefix);
  await app.listen(process.env.PORT, () => {
    console.log('App running on Port 4000');
  });
}
bootstrap();

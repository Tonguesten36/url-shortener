import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as methodOverride from 'method-override';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {logger: ['error', 'warn', 'log']}
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.use(methodOverride('_method'));
  
  await app.listen(3000);
}
bootstrap();
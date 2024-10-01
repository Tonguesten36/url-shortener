import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlModule } from './url/url.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: "./.env" }),
    UrlModule,
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: process.env.DB_NAME,
      auth: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASS,
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

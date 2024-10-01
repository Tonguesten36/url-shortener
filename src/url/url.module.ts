import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './model/url.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name:  Url.name, schema: UrlSchema }]),
  ],
  providers: [UrlService],
  exports: [UrlService]
})
export class UrlModule {}

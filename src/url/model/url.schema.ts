import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UrlDocument = HydratedDocument<Url>;

@Schema({ collection: 'urls' })
export class Url {  
    @Prop({ required: true })
    url: string

    @Prop({ required: true })
    shortCode: string

    @Prop({ required: true, default: 0 })
    accessCounts: number    

    @Prop({ required: true, default: Date.now })
    createdAt: Date

    @Prop({ required: true, default: Date.now })
    lastAccessedAt: Date
};

export const UrlSchema = SchemaFactory.createForClass(Url);
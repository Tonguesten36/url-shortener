import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Url } from './model/url.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UrlStatistics } from 'src/share/common/types';

@Injectable()
export class UrlService {
    constructor(
        @InjectModel(Url.name) private urlModel: Model<Url>,
    ){}
    private readonly logger = new Logger(UrlService.name)
    
    // create a new shortened URL
    async createUrl(originalUrl: string): Promise<Url> {
        const newUrl = new this.urlModel({url: originalUrl});
        
        // create a shortcode for the URL
        newUrl.shortCode = Math.random().toString(36).substring(2, 8);
        newUrl.accessCounts = 0;

        const savedUrl = await newUrl.save();
        return savedUrl;
    }

    // redirect from the shortened URL to the original URL
    // Example of shortened URL: http://localhost:3000/shorten/abc123
    async redirectUrl(shortCode: string): Promise<string> {
        const originalUrl = await this.urlModel.findOne({shortCode: shortCode}).exec();

        if (!originalUrl) {
            throw new NotFoundException('Shortened URL not found');
        }
        
        originalUrl.accessCounts += 1;
        originalUrl.lastAccessedAt = new Date();

        try {
            await originalUrl.save();
        } catch (error) {
            console.error("Error saving document: ", error);
        }
        return originalUrl.url;
    }

    // update a shortened URL
    async updateUrl(shortenedUrl: string, newUrl: string): Promise<Url> {
        // Find the shortened URL based on the shortcode
        const shortCode = shortenedUrl.split('/').pop();
        
        // Find the URL based on the shortCode
        const updatedUrl = await this.urlModel.findOne({ shortCode: shortCode }).exec();
        if (!updatedUrl) {
            throw new NotFoundException('Shortened URL not found');
        }

        // Update the original URL with the new url
        updatedUrl.url = newUrl;

        // Save the updated URL
        await updatedUrl.save();

        return updatedUrl;
    }

    // delete a shortened URL
    async deleteUrl(shortCode: string): Promise<Url> {
        // If the shortened URL is not found, throw an exception
        const urlTarget = await this.urlModel.findOne({ shortCode: shortCode }).exec();
        if (!urlTarget) {
            throw new NotFoundException('Shortened URL not found');
        }

        // Delete the URL based on the shortCode
        return await this.urlModel.findOneAndDelete({ shortCode: shortCode }).exec();
    }

    async getOriginalUrl(shortCode: string): Promise<string> {

        let originalUrl = await this.urlModel.findOne({shortCode: shortCode}).exec();

        if (!originalUrl) {
            throw new NotFoundException('Shortened URL not found');
        }

        return originalUrl.url;
    }

    async getStats(shortCode: string): Promise<UrlStatistics> {
        let stats = await this.urlModel.findOne({shortCode: shortCode}).exec();

        if (!stats) {
            throw new NotFoundException('Shortened URL not found');
        }
        
        return {
            originalURL: stats.url, 
            accessCounts: stats.accessCounts, 
            lastAccessed: stats.lastAccessedAt, 
            firstCreated: stats.createdAt
        };
    }

    getShortCode(url: string): string {
        const result = url.split('/').pop();
        this.logger.log("Shortcode: " + result);
        return result;
    }
}

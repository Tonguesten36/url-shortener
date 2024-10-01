import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Put, Redirect, Render, Res } from '@nestjs/common';
import { UrlService } from './url/url.service';
import { Url } from './url/model/url.schema';
import { UpdateUrlDto, UrlDto } from './url/url.dto';
import { OriginalUrl, UrlResult, UrlStatistics } from './share/common/types';

@Controller()
export class AppController {
  constructor(
    private readonly urlService: UrlService) {}
  // Render the home page
  @Get('shorten')
  @Render('index')
  @HttpCode(200)
  renderHomePage(): void {
    return;
  }

  // Redirect to the original URL
  @Get('shorten/:shortCode')
  @HttpCode(301)
  async redirectUrl(@Res() res, @Param('shortCode') shortCode: string): Promise<any> {
    const url = await this.urlService.redirectUrl(shortCode);
    if (!url) {
      return res.status(404).send({ message: 'URL not found' });
    }
    res.redirect(url)
  } 

  // Post a new URL to shorten
  @Post('shorten')
  @Render('index')
  @HttpCode(200)
  async shortenUrl(@Body() url: UrlDto): Promise<UrlResult> {
    let newUrl = await this.urlService.createUrl(url.url);
    return {
      originalUrl: url.url,
      shortenedUrl: `${process.env.FRONTEND_URL}/shorten/${newUrl.shortCode}`, 
      shortCode: newUrl.shortCode, 
      frontend_url: process.env.FRONTEND_URL
    };
  }

  // Update the shortened URL
  @Put('shorten')
  @Render('index')
  @HttpCode(200)
  async updateUrl(@Body() updateUrlDto: UpdateUrlDto): Promise<Url> {
    const updatedUrl = this.urlService.updateUrl(updateUrlDto.shortenedUrl, updateUrlDto.newOriginalUrl);
    return updatedUrl;
  }

  // Delete shortened URL
  @Delete('shorten/:shortCode')
  @Render('index')
  async deleteUrl(@Param('shortCode') shortCode: string): Promise<any> {
      try {
        const deletedUrl = await this.urlService.deleteUrl(shortCode);

        // Return a success message if deletion is successful
        return {
            message: 'Shortened URL successfully deleted',
            deletedUrl
        };
    } catch (error) {
        // Handle and return errors
        return {
            statusCode: 404,
            message: error.message,
            error: 'Not Found'
        };
    }
  }

  // Get the original URL
  @Get('shorten/:shortCode/original')
  @HttpCode(200)
  @Render('index')
  async getOriginalUrl(@Param('shortCode') shortCode: string): Promise<OriginalUrl> {
    const originalUrl = await this.urlService.getOriginalUrl(shortCode);

    return {url: originalUrl};
  }

  // get statistics for the shortened url
  @Get('shorten/:shortCode/stats')
  @HttpCode(200)
  async getStats(@Param('shortCode') shortCode: string): Promise<UrlStatistics> {
    return this.urlService.getStats(shortCode);
  }

}

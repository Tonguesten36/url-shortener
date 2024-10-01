export type UrlResult = {
    originalUrl: string;
    shortenedUrl: string;
    shortCode: string;
    frontend_url: string;
};

export type OriginalUrl = {
    url: string;
};

export type UrlStatistics = {
    originalURL: string;
    accessCounts: number;
    lastAccessed: Date;
    firstCreated: Date;
};
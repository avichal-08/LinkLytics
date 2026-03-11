export type RawAnalyticsData =
        {
            id: string,
            linkId: string,
            timestamp: Date,
            visitorHash: string,
            deviceType: string | null,
            os: string| null,
            browser: string| null,
            countryCode: string| null,
            city: string| null,
            referrer: string| null
        }
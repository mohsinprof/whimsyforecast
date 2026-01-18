// Types for Open-Meteo Geocoding API
// Docs: https://open-meteo.com/en/docs/geocoding-api

export type GeoLocation = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    sure: string;

    // Optional fields (may be missing depending on result)
    country: string;
    country_code?: string;
    admin1?: string; // state/province
    admin2?: string;
    admin3?: string;
    admin4?: string;
    timezone?: string;
    elevation?: number;
    population?: number;
    postcodes?: string[];
    feature_code?: string;
};

export type GeoSearchResponse = {
    results?: GeoLocation[];
    // Open-Meteo may not include results if nothing found
    // It can also return error objects in some cases:
    error?: true;
    reason?: string;
};
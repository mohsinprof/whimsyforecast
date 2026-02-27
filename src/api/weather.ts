import { API_CONFIG } from"./config";
import type { Coordinates, ForecastData, GeocodingResponse, Weatherdata } from "./types";



class WeatherApi{
    private createUrl(endpoint:string,
        params:Record<string,string|number>
    ){
        const searchParams = new URLSearchParams(
            Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {})
        );
        return `${endpoint}?${searchParams.toString()}`

        
    }
    private async fetchData<T>(url:string):Promise<T>
    {
        const response = await fetch(url);
        if(!response.ok){
            const errorBody = await response.json().catch(() => null);
            const message = errorBody?.error || errorBody?.message || `API request failed with status ${response.status}`;
            throw new Error(`${message} (status ${response.status})`);
    }
        return response.json();
    }

    async getCurrentWeather({lat,lon}:Coordinates):Promise<Weatherdata>{
        const url = this.createUrl(API_CONFIG.WEATHER_PROXY_URL,{
            type: "current",
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units,

    });
        return this.fetchData<Weatherdata>(url);
}
    async getForecast({lat,lon}:Coordinates):Promise<ForecastData>{
    const url = this.createUrl(API_CONFIG.WEATHER_PROXY_URL,{
            type: "forecast",
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units,

    });
        return this.fetchData<ForecastData>(url);
    }
    async reverseGeocode({lat, lon}: Coordinates):Promise<GeocodingResponse[]> {
        const url = this.createUrl(API_CONFIG.WEATHER_PROXY_URL, {
            type: "reverse",
            lat: lat.toString(),
            lon: lon.toString(),
            limit: "1",
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
    async searchLocation(
        query:string)
    : Promise<GeocodingResponse[]> {
        const url = this.createUrl(API_CONFIG.WEATHER_PROXY_URL, {
            type: "search",
            q: query,
            limit: "10",
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
}

export const weatherApi = new WeatherApi();

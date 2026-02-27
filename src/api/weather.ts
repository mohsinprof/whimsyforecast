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

    private getApiKey(): string {
        if (!API_CONFIG.API_KEY) {
            throw new Error("Missing VITE_OPENWEATHER_API_KEY in root .env");
        }
        return API_CONFIG.API_KEY;
    }

    async getCurrentWeather({lat,lon}:Coordinates):Promise<Weatherdata>{
        const url = this.createUrl(`${API_CONFIG.WEATHER_BASE_URL}/weather`,{
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units,
            appid: this.getApiKey(),

    });
        return this.fetchData<Weatherdata>(url);
}
    async getForecast({lat,lon}:Coordinates):Promise<ForecastData>{
    const url = this.createUrl(`${API_CONFIG.WEATHER_BASE_URL}/forecast`,{
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units,
            appid: this.getApiKey(),

    });
        return this.fetchData<ForecastData>(url);
    }
    async reverseGeocode({lat, lon}: Coordinates):Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO_BASE_URL}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: "1",
            appid: this.getApiKey(),
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
    async searchLocation(
        query:string)
    : Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO_BASE_URL}/direct`, {
            q: query,
            limit: "10",
            appid: this.getApiKey(),
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
}

export const weatherApi = new WeatherApi();



import { API_CONFIG } from"./config";
import type { Coordinates, ForecastData, GeocodingResponse, Weatherdata } from "./types";



class WeatherApi{
    private createUrl(endpoint:string,
        params:Record<string,string|number>
    ){
        const searchParams = new URLSearchParams({
            appid:API_CONFIG.API_KEY,
            ...params
        });
        return `${endpoint}?${searchParams.toString()}`

        
    }
    private async fetchData<T>(url:string):Promise<T>
    {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(`API request failed with status ${response.status}`);
    }
        return response.json();
    }
    async getCurrentWeather({lat,lon}:Coordinates):Promise<Weatherdata>{
        const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`,{
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units

    });
        return this.fetchData<Weatherdata>(url);
}
    async getForecast({lat,lon}:Coordinates):Promise<ForecastData>{
     const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`,{
            lat : lat.toString(),
            lon : lon.toString(),
            units:API_CONFIG.DEFAULT_PARAMS.units

    });
        return this.fetchData<ForecastData>(url);
    }
    async reverseGeocode({lat, lon}: Coordinates):Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO_BASE_URL}/reverse`, {
            lat: lat.toString(),
            lon: lon.toString(),
            limit: "1"
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
    async searchLocation(
        query:string)
    : Promise<GeocodingResponse[]> {
        const url = this.createUrl(`${API_CONFIG.GEO_BASE_URL}/direct`, {
            q: query,
            limit: "10"
            });
        return this.fetchData<GeocodingResponse[]>(url);
    }
}

export const weatherApi = new WeatherApi();

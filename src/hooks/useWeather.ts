import type { Coordinates } from "@/api/types";
import { weatherApi } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

export const WEATHER_KEY = {
    weather: (coords: Coordinates) => ["weather", coords] as const,
    forecast: (coords: Coordinates) => ["forecast", coords] as const,
    location: (coords: Coordinates) => ["location", coords] as const,
    search: (query: string) => ["search", query] as const,


} as const;


export function useWeatherQuery(coordinates: Coordinates | null) {
   return useQuery({
        queryKey: WEATHER_KEY.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherApi.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates, // Only run the query if coordinates are available
        
    })
    
}
export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
         queryKey: WEATHER_KEY.forecast(coordinates ?? { lat: 0, lon: 0 }),
         queryFn: () => coordinates ? weatherApi.getForecast(coordinates) : null,
         enabled: !!coordinates, // Only run the query if coordinates are available
         
     })
     
}
export function useReverseGeocodingQuery(coordinates: Coordinates | null) {
    return useQuery({
         queryKey: WEATHER_KEY.location(coordinates ?? { lat: 0, lon: 0 }),
         queryFn: () => coordinates ? weatherApi.reverseGeocode(coordinates) : null,
         enabled: !!coordinates, // Only run the query if coordinates are available
         
     })
     
}
 
export function useSearchLocationQuery(query: string) { 
    return useQuery({
        queryKey: WEATHER_KEY.search(query),
        queryFn: () => weatherApi.searchLocation(query),
        enabled: query.length > 3
    })
    
    
}
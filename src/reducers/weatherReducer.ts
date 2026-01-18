import type {RecentCity} from "../utils/recentCities.ts";
import type {CurrentWeatherData, ForecastDay} from "../types/weather.ts";
import type {GeoLocation} from "../types/geo.ts";

export type WeatherState = {
    query: string;
    searching: boolean
    results: GeoLocation[]
    selected: RecentCity | null
    loadingWeather: boolean;
    current: CurrentWeatherData | null
    forecast: ForecastDay[]
    recent: RecentCity[]
    error: string | null
};
export type WeatherAction =
    | { type: "SET_QUERY"; payload: string }
    | { type: "SEARCH_START" }
    | { type: "SEARCH_SUCCESS"; payload: GeoLocation[] }
    | { type: "SEARCH_ERROR"; payload: string }
    | { type: "SELECT_CITY"; payload: RecentCity }
    | { type: "WEATHER_START" }
    | {
    type: "WEATHER_SUCCESS";
    payload: { current: CurrentWeatherData; forecast: ForecastDay[] };
}
    | { type: "WEATHER_ERROR"; payload: string }
    | { type: "LOAD_RECENT"; payload: RecentCity[] }
    | { type: "SET_RECENT"; payload: RecentCity[] };

export const initialState: WeatherState = {
    query: "",
    searching: false,
    results: [],
    selected: null,
    loadingWeather: false,
    current: null,
    forecast: [],
    recent: [],
    error: null,

}

export function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
    switch (action.type) {
        case "SET_QUERY":
            return {
                ...state, query: action.payload, error: "reached in query ",
            };
        case "SEARCH_START":
            return {
                ...state, searching: true,
                results: [], error: "searched is started",
            };

        case "SEARCH_SUCCESS":
            return {
                ...state, searching: false,
                results: action.payload,
                error: null,

            };
        case "SEARCH_ERROR":
            return {
                ...state, searching: false, error: action.payload
            }
        case "SELECT_CITY":
            return {
                ...state, selected: action.payload, results: [], current: null, forecast: [], error: null,
            };
        case "WEATHER_START":
            return {
                ...state, loadingWeather: true, error: null,
            }
        case "WEATHER_SUCCESS":
            return {
                ...state, loadingWeather: false
                , current: action.payload.current, forecast: action.payload.forecast,
                error: null
            };
        case "WEATHER_ERROR":
            return {
                ...state,
                loadingWeather: false,
                error: action.payload,
            };


        case "LOAD_RECENT":
            return {
                ...state,
                recent: action.payload,
            };


        case "SET_RECENT":
            return {
                ...state,
                recent: action.payload,
            };
        default:
            return state;

    }
}
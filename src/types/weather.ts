export type CurrentWeatherData = {
    temperature: number;
    temperature_2m: number;
    wind_speed_10m: number; weather_code: number;
}
export type ForecastDay = { date: string; min: number; max: number; weatherCode: number }
export type ForecastResponse = {
    current: CurrentWeatherData;
    daily: { time: string[]; temperature_2m_min: number[]; temperature_2m_max: number[]; weather_code: number[]; };
}



import type { GeoLocation, GeoSearchResponse } from "../types/geo.ts";
import type {
	CurrentWeatherData,
	ForecastDay,
	ForecastResponse,
} from "../types/weather.ts";

export async function searchLocation(name: string): Promise<GeoLocation[]> {
	const p = name.trim();
	if (p.length < 2) {
		return [];
	}
	const url =
		"https://geocoding-api.open-meteo.com/v1/search" +
		`?name=${encodeURIComponent(p)}` +
		"&count=10" +
		"&language=en" +
		"&format=json";
	const rec = await fetch(url);
	if (!rec.ok) {
		throw new Error(`Geocoding API error: ${rec.status} ${rec.statusText}`);
	}
	const data: GeoSearchResponse = await rec.json();
	console.log(data.results);
	return data.results ?? [];
}

export async function fetchForecast(
	latt: number,
	lott: number,
): Promise<{
	current: CurrentWeatherData;
	days: ForecastDay[];
}> {
	const url =
		"https://api.open-meteo.com/v1/forecast" +
		`?latitude=${latt}` +
		`&longitude=${lott}` +
		"&current=temperature_2m,weather_code,wind_speed_10m" +
		"&daily=temperature_2m_max,temperature_2m_min,weather_code" +
		"&forecast_days=5" +
		"&timezone=auto";
	const rec = await fetch(url);
	if (!rec.ok) {
		throw new Error(`Forecas failed ((${rec.status})`);
	}
	const data: ForecastResponse = await rec.json();
	if (!data.current || !data.daily) {
		throw new Error("unexpected forecast response");
	}
	const n = Math.min(
		data.daily.time.length,
		data.daily.temperature_2m_min.length,
		data.daily.temperature_2m_max.length,
		data.daily.weather_code.length,
	);
	const days: ForecastDay[] = Array.from({ length: n }, (_, i) => ({
		date: data.daily.time[i],
		min: data.daily.temperature_2m_min[i],
		max: data.daily.temperature_2m_max[i],
		weatherCode: data.daily.weather_code[i],
	}));
	console.log("you seccuess fetched", data);
	return { current: data.current, days };
}

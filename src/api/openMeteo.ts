import type { GeoLocation, GeoSearchResponse } from "../types/geo.ts";
import type {
	CurrentWeatherData,
	ForecastDay,
	ForecastResponse,
} from "../types/weather.ts";

const geoCache = new Map<string, GeoLocation[]>();
let geoController: AbortController | null = null;

const forecastCache = new Map<
	string,
	{
		current: CurrentWeatherData;
		days: ForecastDay[];
	}
>();
let forecastController: AbortController | null = null;

export async function searchLocation(name: string): Promise<GeoLocation[]> {
	const query = name.trim();
	if (query.length < 2) {
		return [];
	}
	const cacheKey = query.toLowerCase();
	const cached = geoCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	if (geoController) {
		geoController.abort();
	}
	geoController = new AbortController();

	const url =
		"https://geocoding-api.open-meteo.com/v1/search" +
		`?name=${encodeURIComponent(query)}` +
		"&count=10" +
		"&language=en" +
		"&format=json";

	try {
		const rec = await fetch(url, { signal: geoController.signal });
		if (!rec.ok) {
			throw new Error(`Geocoding API error: ${rec.status} ${rec.statusText}`);
		}
		const data: GeoSearchResponse = await rec.json();
		const results = data.results ?? [];
		geoCache.set(cacheKey, results);
		return results;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			return [];
		}
		throw error;
	} finally {
		geoController = null;
	}
}

export async function fetchForecast(
	latt: number,
	lott: number,
): Promise<{
	current: CurrentWeatherData;
	days: ForecastDay[];
}> {
	const key = `${latt.toFixed(3)},${lott.toFixed(3)}`;
	const cached = forecastCache.get(key);
	if (cached) {
		return cached;
	}

	if (forecastController) {
		forecastController.abort();
	}
	forecastController = new AbortController();

	const url =
		"https://api.open-meteo.com/v1/forecast" +
		`?latitude=${latt}` +
		`&longitude=${lott}` +
		"&current=temperature_2m,weather_code,wind_speed_10m" +
		"&daily=temperature_2m_max,temperature_2m_min,weather_code" +
		"&forecast_days=5" +
		"&timezone=auto";
	try {
		const rec = await fetch(url, { signal: forecastController.signal });
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
		const current = { ...data.current };
		const result = { current, days };
		forecastCache.set(key, result);
		return result;
	} catch (error) {
		if (error instanceof DOMException && error.name === "AbortError") {
			const cachedResult = forecastCache.get(key);
			if (cachedResult) {
				return cachedResult;
			}
			throw error;
		}
		throw error;
	} finally {
		forecastController = null;
	}
}

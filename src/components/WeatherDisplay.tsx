import type { RecentCity } from "../utils/recentCities.ts";
import type { CurrentWeatherData, ForecastDay } from "../types/weather.ts";

type WeatherDisplayProps = {
	selected: RecentCity | null;
	loading: boolean;
	error: string | null;
	current: CurrentWeatherData | null;
	forecast: ForecastDay[];
};
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
	selected,
	loading,
	error,
	current,
	forecast,
}) => {
	if (!selected) {
		return <p>Select a city to see weather</p>;
	}

	function formateCityLabel(city: RecentCity) {
		return `${city.name}${city.admin1 ? `, ${city.admin1}` : ""}, ${city.country}`;
	}
	const formatDate = (iso: string) => {
		const d = new Date(iso);
		return isNaN(d.getTime())
			? iso
			: d.toLocaleDateString(undefined, {
					weekday: "short",
					month: "short",
					day: "numeric",
				});
	};
	return (
		<section>
			<h2>{formateCityLabel(selected)}</h2>
			{loading && <p>Loading weather </p>}
			{!loading && error && <p style={{ color: "red" }}>{error}</p>}
			{!loading && current && (
				<div style={{ border: "1px solid #ddd", padding: "10px" }}>
					<h3>Current Weather</h3>
					<p>Temperature:{current.temperature_2m}</p>
					<p>Wind:{current.wind_speed_10m}</p>
					<p>Weather code:{current.weather_code}</p>
				</div>
			)}
			{!loading && forecast.length > 0 && (
				<div>
					<h3>Next Days</h3>
					<ul
						style={{ padding: 0, listStyle: "none", display: "grid", gap: 8 }}
					>
						{forecast.map((day) => (
							<li
								key={day.date}
								style={{
									border: "1px soild #eee",
									padding: 10,
									borderRadius: 8,
								}}
							>
								<strong>{formatDate(day.date)}</strong>
								<div>
									Min:{day.min}°C | Max:{day.max}°C | code:{day.weatherCode}
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
};

export default WeatherDisplay;

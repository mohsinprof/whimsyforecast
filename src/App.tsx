import { useEffect, useReducer } from "react";
import { fetchForecast } from "./api/openMeteo.ts";
import "./App.css";
import CityList from "./components/CityList.tsx";
import Form from "./components/Form.tsx";
import RecentCities from "./components/RecentCities.tsx";
import WeatherDisplay from "./components/WeatherDisplay.tsx";
import { initialState, weatherReducer } from "./reducers/weatherReducer.ts";
import type { GeoLocation } from "./types/geo.ts";
import {
	addRecentCity,
	loadRecentCities,
	type RecentCity,
	saveRecentCities,
} from "./utils/recentCities.ts";
const toRecentCity = (item: GeoLocation): RecentCity => ({
	id: item.id,
	name: item.name,
	country: item.country,
	admin1: item.admin1,
	latitude: item.latitude,
	longitude: item.longitude,
});
const App = () => {
	const [state, dispatch] = useReducer(weatherReducer, initialState);

	useEffect(() => {
		const recent = loadRecentCities();
		dispatch({ type: "LOAD_RECENT", payload: recent });
	}, []);
	const selectCityAndFetch = async (city: RecentCity, bumpRecent = true) => {
		if (bumpRecent) {
			const next = addRecentCity(state.recent, city);
			dispatch({ type: "SET_RECENT", payload: next });
			saveRecentCities(next);
		}

		dispatch({ type: "SELECT_CITY", payload: city });
		dispatch({ type: "WEATHER_START" });
		try {
			const data = await fetchForecast(city.latitude, city.longitude);
			dispatch({
				type: "WEATHER_SUCCESS",
				payload: { current: data.current, forecast: data.days },
			});
		} catch (e) {
			const message = e instanceof Error ? e.message : "unknown error";
			dispatch({ type: "WEATHER_ERROR", payload: message });
		}
	};
	const handleSelectResult = (item: GeoLocation) => {
		const city = toRecentCity(item);
		void selectCityAndFetch(city, true);
	};

	return (
		<div>
			<div className="weatherapp">
				<h1>Weather App</h1>

				<Form dispatch={dispatch} state={state} />
			</div>
			<div className="recentcities">
				<RecentCities
					items={state.recent}
					onSelect={(city) => void selectCityAndFetch(city)}
				/>
			</div>{" "}
			<div
				className="citylist"
				style={{ display: state.results.length === 0 ? "none" : "block" }}
			>
				<CityList
					items={state.results}
					onSelect={handleSelectResult}
					error={state.error}
				/>
			</div>{" "}
			<div className="weatherdisplay">
				<WeatherDisplay
					selected={state.selected}
					loading={state.loadingWeather}
					error={state.error}
					current={state.current}
					forecast={state.forecast}
				/>
			</div>
		</div>
	);
};

export default App;

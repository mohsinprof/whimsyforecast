import CurrentWeather from "@/components/CurrentWeather";
import { Error } from "@/components/Error";
import FavouriteCities from "@/components/FavouriteCities";
import ForecastDetails from "@/components/ForcastDetails";
import HourlyTempreture from "@/components/HourlyTempreture";
import LocationSkeleton from "@/components/location-sekleton";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/WeatherDetails";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useForecastQuery, useReverseGeocodingQuery, useWeatherQuery } from "@/hooks/useWeather";
import { RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";

export default function WeatherDashboard() {
	
	const {
		coordinates,
		getLocation,
	} = useGeolocation();
	const locationQuery = useReverseGeocodingQuery(coordinates);
	const weatherQuery = useWeatherQuery(coordinates);
	const forecastQuery = useForecastQuery(coordinates);

	const countRef = useRef(0)
	
	useEffect(() => {
		if (!weatherQuery.data || !forecastQuery.data) {
			const interval = setInterval(async () => {
				try { await getLocation(); } catch (error) {
					console.error("Error fetching location:", error);
				}
				countRef.current += 1;
				locationQuery.refetch();
				
			}, 10000);
			return () => clearInterval(interval);
		}
	}, [weatherQuery.data, forecastQuery.data, getLocation, locationQuery]);
	
	function handlerefresh() {
		getLocation();
		if (coordinates) {
			//refetch weather data based on new 
			locationQuery.refetch();
			weatherQuery.refetch();
			forecastQuery.refetch();

			
		}
	}
	const LocationName = locationQuery.data?.[0];
	if (weatherQuery.isError || forecastQuery.isError) {
		return (
			<div className="space-y-4 items-center justify-center">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
					<strong className="font-bold">Error! </strong>
					<span className="block sm:inline ">Failed to fetch weather data.</span>
				</div>
				<Button onClick={handlerefresh} variant={"outline"} className="group bg-spring-green-400 hover:bg-spring-green-700 dark:hover:bg-spring-green-400 text-black hover:text-white dark:text-white dark:hover:text-black ">Retry</Button>	
			</div>
		)
	}
	if (!coordinates  || !weatherQuery.data || !forecastQuery.data) {
		return <LocationSkeleton  />;
	}
	
	

	return (<>
		
		<Error handlerefresh={getLocation} />
		

		<div className=" space-y-4">
			<FavouriteCities/>

			<div className="flex items-end  mr-0">
				<Button
					variant={"outline"}
					size={"icon"}
					className=" group bg-spring-green-400 hover:bg-spring-green-700 dark:hover:bg-spring-green-400"
					onClick={handlerefresh}
					disabled={ weatherQuery.isFetching || forecastQuery.isFetching}
				>
					<RefreshCw className={`h-4 w-4 text-black dark:text-white group-hover:text-white dark:group-hover:text-black ${forecastQuery.isFetching || weatherQuery.isFetching  ? "animate-spin" : ""}`} />
				</Button>
			</div>
				<div className="grid gap-6">
					<div className="flex flex-col lg:flex-row gap-4">
						<CurrentWeather data={weatherQuery.data} locationName={LocationName} />
						<HourlyTempreture data={forecastQuery.data} />
					</div>
					<div className="grid gap-6 md:grid-cols-2 items-start">
					
					<WeatherDetails data={weatherQuery.data} />
					<ForecastDetails data={forecastQuery.data} />
				</div>
			</div>
		</div>

		</>
	);
}

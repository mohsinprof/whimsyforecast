import CurrentWeather from "@/components/CurrentWeather";
import FavouriteButton from "@/components/FavouriteButton";
import ForecastDetails from "@/components/ForcastDetails";
import HourlyTempreture from "@/components/HourlyTempreture";
import LocationSkeleton from "@/components/location-sekleton";
import WeatherDetails from "@/components/WeatherDetails";
import { useForecastQuery, useWeatherQuery } from "@/hooks/useWeather";
import { useParams, useSearchParams } from "react-router-dom";

const City = () => {
  const [ searchParams ] = useSearchParams();
  const params =useParams()
  const lat = parseFloat(searchParams.get("lat") || "30");
  const lon = parseFloat(searchParams.get("lon") || "70");
  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates)
  const forecastQuery = useForecastQuery(coordinates)
  


  if (!weatherQuery.data || !forecastQuery.data||!params.name) {
  return <LocationSkeleton/>
}


  return (
    <>
      <div className="flex items- gap-6">
      <h2 className="text-3xl font-bold tracking-tighter"> {params.name}</h2>

      <FavouriteButton data={{...weatherQuery.data,name:params.name}} />
</div>
    <div className="grid gap-6">
          <div className="flex flex-col lg:flex-row gap-4">
						<CurrentWeather data={weatherQuery.data}  />
						<HourlyTempreture data={forecastQuery.data} />
					</div>
					<div className="grid gap-6 md:grid-cols-2 items-start">
					
					<WeatherDetails data={weatherQuery.data} />
					<ForecastDetails data={forecastQuery.data} />
        </div>
      </div>  
    </>
    
  )
}

export default City
import type { GeocodingResponse, Weatherdata } from "@/api/types"
import { Card, CardContent } from "./ui/card";
import { useTemp } from "./context/tempreture-context";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";



interface CurrentWeatherProps {
    data: Weatherdata;
    locationName?: GeocodingResponse;
}
const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
    const { unit } = useTemp()
    const {
        weather: [currentweather],
        main: { temp, feels_like, temp_min, temp_max, humidity },
        wind: { speed },
    } = data;

    const convertTemp = (celsius: number, unit: "C" | "F") => {
        if (unit === "C") return Math.round(celsius);
        return Math.round((celsius * 9) / 5 + 32);
    }



    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

    return (

        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">

                                <h2 className="text-2xl font-bold tracking-tighter"> {locationName?.name}</h2>

                                {locationName?.state && <span className="text-muted-foreground ">, {locationName?.state}</span>}

                            </div>

                            {/* full name of a country */}
                             
                            <p className="text-sm text-muted-foreground">
                            {regionNames.of(locationName?.country??data?.sys?.country)}
                            </p>


                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{convertTemp(temp, unit)}°{unit}</span>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground ">Feels like {convertTemp(feels_like, unit)}°{unit}</p>
                                <div className="flex gap-2 text-sm font-medium">
                                    <span className="flex items-center gap-1 text-spring-green-600 dark:text-spring-green-400">
                                        <ArrowDown className="h-3 w-3" />
                                        {convertTemp(temp_min, unit)}°{unit}
                                    </span>
                                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                        <ArrowUp className="h-3 w-3 " />
                                        {convertTemp(temp_max, unit)}°{unit}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-300" />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium ">Humidity</p>
                                    <p className="text-sm text-muted-foreground">{humidity}%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Wind className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium ">Wind Speed</p>
                                    <p className="text-sm text-muted-foreground">{speed} m/s</p>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative flex aspect-square w-full  max-w-50 items-center  justify-center">    
                            <img src={`https://openweathermap.org/img/wn/${currentweather.icon}@4x.png`}
                                alt={currentweather.description}
                                className="h-full w-full object-contain"
                            />
                            <div className="absolute bottom-0 text-center">
                                <p className="text-sm font-medium capitalize">
                                    {currentweather.description}
                                </p>

                            </div>
                        </div>
                    </div>

                </div>


            </CardContent>
        </Card>


    )
}

export default CurrentWeather
import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { useTemp } from "./context/tempreture-context";

interface ForecastDetailsProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const ForecastDetails = ({ data }: ForecastDetailsProps) => {
  const { unit } = useTemp();

  const convertTemp = (celsius: number, unit: "C" | "F") => {
    if (unit === "C") return Math.round(celsius);
    return Math.round((celsius * 9) / 5 + 32);
  };

  const dailyForcasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        date: forecast.dt,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
      };
    } else {
      acc[date].temp_min = Math.min(
        acc[date].temp_min,
        forecast.main.temp_min
      );
      acc[date].temp_max = Math.max(
        acc[date].temp_max,
        forecast.main.temp_max
      );
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForcasts).slice(1, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {nextDays.map((day) => (
            <div
              key={day.date}
              className="
                grid 
                grid-cols-1 
                sm:grid-cols-3 
                gap-3 
                rounded-lg 
                border 
                p-3 
                sm:p-4
                items-start 
                sm:items-center
              "
            >
              {/* Date + Description */}
              <div className="space-y-1">
                <p className="font-medium">
                  {format(new Date(day.date * 1000), "EEE, MMM d")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                  {day.weather.description}
                </p>
              </div>

              {/* Temperature Section */}
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-2 sm:items-center">
                <span className="flex items-center text-spring-green-600 dark:text-spring-green-400 text-sm">
                  <ArrowDown className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {convertTemp(day.temp_min, unit)}°{unit}
                </span>

                <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
                  <ArrowUp className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  {convertTemp(day.temp_max, unit)}°{unit}
                </span>
              </div>

              {/* Humidity + Wind */}
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-2 sm:items-center">
                <span className="flex items-center gap-1 text-xs sm:text-sm">
                  <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 dark:text-blue-300" />
                  {day.humidity}%
                </span>

                <span className="flex items-center gap-1 text-xs sm:text-sm">
                  <Wind className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 dark:text-green-300" />
                  {day.wind} m/s
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastDetails;
import type { ForecastData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useTemp } from "./context/tempreture-context";

interface HourlyTempretureProps {
  data: ForecastData;
}

const HourlyTempreture = ({ data }: HourlyTempretureProps) => {
  const { unit } = useTemp();

  const convertTemp = (celsius: number, unit: "C" | "F") => {
    if (unit === "C") return Math.round(celsius);
    return Math.round((celsius * 9) / 5 + 32);
  };

  const chartData =
    data?.list?.slice(0, 8).map((item) => ({
      time: format(new Date(item.dt * 1000), "ha"),
      temp: convertTemp(item.main.temp, unit),
      feels_like: convertTemp(item.main.feels_like, unit),
    })) || [];

  return (
    <Card className="w-full min-w-0 min-h-0 lg:basis-[60%] lg:flex-none">
      <CardHeader>
        <CardTitle>Today's Forecast</CardTitle>
      </CardHeader>

      <CardContent className="w-full h-[280px] min-h-[280px] min-w-0">
        {/* IMPORTANT: fixed height container */}
        <div className="w-full h-full min-w-0">
          <ResponsiveContainer width="100%" height={220} minWidth={280} minHeight={220}>
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                              stroke="var(--muted-foreground)"
                              tickCount={2}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                stroke="var(--muted-foreground)"
                              fontSize={12}
                              domain={['dataMin - 2', 'dataMax + 2']}

                              tickCount={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°${unit}`}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const temp = payload.find(
                      (p) => p.dataKey === "temp"
                    )?.value;

                    const feels = payload.find(
                      (p) => p.dataKey === "feels_like"
                    )?.value;

                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            Temperature
                          </span>
                          <span className="font-bold">
                            {temp}°{unit}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            Feels like
                          </span>
                          <span className="font-bold">
                            {feels}°{unit}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="temp"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="var(--primary)"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTempreture;
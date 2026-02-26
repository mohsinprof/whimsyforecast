import { useGeolocation } from "@/hooks/useGeolocation";
import { AlertTriangle, MapPin } from "lucide-react";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { useReverseGeocodingQuery } from "@/hooks/useWeather";

interface ErrorProps {
    handlerefresh: () => void;
}

export const Error = ({ handlerefresh }: ErrorProps) => {
    const { coordinates } = useGeolocation();
    const locationQuery=useReverseGeocodingQuery(coordinates);
    
   
    
    if (!coordinates || locationQuery.isError) {
        return (
            /* We add p-2 or py-2 to make it a "thin" line */
            <Alert variant="destructive" className="bg-black/10 border-spring-green-400 p-2 py-3">
                
                <div className=" group flex items-center w-full whitespace-nowrap">
                    
                    {/* Left side: Icon + Text */}
                    <div className="group flex items-center gap-2 flex-1 mr-4">
                        <AlertTriangle className="h-4 w-4 shrink-0 " />
                        <span className="text-sm font-medium">
                            Enable location access to see your local weather.
                        </span>
                    </div>

                    {/* Right side: Button at the very end */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto shrink-0 h-8  hover:bg-spring-green-700 hover:text-white dark:bg-spring-green-800 dark:hover:bg-spring-green-600 dark:hover:text-white transition-colors"
                        onClick={handlerefresh}
                    >
                        <MapPin className="h-3 w-3 mr-2" />
                        Enable Location
                    </Button>
                    
                </div>
            </Alert>
        );
    }
    return null;
};
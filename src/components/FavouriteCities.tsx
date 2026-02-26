import { useFavourite } from "@/hooks/useFavourite";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useWeatherQuery } from "@/hooks/useWeather";
import { Loader, X} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FavouriteCityCardProps {
    id: string;
    name: string;
    lat: number;
    lon: number;
    onRemove: (id: string) => void;
}


function FavouriteCities() {
    const{favourites,removeFavourite}=useFavourite()
    
    if(!favourites.length){
        return null;
    }
    
    return (
        <>
            <h1 className="text-xl font-bold tracking-tight">Favourites</h1>
            <ScrollArea className="w-full pb-4">
                <div className="flex gap-4">
                    {favourites.map((fav) => (
                        <FavouriteCityCard
                            key={fav.id}
                            {...fav}
                            onRemove={() => removeFavourite.mutate(fav.id)}
                        />
                    ))}

                </div>

            </ScrollArea>
        </>
    );
}

function FavouriteCityCard({ id, name, lat, lon, onRemove }: FavouriteCityCardProps) {
    const navigate = useNavigate();
    const { data: weather, isLoading } = useWeatherQuery({ lat, lon })
    return (
        <div
            onClick={() => navigate(`/city/${name}?lat=${lat}&lon=${lon}`)}
            className="relative flex min-w-62.5 cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
            role="button"
            tabIndex={0}>
            <Button
                variant={"ghost"}
                size={"icon"}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                    toast.error(`${name} removed from favourites`)
                }}
                className="absolute right-1 top-1 h-6 w-6 rounded-full p-0
            hover:text-destructive-foreground group-hover:opacity-100">
            <X className="h-4 w-4 "/>

            </Button>
            {isLoading ? (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Loader className="h-4 w-4 animate-spin"/>
            </div>
            ) : weather ? (<>
                    <div className="flex items-center gap-2">
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                            className="h-8 w-8" />
                        <div>
                            <p className="text-sm font-medium">{name}</p>
                            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
                       <p className="text-xs">{weather.weather[0].description}</p>
                        </div>
                        
            </div>
            
            
            </>) : null}
        </div>
    )
    
}

export default FavouriteCities;
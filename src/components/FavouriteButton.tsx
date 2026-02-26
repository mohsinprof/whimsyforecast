import type { Weatherdata } from "@/api/types"
import { useFavourite } from "@/hooks/useFavourite"
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavouriteButtonProps {
    data: Weatherdata
}

const FavouriteButton = ({ data }: FavouriteButtonProps) => {
    const { addToFavourites, isFavourite, removeFavourite } = useFavourite();
    const isCurrentlyFavourite = isFavourite(data.coord.lat, data.coord.lon);
    const handleToggleFavourite = () => {
       if(isCurrentlyFavourite){
        removeFavourite.mutate(`${data.coord.lat}-${data.coord.lon}`)
        toast.error(`${data.name} removed from favourites`)
       } else {
        addToFavourites.mutate({
            name: data.name,
            lat: data.coord.lat,
            lon: data.coord.lon,
            country: data.sys.country,
            
        })
        toast.success(`${data.name} added to favourites`)
       }
   }
    return (
        <Button
    onClick={handleToggleFavourite}
    variant={isCurrentlyFavourite ? "default":"outline"}
    size={"icon"}
    className={isCurrentlyFavourite ? "bg-amber-400 hover:bg-amber-300" :""}
    > 
        <Star 
            className={`h-4 w-4 ${isCurrentlyFavourite ? "fill-current": ""}`}
            
        />
        
    </Button>
    )
}
export default FavouriteButton
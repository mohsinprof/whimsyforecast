import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStroage";
interface FavouriteItem {
    id: string;
    name: string;
    lat: number;
    lon: number;
    
    country: string;
    state?: string;
    AddedAt: number;
}
export function useFavourite() {

    const [favourites, setFavourites] = useLocalStorage<FavouriteItem[]>("favourite", []);
    const queryClient = useQueryClient();
   const favouritesQuery = useQuery({
        queryKey: ["favourites"],
        queryFn: () => favourites,
       initialData: favourites,
        staleTime: Infinity, // Data never goes stale
    })
    const addToFavourites = useMutation({
        mutationFn: async (favourite: Omit<FavouriteItem, "id" | "AddedAt">       )   => {
            const newFavourite: FavouriteItem = {
                ...favourite,
                id: `${favourite.lat}-${favourite.lon}`,
                AddedAt: Date.now(),
            };
            const exists = favourites.some((fav)=> fav.id === newFavourite.id)
                  if (exists) {
                    return newFavourite; // Already in favourites, do nothing
                  }
                  const updatedFavourites = [ ...favourites, newFavourite].slice(0, 10);
            setFavourites(updatedFavourites);
            return newFavourite;
            

        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"]

            })
        }
        
    })
    const removeFavourite = useMutation({
        mutationFn: async (id: string) => {
            const updatedFavourites = favourites.filter(fav => fav.id !== id);
            setFavourites(updatedFavourites);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favourites"]
            })
        }
    })
    return {
        favourites: favouritesQuery.data??[],
        addToFavourites,
        removeFavourite,
        isFavourite: (lat: number, lon: number) => 
            favourites.some(fav => fav.lat === lat && fav.lon === lon)
    }
    
}
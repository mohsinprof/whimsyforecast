import { Button } from "./ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Clock, Loader, Search, Star, XCircle } from "lucide-react";
import { useSearchLocationQuery } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import  { format } from "date-fns";
import { useEffect, useState } from "react";
import { useFavourite } from "@/hooks/useFavourite";

const CitySearch = () => { 

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const {favourites}=useFavourite()
    const { data: locations, isLoading } = useSearchLocationQuery(query);
    const { searchHistory, addToSearchHistory, clearSearchHistory,refetchSearchHistory } = useSearchHistory();
    useEffect(() => {
        if (open) {
            refetchSearchHistory();
        }
    },[open,refetchSearchHistory])
    const handleSelect = (cityData: string) => {
        const [lat, lon, name, country] = cityData.split("|");
        addToSearchHistory.mutate({
            query,
            name,lat: parseFloat(lat),lon: parseFloat(lon),
            country
})
         setQuery("");
        setOpen(false);
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
       
    }

    return (
        <>
            <Button onClick={() => setOpen(true)}
                variant={"outline"}
                className="relative  justify-start text-sm text-muted-foreground sm:pr-1 md:w-50 lg:w-64"
            >
                <Search className="h-4 w-4 mr-2" />
                Search City....
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search for city...."
                    value={query}
                onValueChange={setQuery}/>
                <CommandList>
                    {query.length > 3 && isLoading && (<CommandEmpty>No cities found.</CommandEmpty>)}
                    <CommandGroup heading="favorites">
                    {favourites.map((location) => {
                                return (
                                    <CommandItem key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Search className="h-4 w-4 mr-2"  />
                                        <span> {location.name}, {location.country}</span>
                                        {location.state && <span className="text-muted-foreground">, {location.state}</span>}
                                        <Star className={"h-4 w-4 ml-auto bg-amber-400 "}  />
                                    </CommandItem>)
                            })}
                                    
                        
                    </CommandGroup>
                    
                    {searchHistory.length > 0 && (<><CommandSeparator /><CommandGroup heading="recent cities">
                        <div className="flex items-center justify-between px-2 my-2">
                            <p
                                className="text-xs text-muted-foreground"
                            >Recent Searches</p>
                        <Button variant="ghost" size="sm" onClick={() => clearSearchHistory.mutate()} className="h-4 w-4">
                            <XCircle className="h-4 w-4" />
                        </Button>
                        </div>
                        {searchHistory.map((location) => {
                                return (
                                    <CommandItem key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Clock className="h-4 w-4 mr-2" />
                                        <span> {location.name}, {location.country}</span>
                                        {location.state && <span className="text-muted-foreground">, {location.state}</span>
                                        }
                                        <span className="text-xs text-muted-foreground ml-auto">{ format(location.searchedAt, "MMM dd, h:mm a")}</span>
                                    </CommandItem>)
                            })}
                        
                    </CommandGroup></>)}
                    <CommandSeparator />

                    {locations && locations.length > 0 && (
                        <CommandGroup heading="suggestions">
                            {isLoading && (
                                <div className="p-4 text-center text-sm text-muted-foreground">
                                <Loader className=" h-4 w-4 animate-spin" />
                                </div>
                            )}
                            {locations.map((location) => {
                                return (
                                    <CommandItem key={`${location.lat}-${location.lon}`}
                                        value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                                        onSelect={handleSelect}
                                    >
                                        <Search className="h-4 w-4 mr-2"  />
                                        <span> {location.name}, {location.country}</span>
                                    {location.state && <span className="text-muted-foreground">, {location.state}</span>}
                                    </CommandItem>)
                            })}


                        
                        
                        
                    </CommandGroup>)}
                </CommandList>
            </CommandDialog>
        </>
    )
}
export default CitySearch;
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStroage";
interface SearchHistoryItem {
    id: string;
    query: string;
    lat: number;
    lon: number;
    name: string;
    country: string;
    state?: string;
    searchedAt: number;
}
export function useSearchHistory() {

    const [searchHistory, setSearchHistory] = useLocalStorage<SearchHistoryItem[]>("searchHistory", []);
    const queryClient = useQueryClient();
   const searchHistoryQuery = useQuery({
        queryKey: ["searchHistory"],
        queryFn: () => searchHistory,
        initialData: searchHistory,
    })
    const addToSearchHistory = useMutation({
        mutationFn: async (search: Omit<SearchHistoryItem, "id" | "searchedAt">       )   => {
            const newEntry: SearchHistoryItem = {
                ...search,
                id: `${search.lat}-${search.lon}-${Date.now()}`,
                searchedAt: Date.now(),
            };
            const filteredHistory = searchHistory.filter(
                (item) => !(item.lat === search.lat && item.lon === search.lon))
            const updatedHistory = [newEntry, ...filteredHistory].slice(0, 10);
            setSearchHistory(updatedHistory);
            console.log("Updated search history:", updatedHistory);
            console.log("New entry added to search history:", newEntry);
            return newEntry;    
        },
        onSuccess: () => {
            queryClient.setQueryData(["searchHistory"],[])
        }
        
    })
    const clearSearchHistory = useMutation({
        mutationFn: async () => {
            setSearchHistory([]);
        },
        onSuccess: () => {
            queryClient.setQueryData(["searchHistory"], []);
        }
    })
    const refetchSearchHistory = searchHistoryQuery.refetch;
    return {
        searchHistory: searchHistoryQuery.data??[],
        addToSearchHistory,
        clearSearchHistory,
        refetchSearchHistory,
    }
    
}
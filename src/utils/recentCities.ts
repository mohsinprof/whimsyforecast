export type RecentCity = {
    id: number, name: string, country: string, admin1?: string, latitude: number, longitude: number
}
const STOORAGE_KEY = "recentCities"

export function loadRecentCities(): RecentCity[] {
    try {
        const raw = localStorage.getItem(STOORAGE_KEY);
        if (!raw) return []
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed as RecentCity[];
    } catch {
        return []
    }
}

export function saveRecentCities(cities: RecentCity[]): void {
    localStorage.setItem(STOORAGE_KEY, JSON.stringify(cities))
}

export function addRecentCity(list: RecentCity[], city: RecentCity): RecentCity[] {
    const withoutDup = list.filter((c) => c.id !== city.id);
    const next = [city, ...withoutDup];
    return next.slice(0, 5);
}
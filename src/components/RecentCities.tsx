import type {RecentCity} from "../utils/recentCities.ts";
import * as React from "react";

type RecentCitiesProps = {
    items: RecentCity[];
    onSelect: (city: RecentCity) => void
}


const RecentCities: React.FC<RecentCitiesProps> = ({items, onSelect}) => {
    if (items.length === 0) return null

    return (
        <section>
            <h3>Recent City</h3>
            <ul style={{display: "flex", gap: 8, flexWrap: "wrap", padding: 0, listStyle: "none"}}>
                {items.map((city) => {
                    const label = `${city.name}${city.admin1 ? `,${city.admin1}` : ""},${city.country}`;
                    return (
                        <li key={city.id}>
                            <button type={"button"} onClick={() => onSelect(city)}>{label}</button>
                        </li>
                    )
                })}
            </ul>
        </section>
    );
};

export default RecentCities;
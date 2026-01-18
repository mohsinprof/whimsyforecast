import * as React from "react";
import type {GeoLocation} from "../types/geo.ts";

interface CityListProps {

    items: GeoLocation[];
    error: string | null;
    onSelect: (item: GeoLocation) => void
}

const CityList: React.FC<CityListProps> = ({items, error, onSelect}) => {
    if (items.length === 0 && !error) return null
    return (
        <div>
            <h3>search result</h3>
            {error && <p style={{color: "red"}}>{error}</p>}
            <ul>
                {items.map((item) => {
                    const label = `${item.name}${item.admin1 ? `, ${item.admin1}` : ""}, ${item.country ?? ""}`;
                    return (
                        <li key={item.id}>
                            <button type={"button"} onClick={() => onSelect(item)}>{label}</button>
                        </li>
                    );
                })}            </ul>

        </div>
    );
};

export default CityList;
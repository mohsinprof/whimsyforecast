import * as React from "react";
import { useState, useEffect } from "react";
import type { GeoLocation } from "../types/geo.ts";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";
import img7 from "../assets/img7.png";
import img8 from "../assets/img8.png";
import img9 from "../assets/img9.png";

interface CityListProps {
	items: GeoLocation[];
	error: string | null;
	onSelect: (item: GeoLocation) => void;
}

const images = [img1, img2, img3, img4, img5, img7, img8, img9];

const CityList: React.FC<CityListProps> = ({ items, error, onSelect }) => {
	// Pick a random image for the initial load
	const [currentIndex, setCurrentIndex] = useState(() =>
		Math.floor(Math.random() * images.length),
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => {
				let nextIndex;
				// Ensure the next random image is different from the current one
				do {
					nextIndex = Math.floor(Math.random() * images.length);
				} while (nextIndex === prevIndex);
				return nextIndex;
			});
		}, 50000);

		return () => clearInterval(interval);
	}, []);

	const backgroundStyle: React.CSSProperties = {
		backgroundImage: `url(${images[currentIndex]})`,
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		// "Small" size settings:
		backgroundSize: "contain",
		width: "100%",
		height: "200px",
		transition: "background-image 0.8s ease",
	};

	if (items.length === 0 && !error) {
		return (
			<div>
				{" "}
				Always check weather before going outside
				<div style={backgroundStyle}></div>{" "}
			</div>
		);
	}

	return (
		<div>
			<h3>search result</h3>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<ul>
				{items.map((item) => (
					<li key={item.id}>
						<button type="button" onClick={() => onSelect(item)}>
							{item.name}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CityList;

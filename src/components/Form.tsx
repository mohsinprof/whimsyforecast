import * as React from "react";
import { type FormEvent } from "react";
import { searchLocation } from "../api/openMeteo.ts";
import type {
	WeatherAction,
	WeatherState,
} from "../reducers/weatherReducer.ts";
import "./components.css";

interface FormProps {
	state: WeatherState;
	dispatch: React.Dispatch<WeatherAction>;
}

const Form: React.FC<FormProps> = ({ dispatch, state }) => {
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const query = state.query.trim();
		if (query.length <= 2 || state.searching) return;
		try {
			dispatch({ type: "SEARCH_START" });
			const results = await searchLocation(query);
			dispatch({ type: "SEARCH_SUCCESS", payload: results });
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}
			const message = error instanceof Error ? error.message : "unknown error";
			dispatch({ type: "SEARCH_ERROR", payload: message });
		}
	};

	return (
		<div className="form">
			<form onSubmit={handleSubmit}>
				<input
					value={state.query}
					onChange={(e) =>
						dispatch({ type: "SET_QUERY", payload: e.target.value })
					}
				/>
				<button
					className="search-button"
					type={"submit"}
					disabled={state.searching || state.query.trim().length <= 2}
				>
					{state.searching ? "searching...." : "search"}
				</button>
			</form>
		</div>
	);
};

export default Form;

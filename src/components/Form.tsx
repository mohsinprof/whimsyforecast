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
	const handlesubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (state.query.length > 2) {
			try {
				dispatch({ type: "SEARCH_START" });
				const results = await searchLocation(state.query);
				dispatch({ type: "SEARCH_SUCCESS", payload: results });
			} catch (e) {
				const message = e instanceof Error ? e.message : "unknown error";
				dispatch({ type: "SEARCH_ERROR", payload: message });
			}
		}
	};

	return (
		<div className="form">
			<form onSubmit={handlesubmit}>
				<input
					value={state.query}
					onChange={(e) =>
						dispatch({ type: "SET_QUERY", payload: e.target.value })
					}
				/>
				<button
					className="search-button"
					type={"submit"}
					disabled={state.searching}
				>
					{state.searching ? "searching...." : "search"}
				</button>
			</form>
		</div>
	);
};

export default Form;

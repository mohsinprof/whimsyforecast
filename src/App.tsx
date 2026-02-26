import { BrowserRouter, Routes,Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/context/theme-provider";
import WeatherDashboard from "./pages/WeatherDashboard";
import City from "./pages/city";
import{QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TempProvider } from "./components/context/tempreture-context";
import { Toaster } from "sonner";
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			
			staleTime: 5 * 60 * 1000, // 5 minutes
			 gcTime: 10 * 60 * 1000, // 10 minutes
		retry: false, // Disable automatic retries
			refetchOnWindowFocus: false, // Disable refetching on window focus
		},
	}
})
const App = () => {
	return (
		<QueryClientProvider client={queryClient}>

			<BrowserRouter>
				<TempProvider>
			<ThemeProvider defaultTheme="system">
				<Layout>
					<Routes>
						<Route path="/" element={<WeatherDashboard />} />
						<Route path="/city/:name" element={<City />} />
					</Routes>
						</Layout>
						<Toaster richColors/>
					</ThemeProvider>
					</TempProvider>
		</BrowserRouter>
		<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
};

export default App;

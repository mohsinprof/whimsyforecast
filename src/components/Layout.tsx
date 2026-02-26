import type { PropsWithChildren } from "react";
import { Header } from "./Header";

const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="bg-gradient-to-br from-background to-muted">
			<Header/>
			<main className="min-h-screen container mx-auto px-4 py-8 ">
				{children}
			</main>
			<footer className="border-t backdrop-blur py-8 dark:bg-gray-900">
				<div className="container mx-auto px-4 text-center dark:text-zinc-100 text-zinc-500">
					<p>Made with ❤️ by Mohsin</p>
				</div>
			</footer>
		</div>
	);
};

export default Layout;

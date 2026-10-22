import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { SiProvider } from "@si";
import { App } from "./showcase/App";
import "./showcase/showcase.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<SiProvider>
			<App />
		</SiProvider>
	</StrictMode>,
);

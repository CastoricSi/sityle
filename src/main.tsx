import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@si/base.css";
import { App } from "./showcase/App";
import "./showcase/showcase.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "ldrs/ring";
import "./app.css";

import { SocketProvider } from "./components/SocketContext";
import Spinner from "./components/Spinner";
import { ToastProvider } from "./components/ToastContext";

const Home = lazy(() => import("./routes/home.jsx"));
const Chat = lazy(() => import("./routes/chat.jsx"));

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<ToastProvider>
				<SocketProvider>
					<Suspense fallback={<Spinner />}>
						<Routes>
							<Route path="/chat" element={<Chat />} />
							<Route path="/*" element={<Home />} />
						</Routes>
					</Suspense>
				</SocketProvider>
			</ToastProvider>
		</BrowserRouter>
	</StrictMode>,
);

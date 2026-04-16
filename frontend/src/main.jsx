import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "ldrs/ring";
import "./app.css";

import { SocketProvider } from "./components/SocketContext";
import Spinner from "./components/Spinner";

const Home = lazy(() => import("./routes/home.jsx"));
const Chat = lazy(() => import("./routes/chat.jsx"));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/chat" element={<Chat />} />
            <Route path="/*" element={<Home />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>
);

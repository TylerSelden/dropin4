import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";

import { SocketProvider } from "./components/SocketContext";

import Home from "./routes/home";
import Chat from "./routes/chat";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </StrictMode>
);

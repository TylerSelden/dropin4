import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	envDir: "../",
	server: {
		port: 8080,
		host: true,
		proxy: {
			"/socket.io": {
				target: "http://localhost:8081",
				ws: true,
			},
		},
	},
});

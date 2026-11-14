import { existsSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import express from "express";
import { Server } from "socket.io";
import { Assert } from "../shared/schemas.js";
import { Cleanup, Debug, Err, Info } from "./src/db.js";
import { Events } from "./src/events.js";

const PORT = process.env.PORT || 8080;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "*",
	},
	transports: ["websocket", "polling"],
});

const distPath = path.resolve(import.meta.dirname, "../frontend/dist");

if (process.env.NODE_ENV === "production") {
	if (!existsSync(path.resolve(import.meta.dirname, "../frontend/dist"))) {
		Err("Frontend build not found. Please run `npm run build` first.");
		process.exit(1);
	}

	app.use(express.static(distPath));
	app.get("/{*splat}", (_req, res) => {
		res.sendFile(path.join(distPath, "index.html"));
	});
}

io.on("connection", (socket) => {
	Debug(`New user connected: ${socket.id}`);
	socket.data.username = {};

	for (const [event, { schema, handler }] of Object.entries(Events)) {
		socket.on(event, async (message, ack) => {
			try {
				Debug(`${event} event fired by ${socket.id}`);

				const label = schema.describe().flags?.label || "Request Object";
				Assert(schema, label, message);
				await handler(io, socket, message);
				if (ack) ack();
			} catch (err) {
				const details =
					err.details?.[0].message || err.message || "Generic error";
				Err(`Error handling event ${event} from ${socket.id}: ${details}`);
				socket.emit("err", details);
			}
		});
	}

	socket.on("disconnect", () => {
		Debug(`User disconnected: ${socket.id}`);
	});
});

setInterval(
	() => {
		Cleanup();
	},
	(process.env.DB_CLEANUP_INTERVAL || 24) * 1000 * 60 * 60,
);

httpServer.listen(PORT, () => {
	Info(`HTTP server initialized on port ${PORT}`);
});

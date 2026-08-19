import http from "http";
import https from "https";
import { Server } from "socket.io";
import mongoConnect from "./utils/services/db/mongo-connect.ts";
import syncAnalyticsIndexes from "./utils/services/db/sync-analytics-indexes.ts";
import app from "./app.ts";
import { socket } from "./socket/socket.ts";
import { corsOrigins, PORT } from "./config/config.ts";
import { authenticateSession } from "./utils/services/auth/authenticate-session.ts";

let server: http.Server | https.Server;

// Node comme SERVEUR (pour le frontend)
console.log("🌐 Starting HTTP server for frontend...");
server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: corsOrigins, credentials: true },
  cookie: true,
});

io.use(async (socket, next) => {
  try {
    const cookies = Object.fromEntries(
      (socket.request.headers.cookie || "")
        .split(";")
        .map((part) => part.trim().split("="))
        .filter(([key, value]) => key && value)
        .map(([key, value]) => [key, decodeURIComponent(value)]),
    );
    socket.data.accessToken = cookies.accessToken;
    socket.data.auth = await authenticateSession(cookies.accessToken);
    next();
  } catch {
    next(new Error("unauthorized"));
  }
});

mongoInit();

async function mongoInit() {
  console.log("Connecting to MongoDB...");
  await mongoConnect();
  await syncAnalyticsIndexes();

  server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur  http//localhost:${PORT}`);
  });

  socket(io);
}

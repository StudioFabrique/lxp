import http from "http";
import https from "https";
import { Server } from "socket.io";
import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";
import { socket } from "./socket/socket";
import { corsOrigins, PORT } from "./config/config";

let server: http.Server | https.Server;

// Node comme SERVEUR (pour le frontend)
console.log("🌐 Starting HTTP server for frontend...");
server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: corsOrigins, credentials: true },
  cookie: true,
});

io.use((socket, next) => {
  const cookie = socket.request.headers.cookie;
  next();
});

mongoInit();

async function mongoInit() {
  console.log("Connecting to MongoDB...");
  await mongoConnect();

  server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur  http//localhost:${PORT}`);
  });

  socket(io);
}

import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { Agent } from "undici";
import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";
import { socket } from "./socket/socket";
import { corsOrigins, HTTPS_ENABLED, PORT } from "./config/config";

let server: http.Server | https.Server;

// Node comme SERVEUR (pour le frontend)
if (HTTPS_ENABLED) {
  console.log("🔒 Starting HTTPS server for frontend...");

  const httpsOptions = {
    key: fs.readFileSync("./certs/node-server-key.pem"),
    cert: fs.readFileSync("./certs/node-server-cert.pem"),
  };

  server = https.createServer(httpsOptions, app);
} else {
  console.log("🌐 Starting HTTP server for frontend...");
  server = http.createServer(app);
}

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
    console.log(
      `🚀 Serveur démarré sur ${
        HTTPS_ENABLED ? "https" : "http"
      }://localhost:${PORT}`,
    );
  });

  socket(io);
}

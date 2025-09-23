import http from "http";
import https from "https";
import fs from "fs";
import { Server } from "socket.io";
import { Agent } from "undici";
import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";
import { socket } from "./socket/socket";

const PORT = process.env.PORT || 7001;
const HTTPS_ENABLED = process.env.HTTPS_ENABLED === "true";
const MTLS_TO_FASTAPI = process.env.MTLS_TO_FASTAPI === "true";

let server: http.Server | https.Server;

// Node comme SERVEUR (pour le frontend)
if (HTTPS_ENABLED) {
  console.log("🔒 Starting HTTPS server for frontend...");

  const httpsOptions = {
    key: fs.readFileSync("./certs/node-server-key.pem"), // ✅ Bon nom
    cert: fs.readFileSync("./certs/node-server-cert.pem"), // ✅ Bon nom
  };

  server = https.createServer(httpsOptions, app);
} else {
  console.log("🌐 Starting HTTP server for frontend...");
  server = http.createServer(app);
}

// Agent pour Node comme CLIENT (vers FastAPI) - Version Undici
export const fastApiAgent = MTLS_TO_FASTAPI
  ? new Agent({
      connect: {
        cert: fs.readFileSync("./certs/node-client-cert.pem"),
        key: fs.readFileSync("./certs/node-client-key.pem"),
        ca: fs.readFileSync("./certs/ca-cert.pem"),
        rejectUnauthorized: true,
        servername: "localhost",
      },
    })
  : null;

// Reste du code identique...
const origins =
  process.env.ENVIRONMENT === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        ...(HTTPS_ENABLED
          ? [
              "https://localhost:5173",
              "https://localhost:5174",
              "https://localhost:5175",
            ]
          : []),
      ];

export const io = new Server(server, {
  cors: { origin: origins, credentials: true },
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
      }://localhost:${PORT}`
    );
  });

  socket(io);
}

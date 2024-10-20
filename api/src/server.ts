import http from "http";
//import https from "https";
import { Server } from "socket.io";

import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";
import { socket } from "./socket/socket";

const PORT = process.env.PORT || 5001;

let server!: any;

server = http.createServer(app);

const origins =
  process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ];

export const io = new Server(server, {
  cors: {
    origin: origins,
    credentials: true,
  },
  cookie: true,
});
io.use((socket, next) => {
  const cookie = socket.request.headers.cookie;
  next();
});

mongoInit();

async function mongoInit() {
  await mongoConnect();
  server.listen(PORT);
 
  
  console.log(`Serveur démarré sur le port: ${PORT}`);
  socket(io);
}

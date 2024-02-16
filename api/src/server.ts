import http from "http";
//import https from "https";
import { Server } from "socket.io";

import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";
import { socket } from "./socket/socket";

const PORT = 5001;

let server!: any;

/* if (process.env.NODE_ENV === "production") {
  server = https.createServer(app);
} else {
  server = http.createServer(app);
} */

server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:4173",
      "https://lxp.aldeveloper.fr",
    ],
    credentials: true,
  },
  cookie: true,
});
io.use((socket, next) => {
  const cookie = socket.request.headers.cookie;
  console.log({ cookie });
  next();
});

mongoInit();

async function mongoInit() {
  await mongoConnect();
  server.listen(PORT);
  console.log(`Serveur démarré sur le port: ${PORT}`);
  socket(io);
}

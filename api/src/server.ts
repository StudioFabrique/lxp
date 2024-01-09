import http from "http";
import https from "https";

import mongoConnect from "./utils/services/db/mongo-connect";
import app from "./app";

const PORT = 5001;

let server!: any;

if (process.env.NODE_ENV === "production") {
  server = https.createServer(app);
} else {
  server = http.createServer(app);
}

mongoInit();

async function mongoInit() {
  await mongoConnect();
  server.listen(PORT);
  console.log(`Serveur démarré sur le port: ${PORT}`);
}

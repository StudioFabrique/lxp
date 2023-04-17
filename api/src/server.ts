import http from "http";
import https from "https";

import mongoConnect from "./utils/services/db/mongoConnect";
import app from "./app";

const PORT = 5000;

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

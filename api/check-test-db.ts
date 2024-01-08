// checkDB.ts

import net from "net";

const checkDB = () => {
  const client = net.createConnection({ port: 5433, host: "localhost" });

  client.on("connect", () => {
    console.log("La base de données est disponible");
    process.exit(0);
  });

  client.on("error", () => {
    console.log("La base de données n'est pas encore disponible. Attente...");
    setTimeout(checkDB, 1000);
  });
};

checkDB();

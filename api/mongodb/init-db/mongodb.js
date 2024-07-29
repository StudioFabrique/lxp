const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../../.env") });

console.log(process.env.POSTGRES_PASSWORD);

db.createUser({
  user: "studio-lxp",
  pwd: "Tata1234",
  roles: [
    {
      role: "readWrite",
      db: "lxp",
    },
  ],
});

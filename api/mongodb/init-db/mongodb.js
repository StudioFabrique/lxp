const path = require("path");
require("dotenv").config();

console.log("hello mongodb");
console.log(process.env.POSTGRES_PASSWORD);

db.createUser({
  user: process.env.MONGO_USERNAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_DATABASE,
    },
  ],
});

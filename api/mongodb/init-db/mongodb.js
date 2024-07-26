db.createUser({
  user: "studio-lxp",
  pwd: "Tata1234",
  roles: [
    {
      role: "readWriteDatabase",
      db: "lxp",
    },
  ],
});

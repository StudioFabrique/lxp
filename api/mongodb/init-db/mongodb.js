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

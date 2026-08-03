import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.ts";
import Permission from "../src/utils/interfaces/db/permission.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";

describe("CASL API authorization", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });

  it("returns 401 without a valid session", async () => {
    await request(app).get("/v1/formation").expect(401);
  });

  it("returns 403 for an authenticated ability without the route rule", async () => {
    const login = await request(app)
      .post("/v1/auth/login")
      .send({
        email: "apprenant@studio.eco",
        password: "Abcdef@123456",
      })
      .expect(200);

    await request(app)
      .get("/v1/permission/role")
      .set("Cookie", login.headers["set-cookie"])
      .expect(403);
  });

  it("applies a role change immediately with the same JWT", async () => {
    const login = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" })
      .expect(200);
    const cookie = login.headers["set-cookie"];

    await request(app)
      .get("/v1/formation")
      .set("Cookie", cookie)
      .expect(200);

    const [adminRole, permission] = await Promise.all([
      Role.findOne({ role: "admin" }),
      Permission.findOne({ name: "read:formation" }),
    ]);
    if (!adminRole || !permission) throw new Error("RBAC fixtures are missing");

    try {
      await Role.updateOne(
        { _id: adminRole._id },
        { $pull: { permissions: permission._id } },
      );
      await request(app)
        .get("/v1/formation")
        .set("Cookie", cookie)
        .expect(403);
    } finally {
      await Role.updateOne(
        { _id: adminRole._id },
        { $addToSet: { permissions: permission._id } },
      );
    }
  });
});

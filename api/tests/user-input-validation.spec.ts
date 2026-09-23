import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.ts";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import User from "../src/utils/interfaces/db/user.ts";
import Hobby from "../src/utils/interfaces/db/hobby.ts";
import Link from "../src/utils/interfaces/db/link.ts";

describe("validation et propriété des données du profil", () => {
  let studentCookie: string;
  let otherCookie: string;
  let studentId: string;
  let otherId: string;
  const createdHobbies: string[] = [];
  const createdLinks: string[] = [];

  beforeAll(async () => {
    await mongoConnect();
    const student = await User.findOne({ email: "apprenant@studio.eco" });
    const other = await User.findOne({ email: "rssi@studio.eco" });
    studentId = student!._id.toString();
    otherId = other!._id.toString();

    const login = async (email: string) => {
      const response = await request(app)
        .post("/v1/auth/login")
        .send({ email, password: "Abcdef@123456" })
        .expect(200);
      return response.headers["set-cookie"][0] as string;
    };
    studentCookie = await login("apprenant@studio.eco");
    otherCookie = await login("rssi@studio.eco");
  });

  afterAll(async () => {
    await Hobby.deleteMany({ _id: { $in: createdHobbies } });
    await Link.deleteMany({ _id: { $in: createdLinks } });
    await User.updateMany(
      { _id: { $in: [studentId, otherId] } },
      { $pull: { hobbies: { $in: createdHobbies }, links: { $in: createdLinks } } },
    );
    await mongoose.disconnect();
  });

  it("rejette une adresse de réinitialisation invalide", async () => {
    await request(app)
      .put("/v1/user/reset-password")
      .send({ email: "invalide" })
      .expect(400);
  });

  it("rejette un nouveau mot de passe faible avant l'écriture", async () => {
    await request(app)
      .put("/v1/user/profile/password")
      .set("Cookie", studentCookie)
      .send({ oldPass: "Abcdef@123456", newPass: "abc" })
      .expect(400);
  });

  it("crée un centre d'intérêt pour le compte connecté et protège sa suppression", async () => {
    await request(app)
      .post("/v1/user/hobby")
      .set("Cookie", studentCookie)
      .send({ title: "", id: otherId })
      .expect(400);

    const response = await request(app)
      .post("/v1/user/hobby")
      .set("Cookie", studentCookie)
      .send({ title: "Lecture", id: otherId })
      .expect(201);
    const hobbyId = response.body.data._id as string;
    createdHobbies.push(hobbyId);
    expect(String((await Hobby.findById(hobbyId))?.user)).toBe(studentId);

    await request(app)
      .delete(`/v1/user/hobby/${hobbyId}`)
      .set("Cookie", otherCookie)
      .expect(404);
    expect(await Hobby.exists({ _id: hobbyId })).toBeTruthy();

    await request(app)
      .delete(`/v1/user/hobby/${hobbyId}`)
      .set("Cookie", studentCookie)
      .expect(200);
  });

  it("crée un lien pour le compte connecté et protège sa suppression", async () => {
    await request(app)
      .post("/v1/user/social-network")
      .set("Cookie", studentCookie)
      .send({ url: "javascript:alert(1)", id: otherId })
      .expect(400);

    const response = await request(app)
      .post("/v1/user/social-network")
      .set("Cookie", studentCookie)
      .send({ url: "https://example.com", id: otherId })
      .expect(201);
    const linkId = response.body.data._id as string;
    createdLinks.push(linkId);
    expect(String((await Link.findById(linkId))?.user)).toBe(studentId);

    await request(app)
      .delete(`/v1/user/social-network/${linkId}`)
      .set("Cookie", otherCookie)
      .expect(404);
    expect(await Link.exists({ _id: linkId })).toBeTruthy();

    await request(app)
      .delete(`/v1/user/social-network/${linkId}`)
      .set("Cookie", studentCookie)
      .expect(200);
  });
});

import request from "supertest";
import app from "../src/app.ts";

const templates = [
  ["csv-competences-modele.csv", "description,formation,parcours"],
  ["csv-objectifs-modele.csv", "description"],
  [
    "csv-users-group-modele.csv",
    "email;firstname;lastname;nickname;birthDate;address;postCode;city;phoneNumber",
  ],
] as const;

describe("Modèles CSV", () => {
  it.each(templates)(
    "sert publiquement %s avec les en-têtes attendus",
    async (filename, expectedHeader) => {
      const response = await request(app).get(`/${filename}`).expect(200);

      expect(response.headers["content-type"]).toMatch(/^text\/csv/);
      expect(response.text.split(/\r?\n/, 1)[0]).toBe(expectedHeader);
    },
  );
});

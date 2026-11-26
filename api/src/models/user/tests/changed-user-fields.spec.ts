import { changedUserFields } from "../changed-user-fields.ts";
import { updatedUser } from "../../../helpers/mail-template/updated-user.ts";
import { passwordChanged } from "../../../helpers/mail-template/password-changed.ts";

describe("informations modifiées d'un compte", () => {
  it("ne retourne que les champs réellement modifiés", () => {
    const changes = changedUserFields(
      { firstname: "ada", lastname: "lovelace", city: "londres" },
      { firstname: "ada", lastname: "byron", city: "londres" },
    );

    expect(changes).toEqual([{ label: "Nom", value: "byron" }]);
  });

  it("traite l'absence, la chaîne vide et les espaces comme identiques", () => {
    expect(
      changedUserFields(
        { nickname: undefined, city: "" },
        { nickname: "  ", city: undefined },
      ),
    ).toEqual([]);
  });

  it("signale l'effacement d'une valeur et la photo sans l'afficher", () => {
    const changes = changedUserFields(
      { city: "paris", avatar: Buffer.from("a") },
      { city: "", avatar: Buffer.from("b") },
    );

    expect(changes).toEqual([
      { label: "Ville", value: "Supprimé" },
      { label: "Photo de profil", value: null },
    ]);
  });

  it("compare les dates de naissance au jour près", () => {
    expect(
      changedUserFields(
        { birthDate: new Date("2000-01-01T00:00:00Z") },
        { birthDate: new Date("2000-01-01T10:00:00Z") },
      ),
    ).toEqual([]);
    expect(
      changedUserFields(
        { birthDate: new Date("2000-01-01T00:00:00Z") },
        { birthDate: new Date("2001-02-03T00:00:00Z") },
      ),
    ).toEqual([{ label: "Date de naissance", value: "03/02/2001" }]);
  });
});

describe("email de modification de compte", () => {
  const changes = [{ label: "Ville", value: "<b>paris</b>" }];

  it("désigne l'auteur par son rôle et échappe les valeurs", () => {
    const admin = updatedUser(changes, "admin", {});
    const self = updatedUser(changes, "self", {});

    expect(admin).toContain("Un administrateur a modifié votre compte.");
    expect(self).toContain("Vous avez modifié votre compte.");
    expect(admin).toContain("&lt;b&gt;paris&lt;/b&gt;");
    expect(admin).not.toContain("<b>paris</b>");
  });
});

describe("email de changement de mot de passe", () => {
  it("indique la date sans mot de passe ni auteur", () => {
    const html = passwordChanged(new Date("2026-11-26T10:00:00Z"), {});

    expect(html).toContain("a été modifié le");
    expect(html).toContain("26 novembre 2026");
    expect(html).toContain("réinitialisez votre mot de passe");
  });
});

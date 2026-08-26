import { describe, expect, it } from "vitest";

import { getContactFullName } from "./contact-full-name";

describe("getContactFullName", () => {
  it("affiche toujours le prénom avant le nom", () => {
    expect(
      getContactFullName({ firstname: "Camille", lastname: "Martin" }),
    ).toBe("Camille Martin");
  });
});

import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { getApiErrorMessage, isConflictError } from "./api-error-message";

const axiosErrorWith = (status: number, data: unknown) => {
  const error = new AxiosError("Request failed");
  error.response = {
    status,
    statusText: "",
    data,
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  };
  return error;
};

describe("getApiErrorMessage", () => {
  it("reprend le message rédigé par l'API", () => {
    const error = axiosErrorWith(409, {
      message: "Un groupe portant ce nom existe déjà.",
    });

    expect(getApiErrorMessage(error, "secours")).toBe(
      "Un groupe portant ce nom existe déjà.",
    );
  });

  it("retombe sur le premier message de validation express-validator", () => {
    const error = axiosErrorWith(400, {
      errors: [{ msg: "titre non conforme" }],
    });

    expect(getApiErrorMessage(error, "secours")).toBe("titre non conforme");
  });

  it("utilise le message de secours quand la réponse n'en porte aucun", () => {
    expect(getApiErrorMessage(axiosErrorWith(500, {}), "secours")).toBe(
      "secours",
    );
  });

  it("utilise le message de secours hors erreur HTTP", () => {
    expect(getApiErrorMessage(new Error("réseau coupé"), "secours")).toBe(
      "secours",
    );
  });
});

describe("isConflictError", () => {
  it("ne retient que les 409", () => {
    expect(isConflictError(axiosErrorWith(409, {}))).toBe(true);
    expect(isConflictError(axiosErrorWith(400, {}))).toBe(false);
    expect(isConflictError(axiosErrorWith(500, {}))).toBe(false);
    expect(isConflictError(new Error("boom"))).toBe(false);
  });
});

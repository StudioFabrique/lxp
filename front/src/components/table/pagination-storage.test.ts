import { beforeEach, describe, expect, it } from "vitest";

import {
  getPaginationStorageKey,
  getStoredItemsPerPage,
  storeItemsPerPage,
} from "./pagination-storage";

describe("pagination-storage", () => {
  beforeEach(() => localStorage.clear());

  it("mémorise le nombre d'éléments indépendamment pour chaque emplacement", () => {
    storeItemsPerPage("sidebar-modules", 10);
    storeItemsPerPage("sidebar-courses", 15);

    expect(getStoredItemsPerPage("sidebar-modules", 5)).toBe(10);
    expect(getStoredItemsPerPage("sidebar-courses", 5)).toBe(15);
    expect(getStoredItemsPerPage("sidebar-parcours-admin", 5)).toBe(5);
    expect(localStorage.getItem(getPaginationStorageKey("sidebar-modules"))).toBe(
      "10",
    );
  });

  it("ignore une valeur stockée invalide", () => {
    localStorage.setItem(getPaginationStorageKey("users"), "invalide");

    expect(getStoredItemsPerPage("users", 10)).toBe(10);
  });
});

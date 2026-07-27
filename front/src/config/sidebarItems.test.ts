import { describe, expect, it } from "vitest";
import {
  getSidebarItemForPath,
  sidebarItems,
} from "./sidebarItems";

describe("getSidebarItemForPath", () => {
  it("returns the admin item matching the current main route", () => {
    expect(getSidebarItemForPath("/admin/parcours/edit/42")).toBe(
      sidebarItems.admin.find((item) => item.key === "parcours"),
    );
  });

  it("uses the student menu when routes have different names", () => {
    expect(getSidebarItemForPath("/student/ressources/details/42")).toBe(
      sidebarItems.student.find((item) => item.key === "resources"),
    );
  });

  it("matches the dashboard route with the home item", () => {
    expect(getSidebarItemForPath("/admin/dashboard")?.key).toBe("home");
  });

  it("returns nothing outside a configured main route", () => {
    expect(getSidebarItemForPath("/login")).toBeUndefined();
    expect(getSidebarItemForPath("/admin/profil")).toBeUndefined();
  });
});

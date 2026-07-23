import { describe, expect, it } from "vitest";
import { createAppAbility } from "./ability";
import { renderToStaticMarkup } from "react-dom/server";
import { AbilityContext } from "./AbilityProvider";
import PermissionGuard from "../components/guards/PermissionGuard";
import RequireAbility from "../components/guards/RequireAbility";
import { MemoryRouter, Route, Routes } from "react-router";

describe("frontend CASL ability", () => {
  it("denies direct access when the session has no matching rule", () => {
    const ability = createAppAbility([]);

    expect(ability.can("read", "module")).toBe(false);
    expect(ability.can("layout", "admin")).toBe(false);
  });

  it("uses the serialized API rules for layouts, routes and actions", () => {
    const ability = createAppAbility([
      { action: "layout", subject: "admin" },
      { action: "read", subject: "role" },
      { action: "write", subject: "role" },
      { action: "update", subject: "role" },
      { action: "delete", subject: "role" },
    ]);

    expect(ability.can("layout", "admin")).toBe(true);
    for (const action of ["read", "write", "update", "delete"] as const) {
      expect(ability.can(action, "role")).toBe(true);
    }
    expect(ability.can("layout", "student")).toBe(false);
  });

  it("filters each role-management action with the same ability", () => {
    for (const action of ["read", "write", "update", "delete"] as const) {
      const allowedAbility = createAppAbility([
        { action, subject: "role" },
      ]);
      const deniedAbility = createAppAbility([]);
      const render = (ability: ReturnType<typeof createAppAbility>) =>
        renderToStaticMarkup(
          <AbilityContext value={ability}>
            <PermissionGuard action={action} object="role">
              <span>action visible</span>
            </PermissionGuard>
          </AbilityContext>,
        );

      expect(render(allowedAbility)).toContain("action visible");
      expect(render(deniedAbility)).not.toContain("action visible");
    }
  });

  it("does not mount a protected route without its read ability", () => {
    const renderRoute = (rules: Parameters<typeof createAppAbility>[0]) =>
      renderToStaticMarkup(
        <AbilityContext value={createAppAbility(rules)}>
          <MemoryRouter initialEntries={["/protected"]}>
            <Routes>
              <Route
                path="/protected"
                element={<RequireAbility action="read" subject="module" />}
              >
                <Route index element={<span>protected screen</span>} />
              </Route>
              <Route
                path="/access-denied"
                element={<span>access denied</span>}
              />
            </Routes>
          </MemoryRouter>
        </AbilityContext>,
      );

    expect(renderRoute([])).not.toContain("protected screen");
    expect(
      renderRoute([{ action: "read", subject: "module" }]),
    ).toContain("protected screen");
  });
});

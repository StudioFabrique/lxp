import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import apiClient from "../lib/axios";
import { AuthContext, AuthProvider } from "./AuthProvider";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "./DemoContext";

vi.mock("../lib/axios", () => ({
  default: { get: vi.fn() },
  injectAbilityResync: vi.fn(),
  injectLogout: vi.fn(),
}));

const get = vi.mocked(apiClient.get);

const RoleLabels = () => {
  const { roles } = useContext(AuthContext);
  return <p>{roles.map((role) => role.label).join(", ")}</p>;
};

describe("AuthProvider roles", () => {
  let container: HTMLDivElement;
  let root: Root;
  let availableRoles: { _id: string; role: string; label: string; rank: number; protection: number }[];

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    availableRoles = [{ _id: "student", role: "student", label: "Apprenant", rank: 3, protection: 1 }];
    get.mockReset();
    get.mockImplementation(async (path) => {
      if (path === "/auth/handshake") {
        return { data: { roles: [{ _id: "admin", role: "admin", label: "Administrateur", rank: 1, protection: 1 }] } } as never;
      }
      if (path === "/auth/roles") return { data: [...availableRoles] } as never;
      throw new Error(`Unexpected request: ${path}`);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("actualise les rôles quand l'onglet reprend le focus", async () => {
    await act(async () => {
      root.render(
        <DemoContext value={{ ...DEFAULT_DEMO_CONFIG, demoMode: true, isConfigLoaded: true }}>
          <AuthProvider><RoleLabels /></AuthProvider>
        </DemoContext>,
      );
    });
    expect(container.textContent).toContain("Apprenant");

    availableRoles = [...availableRoles, { _id: "custom", role: "custom", label: "Nouveau rôle", rank: 2, protection: 0 }];
    await act(async () => window.dispatchEvent(new Event("focus")));

    expect(container.textContent).toContain("Nouveau rôle");
  });
});

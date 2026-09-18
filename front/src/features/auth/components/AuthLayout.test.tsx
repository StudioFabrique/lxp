import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { profileApi } from "../../profile/api/profile.api";
import AuthLayout from "./AuthLayout";

vi.mock("../../profile/api/profile.api", () => ({
  profileApi: { queries: { getInstanceSettings: vi.fn() } },
}));
vi.mock("../hooks/useAuthBackground", () => ({
  useAuthBackground: () => ({ background: null, isFailed: false }),
}));
vi.mock("./LoginRightColumn", () => ({ default: () => null }));
vi.mock("../../../components/guards/LoginGuard", () => ({
  default: () => null,
}));

describe("nom de l’organisme sur les pages d’authentification", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.mocked(profileApi.queries.getInstanceSettings).mockResolvedValue({
      name: "STEP",
      setupCompleted: true,
      hasLogo: true,
      defaultTheme: "classic",
      welcomeTitles: {
        admin: "Bonjour",
        teacher: "Bonjour",
        student: "Bonjour",
      },
      welcomeMessages: {
        admin: "Bienvenue",
        teacher: "Bienvenue",
        student: "Bienvenue",
      },
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  for (const route of ["/login", "/reset-password"]) {
    it(`affiche le nom seul sur ${route}`, async () => {
      await act(async () => {
        root.render(
          <MemoryRouter initialEntries={[route]}>
            <AuthLayout />
          </MemoryRouter>,
        );
      });

      expect(container.querySelector("p")?.textContent).toBe("STEP");
      expect(profileApi.queries.getInstanceSettings).toHaveBeenCalledOnce();
    });
  }

  it("ne l’affiche pas sur les autres écrans", async () => {
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={["/init"]}>
          <AuthLayout />
        </MemoryRouter>,
      );
    });

    expect(container.textContent).not.toContain("STEP");
    expect(profileApi.queries.getInstanceSettings).not.toHaveBeenCalled();
  });
});

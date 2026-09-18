import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import { ThemeContext } from "../../../store/ThemeProvider";
import { profileApi } from "../api/profile.api";
import ProfilePopover from "./ProfilePopover";

describe("Menu du profil", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  const showMenu = (
    rank: number,
    interfaceType = "admin",
    avatar?: string,
  ) => {
    const handshake = vi.fn(async () => {});
    act(() => {
      root = createRoot(container);
      root.render(
        <MemoryRouter>
          <AuthContext
            value={
              {
                user: {
                  firstname: "Camille",
                  lastname: "Martin",
                  email: "camille@example.org",
                  avatar,
                  roles: [
                    {
                      rank,
                      role: rank === 3 ? "student" : "admin",
                      label:
                        rank === 0
                          ? "superadmin"
                          : rank === 3
                            ? "apprenant"
                            : "administrateur",
                    },
                  ],
                },
                handshake,
              } as never
            }
          >
            <ThemeContext
              value={{
                theme: "light",
                toggleTheme: () => {},
                chooseTheme: () => {},
                availableLightThemes: ["classic"],
                availableDarkThemes: ["classic-dark"],
              }}
            >
              <ProfilePopover interfaceType={interfaceType} />
            </ThemeContext>
          </AuthContext>
        </MemoryRouter>,
      );
    });
    act(() => {
      container.querySelector<HTMLButtonElement>("button")?.click();
    });
    return { handshake };
  };

  it("réserve les paramètres de l’instance au superadmin", () => {
    showMenu(0);
    expect(container.querySelector("button")?.className).toContain("ring-1");
    expect(
      document.querySelector('a[href="/admin/parametres-instance"]'),
    ).not.toBeNull();
  });

  it("cache les paramètres à l’administrateur classique", () => {
    showMenu(1);
    expect(
      document.querySelector('a[href="/admin/parametres-instance"]'),
    ).toBeNull();
    expect(
      document.querySelector('a[href="/admin/activer-superadmin"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[href="/admin/mon-avancement"]'),
    ).toBeNull();
  });

  it("propose Mon avancement uniquement à l’apprenant", () => {
    showMenu(3, "student");
    expect(
      document.querySelector('a[href="/student/mon-avancement"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[href="/admin/parametres-instance"]'),
    ).toBeNull();
  });

  it("permet de supprimer une photo et actualise l’avatar", async () => {
    const deleteAvatar = vi
      .spyOn(profileApi.mutations, "deleteAvatar")
      .mockResolvedValue({ message: "Photo supprimée" });
    const { handshake } = showMenu(0, "admin", "data:image/png;base64,aGVsbG8=");
    const removeButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Supprimer la photo de profil"]',
    );

    expect(removeButton).not.toBeNull();
    expect(removeButton?.className).toContain("group-hover/profile:opacity-100");
    await act(async () => {
      removeButton?.click();
    });

    expect(deleteAvatar).toHaveBeenCalledOnce();
    expect(handshake).toHaveBeenCalledOnce();
  });

  it("ne montre pas la suppression quand aucune photo n’est enregistrée", () => {
    showMenu(0);
    expect(
      document.querySelector('button[aria-label="Supprimer la photo de profil"]'),
    ).toBeNull();
  });

  it("adapte le contraste de l’icône de modification au thème", () => {
    showMenu(0);
    const editIcon = document.querySelector(
      'button[aria-label="Modifier la photo de profil"] svg',
    );

    expect(editIcon?.classList.contains("text-base-content")).toBe(true);
    expect(editIcon?.classList.contains("text-black")).toBe(false);
  });
});

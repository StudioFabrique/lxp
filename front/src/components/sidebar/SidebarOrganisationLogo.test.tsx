import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import SidebarOrganisationLogo from "./SidebarOrganisationLogo";

const roots: Root[] = [];

const renderLogo = (
  websiteUrl: string | null,
  variant: "rail" | "drawer" | "bar" = "rail",
) => {
  const container = document.createElement("div");
  const root = createRoot(container);
  roots.push(root);
  act(() =>
    root.render(
      <SidebarOrganisationLogo
        logoUrl="/logo.png"
        websiteUrl={websiteUrl}
        variant={variant}
      />,
    ),
  );
  return container;
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("SidebarOrganisationLogo", () => {
  it("mène au site de l'organisme dans un nouvel onglet", () => {
    const link = renderLogo("https://exemple.fr/").querySelector("a");

    expect(link?.getAttribute("href")).toBe("https://exemple.fr/");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toContain("noopener");
    expect(link?.getAttribute("aria-label")).toContain("Site de l’organisme");
  });

  it("n'affiche qu'une image, décrite par son texte alternatif, sans site", () => {
    const container = renderLogo(null);

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("Logo de l’organisme");
  });

  it("élargit le logo en rectangle en barre étendue et le garde carré en barre compacte", () => {
    const rail = renderLogo(null).querySelector("img")?.className;
    const drawer = renderLogo(null, "drawer").querySelector("img")?.className;

    expect(rail).toContain("h-8");
    expect(rail).toContain("2xl:h-12.5");
    expect(rail).toContain("2xl:w-32");
    expect(drawer).toContain("h-12.5");
    expect(drawer).toContain("w-32");
  });

  it("tient dans la hauteur des contrôles de la barre du haut du mobile", () => {
    const container = renderLogo(null, "bar");

    expect(container.querySelector("img")?.className).toContain("h-8");
    expect(container.firstElementChild?.className).not.toContain("mb-3");
  });

  it("n'est pas cliquable dans la barre du haut du mobile, même avec un site", () => {
    const container = renderLogo("https://exemple.fr/", "bar");

    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("Logo de l’organisme");
  });
});

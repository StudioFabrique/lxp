import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ThemeToggle from "../components/buttons/ThemeToggle";
import ThemeSelect from "../features/profile/components/theme-select";
import { darkThemes, lightThemes, themes } from "../config/themes";
import { ThemeContext, ThemeProvider } from "./ThemeProvider";

const ThemeControls = () => {
  const { theme, chooseTheme } = useContext(ThemeContext);

  return (
    <>
      <output data-testid="current-mode">{theme}</output>
      <ThemeSelect
        label="Thème clair"
        themesList={["classic", "ocean"]}
        onThemeChange={chooseTheme}
      />
      <ThemeSelect
        label="Thème sombre"
        themesList={["classic-dark", "aurora"]}
        onThemeChange={chooseTheme}
      />
      <ThemeToggle />
    </>
  );
};

describe("ThemeProvider", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("activeTheme", "dark");
    localStorage.setItem("lightTheme", "classic");
    localStorage.setItem("darkTheme", "classic-dark");
    themes.light = "classic";
    themes.dark = "classic-dark";

    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("propose autant de thèmes clairs que de thèmes sombres", () => {
    expect(lightThemes).toHaveLength(8);
    expect(darkThemes).toHaveLength(8);
  });

  it("applique les variantes et reste basculable dans les deux sens", async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(
        <ThemeProvider>
          <ThemeControls />
        </ThemeProvider>,
      );
    });

    const currentMode = () =>
      container.querySelector('[data-testid="current-mode"]')?.textContent;
    const toggle = container.querySelector<HTMLInputElement>("#mode-toggle");

    expect(currentMode()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("classic-dark");
    expect(toggle?.checked).toBe(true);

    await act(async () => {
      container.querySelector<HTMLInputElement>('input[value="aurora"]')?.click();
    });
    expect(document.documentElement.dataset.theme).toBe("aurora");
    expect(localStorage.getItem("darkTheme")).toBe("aurora");

    await act(async () => toggle?.click());
    expect(currentMode()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("classic");
    expect(toggle?.checked).toBe(false);

    await act(async () => {
      container.querySelector<HTMLInputElement>('input[value="ocean"]')?.click();
    });
    expect(document.documentElement.dataset.theme).toBe("ocean");
    expect(localStorage.getItem("lightTheme")).toBe("ocean");

    await act(async () => {
      container
        .querySelector<HTMLInputElement>('input[value="classic-dark"]')
        ?.click();
    });
    expect(currentMode()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("classic-dark");

    await act(async () => toggle?.click());
    expect(currentMode()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("ocean");
  });

  it("remplace les anciens thèmes enregistrés par les nouveaux thèmes par défaut", async () => {
    localStorage.setItem("lightTheme", "paper");
    localStorage.setItem("darkTheme", "slate");

    await act(async () => {
      root = createRoot(container);
      root.render(
        <ThemeProvider>
          <ThemeControls />
        </ThemeProvider>,
      );
    });

    expect(localStorage.getItem("lightTheme")).toBe("classic");
    expect(localStorage.getItem("darkTheme")).toBe("classic-dark");
    expect(document.documentElement.dataset.theme).toBe("classic-dark");
  });
});

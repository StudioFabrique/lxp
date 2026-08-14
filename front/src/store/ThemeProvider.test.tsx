import { act, useContext } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import ThemeToggle from "../components/buttons/ThemeToggle";
import ThemeSelect from "../features/profile/components/theme-select";
import { themes } from "../config/themes";
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
        themesList={["slate", "carbon"]}
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
    localStorage.setItem("darkTheme", "slate");
    themes.light = "classic";
    themes.dark = "slate";

    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
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
    expect(document.documentElement.dataset.theme).toBe("slate");
    expect(toggle?.checked).toBe(true);

    await act(async () => {
      container.querySelector<HTMLInputElement>('input[value="carbon"]')?.click();
    });
    expect(document.documentElement.dataset.theme).toBe("carbon");
    expect(localStorage.getItem("darkTheme")).toBe("carbon");

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
      container.querySelector<HTMLInputElement>('input[value="slate"]')?.click();
    });
    expect(currentMode()).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("slate");

    await act(async () => toggle?.click());
    expect(currentMode()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("ocean");
  });
});

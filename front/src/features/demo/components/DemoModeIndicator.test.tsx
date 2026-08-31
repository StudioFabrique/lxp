import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DemoModeIndicator from "./DemoModeIndicator";

describe("DemoModeIndicator", () => {
  it("annonce le mode démonstration dans un statut accessible", () => {
    const markup = renderToStaticMarkup(<DemoModeIndicator />);

    expect(markup).toContain('role="status"');
    expect(markup).toContain('aria-label="Mode démonstration"');
    expect(markup).toContain("Mode démonstration");
  });
});

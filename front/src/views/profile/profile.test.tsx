import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Profile from "./profile";

describe(
  "Conditional tests about components render along with the router state",
  Tests
);

function Tests() {
  it("Should not show 'skill' and 'links' components when admin is connected", () => {
    // Render the Profile component within a MemoryRouter
    const { container } = render(
      <MemoryRouter initialEntries={["/admin", "/formateur"]}>
        <Profile />
      </MemoryRouter>
    );

    // Check if Profile does not contain any skills or links
    expect(container.innerHTML).not.toContain("Mes centres d'intérêts");
  });

  it("Should not show 'skill' and 'links' components when admin is connected", () => {
    // Render the Profile component within a MemoryRouter
    const { container } = render(
      <MemoryRouter initialEntries={["/student"]}>
        <Profile />
      </MemoryRouter>
    );

    // Check if Profile contain skills or links component
    expect(container.innerHTML).toContain("Mes centres d'intérêts");
  });
}

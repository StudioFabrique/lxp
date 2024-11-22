import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Profile from "./profile";

describe(
  "Conditional tests about components render along with the router state",
  Tests,
);

function Tests() {
  it("Should not render 'skill' and 'links' components when admin is connected", async () => {
    // Render the Profile component within a MemoryRouter
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Profile />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Check if Profile does not contain any skills or links
      expect(screen.queryByTestId("hobbies")).toBe(null);
      expect(screen.queryByTestId("social-networks")).toBe(null);
    });
  });

  it("Should render 'skill' and 'links' components when student is connected", async () => {
    // Render the Profile component within a MemoryRouter
    render(
      <MemoryRouter initialEntries={["/student"]}>
        <Profile />
      </MemoryRouter>,
    );

    await waitFor(() => {
      // Check if Profile contain skills or links component
      expect(screen.findByTestId("hobbies")).resolves.toBeTruthy();
      expect(screen.findByTestId("social-networks")).resolves.toBeTruthy();
    });
  });
}

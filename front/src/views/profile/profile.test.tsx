import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import Profile from "./profile";
import {
  TEST_ID_HOBBIES,
  TEST_ID_LINKS,
} from "../../config/tests-config/tests-ids";

describe(
  "Conditional tests about components render along with the router state",
  ProfileTests
);

function ProfileTests() {
  it("Should not render 'hobbies' and 'links' components when admin is connected", async () => {
    // Render the Profile component within a MemoryRouter
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check if Profile does not contain any skills or links
      expect(screen.queryByTestId(TEST_ID_HOBBIES)).toBe(null);
      expect(screen.queryByTestId(TEST_ID_LINKS)).toBe(null);
    });
  });

  it("Should render 'hobbies' and 'links' components when student is connected", async () => {
    // Render the Profile component within a MemoryRouter
    render(
      <MemoryRouter initialEntries={["/student"]}>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(async () => {
      await expect(screen.findByTestId(TEST_ID_HOBBIES)).resolves.toBeTruthy();
      await expect(screen.findByTestId(TEST_ID_LINKS)).resolves.toBeTruthy();
    });
  });
}

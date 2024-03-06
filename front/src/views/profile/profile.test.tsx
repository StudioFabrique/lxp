import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { act } from "react-dom/test-utils";
import Information from "../../components/user-profile/information/information";

describe(
  "Conditional tests about components render along with the router state",
  Tests
);

function Tests() {
  it("Should not render 'skill' and 'links' components when admin is connected", async () => {
    // Render the Profile component within a MemoryRouter
    const { container } = await act(async () =>
      render(
        <MemoryRouter initialEntries={["/admin"]}>
          <Information formRef={null} />
        </MemoryRouter>
      )
    );

    // Check if Profile does not contain any skills or links
    expect(container.children.namedItem("Hobbies")).toBe(null);
    expect(container.children.namedItem("SocialNetworks")).toBe(null);
  });

  it("Should render 'skill' and 'links' components when student is connected", async () => {
    // Render the Profile component within a MemoryRouter
    const { container } = await act(async () =>
      render(
        <MemoryRouter initialEntries={["/student"]}>
          <Information formRef={null} />
        </MemoryRouter>
      )
    );

    console.log({ "Information Children Components list": container.children });

    // Check if Profile contain skills or links component
    expect(container.children.namedItem("Hobbies")).not.toBe(null);
    expect(container.children.namedItem("SocialNetworks")).not.toBe(null);
  });
}

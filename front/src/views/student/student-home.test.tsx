import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../App";
import StudentHome from "./student-home";

describe("Student Home route", () => {
  test("should redirect user on the route '/student' by default, this component can't be accessed on admin route", () => {
    // Render the App component within a MemoryRouter
    const { container } = render(
      <MemoryRouter initialEntries={["/admin"]}>
        <StudentHome />
      </MemoryRouter>
    );

    // Check if the user is redirected to '/student'
    expect(container.innerHTML).toContain("Student Home Page");
    expect(container.innerHTML).not.toContain("Admin Home Page");
  });
});

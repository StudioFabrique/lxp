import { useLocation } from "react-router-dom";
import { describe, test } from "vitest";
import { render, renderHook } from "@testing-library/react";
import App from "../../App";

describe("first", () => {
  test("should first", () => {
    const router = render(<App />);

    const { result } = renderHook(() => useLocation());

    console.log(result.current.pathname);
  });
});

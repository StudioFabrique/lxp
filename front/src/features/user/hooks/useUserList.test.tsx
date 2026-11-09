import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { queries } from "../api/user.api";
import { useUserList } from "./useUserList";

vi.mock("../api/user.api", () => ({
  queries: { list: vi.fn(), stats: vi.fn() },
}));

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const Probe = () => {
  const { data } = useUserList(null);
  return <p>{data.map((user) => user.lastname).join(",")}</p>;
};

describe("useUserList", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.clearAllMocks();
  });

  it("charge la liste de tous les rôles tant que les rôles ne sont pas chargés", async () => {
    vi.mocked(queries.list).mockResolvedValue({
      total: 1,
      list: [{ _id: "1", lastname: "apprenant" }],
    });
    vi.mocked(queries.stats).mockResolvedValue([]);
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    await act(async () => {
      root.render(
        <QueryClientProvider client={new QueryClient()}>
          <Probe />
        </QueryClientProvider>,
      );
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(queries.list).toHaveBeenCalledWith(
      expect.stringContaining("/user/list/everything/"),
    );
    expect(container.textContent).toBe("apprenant");
  });
});

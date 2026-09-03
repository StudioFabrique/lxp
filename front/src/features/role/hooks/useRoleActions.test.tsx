import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError, AxiosHeaders } from "axios";
import toast from "react-hot-toast";
import { afterEach, describe, expect, it, vi } from "vitest";

import { roleApi } from "../api/role.api";
import { useRoleActions } from "./useRoleActions";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../api/role.api", () => ({
  roleApi: {
    mutations: {
      deleteOne: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const apiError = (message: string) => {
  const error = new AxiosError("Request failed");
  error.response = {
    status: 400,
    statusText: "",
    data: { message },
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  };
  return error;
};

describe("useRoleActions", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    if (root) act(() => root?.unmount());
    container?.remove();
    root = undefined;
    container = undefined;
    vi.clearAllMocks();
  });

  it("expose et affiche le message renvoyé lors d’un refus de suppression", async () => {
    const message = "Impossible de supprimer un rôle protégé";
    vi.mocked(roleApi.mutations.deleteOne).mockRejectedValue(apiError(message));

    const onSuccess = vi.fn();
    let actions!: ReturnType<typeof useRoleActions>;
    const Probe = () => {
      actions = useRoleActions(onSuccess);
      return null;
    };

    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => {
      root?.render(
        <QueryClientProvider client={queryClient}>
          <Probe />
        </QueryClientProvider>,
      );
    });

    await act(async () => {
      await expect(actions.onDeleteOne("role-id")).rejects.toThrow();
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(toast.error).toHaveBeenCalledWith(message);
    expect(actions.deleteError).toBe(message);
    expect(onSuccess).not.toHaveBeenCalled();
  });
});

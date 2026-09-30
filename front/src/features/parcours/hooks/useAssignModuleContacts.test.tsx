import { act } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { parcoursKeys } from "../api/parcours.keys";
import { useAssignModuleContacts } from "./useAssignModuleContacts";

const { assignModuleContacts } = vi.hoisted(() => ({
  assignModuleContacts: vi.fn(),
}));

vi.mock("../api/parcours.api", () => ({
  parcoursApi: { mutations: { assignModuleContacts } },
}));

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("useAssignModuleContacts", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(async () => {
    if (root) await act(async () => root.unmount());
    container?.remove();
    vi.clearAllMocks();
  });

  it("attend le parcours actualisé avant de terminer l'affectation", async () => {
    let finishRefetch!: (value: { modules: { contacts: number[] }[] }) => void;
    const refetch = new Promise<{ modules: { contacts: number[] }[] }>(
      (resolve) => { finishRefetch = resolve; },
    );
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    queryClient.setQueryData(parcoursKeys.detail(42), {
      modules: [{ contacts: [] }],
    });
    assignModuleContacts.mockResolvedValue({ message: "Affecté" });

    let assign!: ReturnType<typeof useAssignModuleContacts>["mutateAsync"];
    const Harness = () => {
      useQuery({
        queryKey: parcoursKeys.detail(42),
        queryFn: () => refetch,
      });
      const mutation = useAssignModuleContacts(42);
      assign = mutation.mutateAsync;
      return null;
    };

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <Harness />
        </QueryClientProvider>,
      );
    });

    let settled = false;
    let assignment!: Promise<unknown>;
    await act(async () => {
      assignment = assign({ moduleIds: [10], contactIds: [1] });
      assignment.then(() => { settled = true; });
      await Promise.resolve();
    });

    expect(assignModuleContacts).toHaveBeenCalledWith({
      parcoursId: 42,
      moduleIds: [10],
      contactIds: [1],
    });
    expect(queryClient.getMutationCache().getAll()[0].state.status).toBe("pending");
    expect(settled).toBe(false);

    await act(async () => {
      finishRefetch({ modules: [{ contacts: [1] }] });
      await assignment;
    });

    expect(queryClient.getMutationCache().getAll()[0].state.status).toBe("success");
    expect(settled).toBe(true);
    expect(queryClient.getQueryData(parcoursKeys.detail(42))).toEqual({
      modules: [{ contacts: [1] }],
    });
  });
});

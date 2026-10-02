import { act } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { parcoursKeys } from "../api/parcours.keys";
import { useUpdateParcours } from "./useUpdateParcours";

const { updateParcours } = vi.hoisted(() => ({
  updateParcours: vi.fn(),
}));

vi.mock("../api/parcours.api", () => ({
  parcoursApi: { mutations: { updateParcours } },
}));

describe("useUpdateParcours", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(async () => {
    if (root) await act(async () => root.unmount());
    container?.remove();
    vi.clearAllMocks();
  });

  it("rafraîchit les modules après le retrait d'une ressource", async () => {
    const contact = { id: 1, firstname: "Jeanne", lastname: "Dupont" };
    let finishRefetch!: (value: unknown) => void;
    const refetch = new Promise((resolve) => {
      finishRefetch = resolve;
    });
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });
    queryClient.setQueryData(parcoursKeys.detail(42), {
      contacts: [contact],
      modules: [{ id: 10, contacts: [contact] }],
    });
    updateParcours.mockResolvedValue({
      success: true,
      parcours: { contacts: [] },
    });

    let update!: ReturnType<typeof useUpdateParcours>["mutateAsync"];
    const Harness = () => {
      useQuery({ queryKey: parcoursKeys.detail(42), queryFn: () => refetch });
      update = useUpdateParcours(42).mutateAsync;
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
    let removal!: Promise<unknown>;
    await act(async () => {
      removal = update({ contactIds: [] });
      removal.then(() => { settled = true; });
      await Promise.resolve();
    });

    expect(settled).toBe(false);
    expect(queryClient.getMutationCache().getAll()[0].state.status).toBe("pending");

    await act(async () => {
      finishRefetch({ contacts: [], modules: [{ id: 10, contacts: [] }] });
      await removal;
    });

    expect(queryClient.getQueryData(parcoursKeys.detail(42))).toEqual({
      contacts: [],
      modules: [{ id: 10, contacts: [] }],
    });
    expect(settled).toBe(true);
  });
});

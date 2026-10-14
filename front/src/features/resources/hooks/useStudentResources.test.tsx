import { act, useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import useStudentResources from "./useStudentResources";

vi.mock("../../../lib/axios", () => ({ default: { get: vi.fn() } }));

let root: Root;
let state: ReturnType<typeof useStudentResources>;

function Harness() {
  const resources = useStudentResources();
  useEffect(() => {
    state = resources;
  }, [resources]);
  return null;
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  vi.mocked(apiClient.get).mockResolvedValue({ data: { list: [], total: 0 } });
});

afterEach(async () => {
  if (root) await act(async () => root.unmount());
  vi.useRealTimers();
  vi.clearAllMocks();
});

async function render() {
  root = createRoot(document.createElement("div"));
  await act(async () => root.render(<Harness />));
}

describe("Chargement des ressources supplémentaires", () => {
  it("charge une seule fois à l'ouverture, même après le délai de recherche", async () => {
    await render();
    expect(state.isLoading).toBe(false);
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(apiClient.get).toHaveBeenCalledOnce();
    expect(state.dataList).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("attend la fin de la saisie puis recharge une seule fois à l'effacement", async () => {
    await render();
    await act(async () => state.handleOnChangeValue("React"));
    await act(async () => vi.advanceTimersByTimeAsync(300));
    await act(async () => state.handleOnChangeValue("React avancé"));
    await act(async () => vi.advanceTimersByTimeAsync(499));
    expect(apiClient.get).toHaveBeenCalledOnce();
    await act(async () => vi.advanceTimersByTimeAsync(1));
    expect(apiClient.get).toHaveBeenCalledTimes(2);
    expect(apiClient.get).toHaveBeenLastCalledWith(expect.stringContaining("&searchTerm=React avancé"));
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(apiClient.get).toHaveBeenCalledTimes(2);

    await act(async () => state.handleOnChangeValue(""));
    await act(async () => vi.advanceTimersByTimeAsync(500));
    expect(apiClient.get).toHaveBeenCalledTimes(3);
    expect(apiClient.get).toHaveBeenLastCalledWith(expect.not.stringContaining("searchTerm"));
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(apiClient.get).toHaveBeenCalledTimes(3);
  });
});

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DropoutPreferencesForm from "./DropoutPreferencesForm";

const update = vi.hoisted(() => vi.fn());
vi.mock("../api/dashboardIA.api", () => ({ dashboardIAApi: { updateDropoutPreferences: update } }));

describe("préférences d'analyse du décrochage", () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    update.mockReset().mockResolvedValue({ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: false });
    container = document.createElement("div"); document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => { act(() => root.unmount()); container.remove(); });

  it("propose le choix désactivé puis la fréquence hebdomadaire lors de l'activation", async () => {
    const onSaved = vi.fn();
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={onSaved} />
    </QueryClientProvider>));
    const checkbox = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(checkbox.checked).toBe(false);
    await act(async () => checkbox.click());
    expect(container.querySelector<HTMLInputElement>('input[name="frequency"]')?.checked).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[name="frequency"]')?.classList.contains("radio")).toBe(true);
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(update.mock.calls[0][0]).toEqual({ enabled: true, frequency: "weekly" });
    expect(onSaved).toHaveBeenCalledOnce();
  });
});

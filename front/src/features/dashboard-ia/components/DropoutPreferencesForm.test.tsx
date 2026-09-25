import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DropoutPreferencesForm from "./DropoutPreferencesForm";

const update = vi.hoisted(() => vi.fn());
const createGroup = vi.hoisted(() => vi.fn());
vi.mock("../api/dashboardIA.api", () => ({ dashboardIAApi: { updateDropoutPreferences: update } }));
vi.mock("../../group/api/group.api", () => ({ groupApi: { queries: { getStudents: vi.fn().mockResolvedValue({ list: [], total: 0 }) }, mutations: { create: createGroup } } }));
vi.mock("../../dashboard-admin/api/dashboard-admin.api", () => ({ dashboardAdminApi: { queries: { getRootParcours: vi.fn().mockResolvedValue([]) } } }));

describe("préférences d'analyse du décrochage", () => {
  let root: Root;
  let container: HTMLDivElement;
  beforeEach(() => {
    update.mockReset().mockResolvedValue({ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: false });
    createGroup.mockReset().mockResolvedValue(undefined);
    container = document.createElement("div"); document.body.appendChild(container);
    root = createRoot(container);
  });

  it("crée le groupe renseigné dans la carte avant de terminer l’accueil", async () => {
    const onSaved = vi.fn();
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={onSaved} completeOnboarding={false} />
    </QueryClientProvider>));
    const input = container.querySelector<HTMLInputElement>('input[placeholder="Ex. Promotion 2026"]')!;
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "Promotion test");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(createGroup).toHaveBeenCalledOnce();
    expect(JSON.parse((createGroup.mock.calls[0][0] as FormData).get("data") as string).group.name).toBe("Promotion test");
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ completeOnboarding: true }));
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it("termine l’accueil sans créer de groupe si l’option est décochée", async () => {
    await act(async () => root.render(<QueryClientProvider client={new QueryClient()}>
      <DropoutPreferencesForm initial={{ enabled: false, frequency: "weekly", hasParcours: true, onboardingRequired: true }} onSaved={vi.fn()} completeOnboarding={false} />
    </QueryClientProvider>));
    await act(async () => container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1].click());
    await act(async () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());
    expect(createGroup).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ completeOnboarding: true }));
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
    expect(update.mock.calls[0][0]).toEqual({ enabled: true, frequency: "weekly", minCritical: 1, completeOnboarding: true });
    expect(onSaved).toHaveBeenCalledOnce();
  });
});

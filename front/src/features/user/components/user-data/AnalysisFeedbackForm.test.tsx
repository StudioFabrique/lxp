import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import AnalysisFeedbackForm from "./AnalysisFeedbackForm";
import { indicatorsApi } from "../../api/indicators.api";
import type { IndicatorsPrediction } from "../../interfaces/indicators";

const prediction = {
  userId: "student", analysisId: "analysis", evaluatedAt: "2026-08-01T00:00:00Z",
} as IndicatorsPrediction;
let root: Root;
let host: HTMLDivElement;

async function render() {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  await act(async () => root.render(<QueryClientProvider client={client}><AnalysisFeedbackForm prediction={prediction} /></QueryClientProvider>));
  await act(async () => {
    Array.from(host.querySelectorAll("button")).find((button) => button.textContent?.includes("Donner mon avis"))!.click();
  });
}

async function changeSelect(index: number, value: string) {
  await act(async () => {
    const select = host.querySelectorAll("select")[index]!;
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

afterEach(async () => {
  if (root) await act(async () => root.unmount());
  host?.remove();
  vi.restoreAllMocks();
});

describe("Retour sur une analyse", () => {
  it("ouvre le formulaire dans une fenêtre modale", async () => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    const client = new QueryClient();
    await act(async () => root.render(<QueryClientProvider client={client}><AnalysisFeedbackForm prediction={prediction} /></QueryClientProvider>));
    expect(host.querySelector("form")).toBeNull();
    await act(async () => host.querySelector<HTMLButtonElement>("button")!.click());
    expect(host.querySelector("dialog.modal-open form")).not.toBeNull();
  });

  it("enregistre l'avis sur la bonne analyse puis ferme et masque la modale", async () => {
    const save = vi.spyOn(indicatorsApi.mutations, "saveAnalysisFeedback").mockResolvedValue();
    await render();
    await changeSelect(0, "underestimated");
    await act(async () => {
      host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(save).toHaveBeenCalledWith("student", "analysis", { verdict: "underestimated", comment: "", actionTaken: "" });
    expect(host.querySelector("dialog")).toBeNull();
    expect(host.textContent).not.toContain("Donner mon avis");
  });

  it("masque le bouton lorsqu'un retour de cet auteur existe déjà", async () => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    const client = new QueryClient();
    await act(async () => root.render(<QueryClientProvider client={client}><AnalysisFeedbackForm prediction={prediction} hasExistingFeedback /></QueryClientProvider>));
    expect(host.textContent).not.toContain("Donner mon avis");
  });

  it("demande une date seulement lorsque le résultat est connu", async () => {
    await render();
    expect(host.querySelector('input[type="datetime-local"]')).toBeNull();
    await changeSelect(1, "graduate");
    expect(host.querySelector<HTMLInputElement>('input[type="datetime-local"]')?.required).toBe(true);
    await changeSelect(1, "");
    expect(host.querySelector('input[type="datetime-local"]')).toBeNull();
  });

  it("affiche une erreur et laisse réessayer", async () => {
    vi.spyOn(indicatorsApi.mutations, "saveAnalysisFeedback").mockRejectedValue(new Error("offline"));
    await render();
    await changeSelect(0, "uncertain");
    await act(async () => {
      host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      await new Promise((resolve) => setTimeout(resolve, 20));
    });
    expect(host.querySelector('[role="alert"]')?.textContent).toContain("Impossible d'enregistrer");
    expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
  });
});

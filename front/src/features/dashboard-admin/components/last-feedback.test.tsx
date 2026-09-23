import { act, type ContextType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Socket } from "socket.io-client";
import { AuthContext } from "../../../store/AuthProvider";
import { dashboardAdminApi } from "../api/dashboard-admin.api";
import LastFeedback from "./last-feedback";

vi.mock("../api/dashboard-admin.api", () => ({
  dashboardAdminApi: {
    queries: { getLastFeedbacks: vi.fn() },
  },
}));

describe("Review des feedbacks apprenants", () => {
  let container: HTMLDivElement;
  let root: Root;
  const emit = vi.fn();
  const socket = {
    connected: true,
    emit,
    on: vi.fn(),
    off: vi.fn(),
  } as unknown as Socket;

  beforeEach(async () => {
    vi.mocked(dashboardAdminApi.queries.getLastFeedbacks).mockResolvedValue({
      success: true,
      response: [{
        _id: "feedback-1",
        studentId: "student-1",
        name: "Alice Martin",
        feedbackAt: "2026-09-23T08:00:00.000Z",
        comment: "J'ai besoin d'aide",
        feelingLevel: 2,
        hasBeenReviewed: false,
      }],
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
      root.render(
        <AuthContext.Provider value={{ socket } as ContextType<typeof AuthContext>}>
          <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <LastFeedback />
          </QueryClientProvider>
        </AuthContext.Provider>,
      );
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    emit.mockClear();
  });

  it("ouvre un formulaire sans chat et envoie la note facultative", async () => {
    expect(container.textContent).not.toContain("Chat");
    const reviewButton = Array.from(container.querySelectorAll("button"))
      .find((button) => button.textContent === "Review");
    expect(reviewButton).toBeDefined();

    await act(async () => reviewButton?.click());
    const textarea = container.querySelector("textarea")!;
    expect(textarea).not.toBeNull();
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
      setter?.call(textarea, "  Note pour le formateur  ");
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Valider la review")?.click();
    });
    expect(emit).toHaveBeenCalledWith("feedback-reviewed", {
      studentId: "student-1",
      feedbackId: "feedback-1",
      message: "Note pour le formateur",
    });
  });

  it("permet de valider une review sans note", async () => {
    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Review")?.click();
    });
    await act(async () => {
      Array.from(container.querySelectorAll("button"))
        .find((button) => button.textContent === "Valider la review")?.click();
    });
    expect(emit).toHaveBeenCalledWith("feedback-reviewed", {
      studentId: "student-1",
      feedbackId: "feedback-1",
      message: "",
    });
  });
});

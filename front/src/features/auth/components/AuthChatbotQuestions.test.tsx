import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import AuthChatbotQuestions from "./AuthChatbotQuestions";

afterEach(() => vi.restoreAllMocks());

describe("disposition des questions du chatbot", () => {
  it.each([390, 1600])("garde les trois pilules séparées près du bord supérieur (%s px)", width => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(width);
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(844);
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(208);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(66);
    const anchor = document.createElement("button");
    vi.spyOn(anchor, "getBoundingClientRect").mockReturnValue(new DOMRect(width - 108, 0, 96, 96));
    const bubble = document.createElement("div");
    vi.spyOn(bubble, "getBoundingClientRect").mockReturnValue(new DOMRect(width - 420, 0, 300, 120));
    const onOverlapChange = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    try {
      act(() => root.render(<AuthChatbotQuestions id="questions" message="Description de l’étape" anchorRef={{ current: anchor }} bubbleRef={{ current: bubble }} onOverlapChange={onOverlapChange} selected={null} onQuestionSelect={vi.fn()} />));
      const positions = Array.from(document.querySelectorAll<HTMLLIElement>("#questions li"), item => ({
        left: parseFloat(item.style.left), top: parseFloat(item.style.top),
      }));
      expect(positions).toHaveLength(3);
      expect(onOverlapChange).toHaveBeenCalledWith(true);
      positions.forEach(position => {
        expect(position.left).toBeGreaterThanOrEqual(12);
        expect(position.left + 208).toBeLessThanOrEqual(width - 12);
        expect(position.top).toBeGreaterThanOrEqual(12);
        expect(position.top + 66).toBeLessThanOrEqual(832);
      });
      for (let index = 1; index < positions.length; index++) {
        expect(positions[index].top - positions[index - 1].top).toBeGreaterThan(66);
      }
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});

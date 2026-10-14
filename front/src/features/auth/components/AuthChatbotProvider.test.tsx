import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import AuthChatbotProvider from "./AuthChatbotProvider";
import AuthOnboardingChatbot from "./AuthOnboardingChatbot";

vi.mock("./AuthChatbotDialogue", () => ({
  default: () => <div data-testid="chatbot-dialogue" />,
}));

describe("chatbot hébergé par le layout d'authentification", () => {
  it("disparaît quand la page qui l'a enregistré est quittée", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    try {
      act(() => root.render(
        <AuthChatbotProvider>
          <AuthOnboardingChatbot introduction={false} message="Activation" />
        </AuthChatbotProvider>,
      ));
      expect(document.querySelector('[data-testid="chatbot-dialogue"]')).not.toBeNull();

      act(() => root.render(<AuthChatbotProvider><p>Connexion</p></AuthChatbotProvider>));
      expect(document.querySelector('[data-testid="chatbot-dialogue"]')).toBeNull();
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});

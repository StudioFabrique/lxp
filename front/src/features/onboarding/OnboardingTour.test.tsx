import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../../store/AuthProvider";
import { useOnboarding } from "./OnboardingContext";
import OnboardingTour from "./OnboardingTour";

const OnboardingConsumer = () => {
  const { status, canStart } = useOnboarding();

  return <span>{`${status}:${canStart}`}</span>;
};

describe("OnboardingTour", () => {
  it("conserve un contexte inerte pendant la déconnexion", () => {
    const queryClient = new QueryClient();
    const auth = {
      user: null,
    } as React.ContextType<typeof AuthContext>;

    const markup = renderToStaticMarkup(
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={auth}>
          <MemoryRouter>
            <OnboardingTour layout="admin">
              <OnboardingConsumer />
            </OnboardingTour>
          </MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>,
    );

    expect(markup).toContain("skipped:true");
  });
});

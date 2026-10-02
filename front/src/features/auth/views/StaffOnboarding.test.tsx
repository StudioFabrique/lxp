import { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { expect, it } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import StaffOnboarding from "./StaffOnboarding";

it("affiche le chargement après l’accueil jusqu’à l’arrivée du tableau de bord", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const client = new QueryClient({ defaultOptions: { queries: { staleTime: Infinity } } });
  client.setQueryData(["staff-onboarding"], { required: false });
  let finishLoading!: () => void;
  const loading = new Promise<void>((resolve) => { finishLoading = resolve; });
  const router = createMemoryRouter([
    { path: "/staff/onboarding", element: <StaffOnboarding /> },
    {
      path: "/admin/dashboard",
      loader: async () => { await loading; return null; },
      element: <p>Tableau de bord prêt</p>,
    },
  ], { initialEntries: ["/staff/onboarding"] });

  try {
    await act(async () => root.render(
      <QueryClientProvider client={client}>
        <AuthContext value={{ user: { roles: [{ rank: 1 }] } } as never}>
          <RouterProvider router={router} />
        </AuthContext>
      </QueryClientProvider>,
    ));
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Préparation de votre espace…");
    expect(container.textContent).not.toContain("Tableau de bord prêt");
    await act(async () => finishLoading());
    expect(container.textContent).toContain("Tableau de bord prêt");
    expect(container.querySelector('[role="status"]')).toBeNull();
  } finally {
    act(() => root.unmount());
    router.dispose();
    client.clear();
    container.remove();
  }
});

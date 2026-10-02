import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { accountApi } from "../api/account.api";
import Register from "./Register";

vi.mock("../api/account.api", () => ({
  accountApi: {
    checkInvitation: vi.fn(),
    activateAccount: vi.fn(),
  },
}));

const RecoveryDestination = () => {
  const location = useLocation();
  const state = location.state as { mode?: string; email?: string } | null;
  return <p>récupération:{state?.mode}:{state?.email}</p>;
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  vi.mocked(accountApi.checkInvitation).mockReset();
  vi.mocked(accountApi.activateAccount).mockReset();
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const render = async () => {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={["/register?id=lien"]}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<RecoveryDestination />} />
          <Route path="/login" element={<p>connexion</p>} />
        </Routes>
      </MemoryRouter>,
    );
  });
  await vi.waitFor(() => {
    expect(container.querySelector('[aria-label="Vérification du lien"]')).toBeNull();
  });
};

it("propose le renvoi et préremplit l'adresse pour un lien expiré", async () => {
  vi.mocked(accountApi.checkInvitation).mockRejectedValue({
    response: {
      data: {
        code: "ACTIVATION_LINK_EXPIRED",
        message: "Ce lien d'activation a expiré.",
        email: "invitee@example.fr",
      },
    },
  });

  await render();
  expect(container.textContent).toContain("Ce lien d'activation a expiré.");
  expect(container.querySelector('input[type="password"]')).toBeNull();

  const resend = Array.from(container.querySelectorAll("a")).find((link) =>
    link.textContent?.includes("Renvoyer un lien d'activation"),
  );
  await act(async () => resend?.click());
  expect(container.textContent).toContain(
    "récupération:activation:invitee@example.fr",
  );
});

it("ne propose pas le renvoi pour un lien invalide", async () => {
  vi.mocked(accountApi.checkInvitation).mockRejectedValue({
    response: { data: { message: "Ce lien n'est plus valide." } },
  });

  await render();
  expect(container.textContent).toContain("Ce lien n'est plus valide.");
  expect(container.textContent).not.toContain("Renvoyer un lien d'activation");
});

it("termine la progression et garde la confirmation dans le panneau après activation", async () => {
  vi.mocked(accountApi.checkInvitation).mockResolvedValue({
    success: true,
    message: "Lien valide.",
    email: "invitee@example.fr",
  });
  vi.mocked(accountApi.activateAccount).mockResolvedValue({
    success: true,
    message: "Compte activé.",
  });
  await render();

  for (const input of container.querySelectorAll<HTMLInputElement>('input[type="password"]')) {
    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "Password@1234");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }
  await act(async () => {
    container.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
  });

  expect(accountApi.activateAccount).toHaveBeenCalledWith("lien", "Password@1234");
  expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow")).toBe("100");
  await vi.waitFor(() => {
    expect(container.textContent).toContain("Votre compte a été activé avec succès.");
  });
  const panel = container.querySelector('[role="progressbar"]')?.parentElement;
  expect(panel?.querySelector(".lucide-mail-check")).not.toBeNull();
  const login = panel?.querySelector<HTMLAnchorElement>('a[href="/login"]');
  expect(login?.textContent).toContain("Retour à la page de connexion");
  await act(async () => login?.click());
  expect(container.textContent).toBe("connexion");
});

it("affiche le formulaire lorsque le lien est valide", async () => {
  vi.mocked(accountApi.checkInvitation).mockResolvedValue({
    success: true,
    message: "Lien valide.",
    email: "invitee@example.fr",
  });

  await render();
  expect(container.querySelectorAll('input[type="password"]')).toHaveLength(2);
  expect(container.querySelector("header strong")?.textContent).toBe("invitee@example.fr");
  expect(container.textContent).not.toContain("Renvoyer un lien d'activation");
  expect(container.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow")).toBe("50");
  expect(container.querySelector('button[type="submit"]')?.getAttribute("form")).toBe("account-activation-form");
});

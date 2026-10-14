import { act, type PropsWithChildren } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import type Role from "../../../../utils/interfaces/role";
import { useUserForm } from "./useUserForm";
import UserForm from "./UserForm";

let form: ReturnType<typeof useUserForm>;
const roles: Role[] = [
  { _id: "000000000000000000000001", role: "admin", label: "Administrateur", rank: 1, protection: 2 },
  { _id: "000000000000000000000002", role: "teacher", label: "Équipe pédagogique", rank: 2, protection: 2 },
  { _id: "000000000000000000000003", role: "student", label: "Apprenant", rank: 3, protection: 2 },
];
const studentRoles = roles.filter((role) => role.rank === 3);
const refetch = vi.fn();
let queryError = false;
let noRoles = false;
const emptyRoles: Role[] = [];

vi.mock("../../hooks/useUserRoleOptions", () => ({
  useUserRoleOptions: (requiredRank?: number) => ({
    roles: noRoles ? emptyRoles : requiredRank === 3 ? studentRoles : roles,
    isSuccess: !queryError, isLoading: false, isFetching: false, isError: queryError, refetch,
  }),
}));
vi.mock("./useUserForm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./useUserForm")>();
  return {
    ...actual,
    useUserForm: (...args: Parameters<typeof actual.useUserForm>) => {
      form = actual.useUserForm(...args);
      return form;
    },
  };
});
vi.mock("./UserFormInformations", () => ({ default: ({ children }: PropsWithChildren) => <div>{children}</div> }));
vi.mock("./UserFormContact", () => ({ default: () => null }));
vi.mock("./UserFormCertifications", () => ({ default: () => null }));
vi.mock("../../../../components/headers/Header", () => ({
  default: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("rôles du formulaire utilisateur", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    queryError = false;
    noRoles = false;
    vi.clearAllMocks();
  });

  const renderForm = (requiredRoleRank?: number, withGroupContext = false) => {
    const submit = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    act(() => {
      root = createRoot(container);
      root.render(<MemoryRouter><UserForm onSubmitForm={submit} requiredRoleRank={requiredRoleRank} initialRoleRank={requiredRoleRank} groupCreationContext={withGroupContext ? (invitation) => <section data-testid="group-context">Suivi du groupe{invitation}</section> : undefined} /></MemoryRouter>);
    });
    return submit;
  };

  const fillAndSubmit = async () => {
    act(() => {
      form.setFirstname("Marie");
      form.setLastname("Martin");
      form.setEmail("marie@example.com");
    });
    await act(async () => {
      container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
  };

  it("affiche les cartes avec leurs icônes et enregistre le rôle choisi", async () => {
    const submit = renderForm();
    expect(container.querySelectorAll('input[type="radio"]').length).toBe(3);
    expect(container.querySelectorAll('[role="radiogroup"] label svg').length).toBe(3);
    const admin = container.querySelector<HTMLInputElement>('input[value="000000000000000000000001"]');
    expect(admin?.labels?.[0].querySelector("svg")?.classList.contains("lucide-user-cog")).toBe(true);
    act(() => admin?.click());
    await fillAndSubmit();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ roleId: roles[0]._id }), null);
  });

  it("ne propose que les apprenants et les présélectionne depuis un groupe", async () => {
    const submit = renderForm(3);
    const radios = container.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios.length).toBe(1);
    expect(radios[0].checked).toBe(true);
    expect(radios[0].labels?.[0].textContent).toBe("Apprenant");
    await fillAndSubmit();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ roleId: roles[2]._id }), null);
  });

  it("envoie le choix d'invitation validé avec le formulaire", async () => {
    const submit = renderForm(3);
    act(() => container.querySelector<HTMLInputElement>('[role="switch"]')?.click());
    await fillAndSubmit();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ invitationSent: true }), null);
  });

  it("place l'invitation dans un encadré distinct au-dessus des rôles sans groupe", () => {
    renderForm();
    const invitation = container.querySelector('[data-testid="user-invitation"]');
    const roles = container.querySelector('[data-testid="user-role"]');
    expect(invitation?.parentElement?.nextElementSibling).toBe(roles);
    expect(invitation?.closest('[data-testid="user-informations"]')).toBe(null);
    expect(invitation?.closest('[data-testid="user-role"]')).toBe(null);
    expect(container.querySelectorAll('[role="switch"]').length).toBe(1);
  });

  it("place le suivi sous le header avec l'invitation et une seule sauvegarde", () => {
    renderForm(3, true);
    const header = container.querySelector('[data-testid="user-save"]')?.parentElement;
    const context = container.querySelector('[data-testid="group-context"]');
    expect(header?.nextElementSibling).toBe(context);
    expect(container.querySelector("form")?.firstElementChild).toBe(header);
    const invitation = container.querySelector('[data-testid="user-invitation"]');
    expect(invitation?.closest('[data-testid="user-role"]')).toBe(null);
    expect(invitation?.closest('[data-testid="group-context"]')).toBe(context);
    expect(invitation?.closest('[data-testid="user-informations"]')).toBe(null);
    expect(container.querySelectorAll('[role="switch"]').length).toBe(1);
    expect(container.querySelectorAll('button[type="submit"]').length).toBe(1);
    expect(container.querySelector('button[type="submit"]')?.closest('[data-testid="user-form"]')).not.toBe(null);
  });

  it("enregistre le choix d'invitation depuis le suivi du groupe", async () => {
    const submit = renderForm(3, true);
    act(() => container.querySelector<HTMLInputElement>('[data-testid="group-context"] [role="switch"]')?.click());
    await fillAndSubmit();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ invitationSent: true }), null);
  });

  it("corrige un rôle hors du périmètre du groupe avant l'envoi", async () => {
    const submit = renderForm(3);
    act(() => form.setRoleId(roles[0]._id));
    expect(form.roleId).toBe(roles[2]._id);
    await fillAndSubmit();
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ roleId: roles[2]._id }), null);
  });

  it("bloque la soumission sans rôle disponible", async () => {
    noRoles = true;
    const submit = renderForm(3);
    await fillAndSubmit();
    expect(submit).not.toHaveBeenCalled();
    expect(container.textContent).toContain("Veuillez choisir un rôle apprenant disponible.");
  });

  it("affiche une erreur de chargement et permet de réessayer", async () => {
    queryError = true;
    const submit = renderForm(3);
    expect(container.textContent).toContain("Impossible de charger les rôles.");
    const retry = Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Réessayer");
    act(() => retry?.click());
    expect(refetch).toHaveBeenCalledTimes(1);
    await fillAndSubmit();
    expect(submit).not.toHaveBeenCalled();
  });
});

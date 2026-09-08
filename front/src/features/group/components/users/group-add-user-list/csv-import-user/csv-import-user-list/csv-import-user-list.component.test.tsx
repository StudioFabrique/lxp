import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type User from "../../../../../../../utils/interfaces/user";
import CsvImportUserList from "./csv-import-user-list.component";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
  createMany: vi.fn(),
  downloadFile: vi.fn(),
  toast: Object.assign(vi.fn(), {
    error: vi.fn(),
    success: vi.fn(),
  }),
}));

vi.mock("../../../../../../../components/UI/right-side-drawer/right-side-drawer", () => ({
  default: ({
    children,
    isOpen,
    title,
  }: {
    children: ReactNode;
    isOpen?: boolean;
    title: string;
  }) => (isOpen ? <aside aria-label={title}>{children}</aside> : null),
}));

vi.mock("../csv-import.component", () => ({
  default: ({ onParseCsv }: { onParseCsv: (users: User[]) => void }) => (
    <button
      type="button"
      onClick={() =>
        onParseCsv([
          {
            email: " student@example.fr ",
            firstname: "Ada",
            lastname: "Lovelace",
          } as User,
        ])
      }
    >
      Importer
    </button>
  ),
}));

vi.mock("../../../../../../user/api/user.api", () => ({
  mutations: { createMany: mocks.createMany },
}));

vi.mock("../../../../../../../utils/helpers/download-csv-template", () => ({
  downloadFile: mocks.downloadFile,
}));

vi.mock("react-hot-toast", () => ({ toast: mocks.toast }));

const getButton = (container: HTMLElement, label: string) =>
  [...container.querySelectorAll("button")].find(
    (button) => button.textContent?.trim() === label,
  );

describe("CsvImportUserList", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    if (root) act(() => root?.unmount());
    container?.remove();
    root = undefined;
    container = undefined;
    vi.clearAllMocks();
  });

  const renderComponent = (onAddUsers = vi.fn()) => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root?.render(<CsvImportUserList onAddUsers={onAddUsers} />));
    return onAddUsers;
  };

  it("ouvre le drawer avant de proposer la sélection du fichier", async () => {
    renderComponent();
    mocks.downloadFile.mockResolvedValue(true);

    expect(getButton(container!, "Télécharger le modèle")).toBeUndefined();
    expect(getButton(container!, "Importer")).toBeUndefined();

    act(() => {
      getButton(container!, "Importer une liste d'étudiants")?.click();
    });

    expect(getButton(container!, "Télécharger le modèle")).toBeDefined();
    expect(getButton(container!, "Importer")).toBeDefined();

    await act(async () => {
      getButton(container!, "Télécharger le modèle")?.click();
      await Promise.resolve();
    });

    expect(mocks.downloadFile).toHaveBeenCalledWith(
      expect.stringMatching(/\/csv-users-group-modele\.csv$/),
      "csv-users-group-modele.csv",
    );
  });

  it("permet de confirmer un CSV dans un groupe vide", async () => {
    const createdUser = {
      _id: "student-id",
      email: "student@example.fr",
      firstname: "Ada",
      lastname: "Lovelace",
    } as User;
    const onAddUsers = renderComponent();
    mocks.createMany.mockResolvedValue({
      usersCreated: [createdUser],
      createdCount: 1,
      message: "1 utilisateur créé.",
    });

    act(() => {
      getButton(container!, "Importer une liste d'étudiants")?.click();
    });
    act(() => {
      getButton(container!, "Importer")?.click();
    });

    const confirmButton = getButton(container!, "Confirmer la création");
    expect(confirmButton?.disabled).toBe(false);

    await act(async () => {
      confirmButton?.click();
      await Promise.resolve();
    });

    expect(mocks.createMany).toHaveBeenCalledWith([
      expect.objectContaining({ email: "student@example.fr" }),
    ]);
    expect(onAddUsers).toHaveBeenCalledWith([createdUser]);
    expect(getButton(container!, "Télécharger le modèle")).toBeUndefined();
  });
});

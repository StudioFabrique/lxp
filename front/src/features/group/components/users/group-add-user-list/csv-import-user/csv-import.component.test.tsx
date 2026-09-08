import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type User from "../../../../../../utils/interfaces/user";
import CsvImportUser from "./csv-import.component";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mocks = vi.hoisted(() => ({
  parse: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("papaparse", () => ({ default: { parse: mocks.parse } }));
vi.mock("react-hot-toast", () => ({
  default: { error: mocks.toastError },
}));

type ParseOptions = {
  complete: (result: {
    data: Array<Record<string, string>>;
    meta: { fields?: string[] };
  }) => void;
};

describe("CsvImportUser", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    if (root) act(() => root?.unmount());
    container?.remove();
    root = undefined;
    container = undefined;
    vi.clearAllMocks();
  });

  const selectCsv = (onParseCsv: (users: User[]) => void) => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <CsvImportUser fields={["email"]} onParseCsv={onParseCsv} />,
      ),
    );

    const input = container.querySelector<HTMLInputElement>('input[type="file"]')!;
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [new File(["email\nstudent@example.fr"], "students.csv")],
    });
    act(() => input.dispatchEvent(new Event("change", { bubbles: true })));
  };

  it("affiche le bouton d'import demandé dans une zone en pointillés", () => {
    selectCsv(vi.fn());

    expect(container?.textContent).toContain("Importer");
    expect(container?.querySelector("button")?.className).toContain(
      "border-dashed",
    );
  });

  it("transmet les lignes d'un CSV conforme", () => {
    const onParseCsv = vi.fn();
    selectCsv(onParseCsv);
    const options = mocks.parse.mock.calls[0][1] as ParseOptions;

    act(() => {
      options.complete({
        data: [{ email: "student@example.fr" }],
        meta: { fields: ["email"] },
      });
    });

    expect(onParseCsv).toHaveBeenCalledWith([
      { email: "student@example.fr" },
    ]);
  });

  it("refuse un CSV qui ne contient pas les colonnes attendues", () => {
    const onParseCsv = vi.fn();
    selectCsv(onParseCsv);
    const options = mocks.parse.mock.calls[0][1] as ParseOptions;

    act(() => {
      options.complete({
        data: [{ name: "Ada" }],
        meta: { fields: ["name"] },
      });
    });

    expect(onParseCsv).not.toHaveBeenCalled();
    expect(mocks.toastError).toHaveBeenCalledWith(
      "Format des données non conforme",
    );
  });
});

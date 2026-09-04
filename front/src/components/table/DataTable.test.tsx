import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";

type Row = { id: string; name: string };

describe("DataTable", () => {
  it("utilise l'état vide partagé avec le message fourni", () => {
    const markup = renderToStaticMarkup(
      <DataTable
        columns={[{ accessorKey: "name", header: "Nom" }]}
        data={[]}
        emptyMessage="Aucun utilisateur disponible"
      />,
    );

    expect(markup).toContain("Aucun utilisateur disponible");
    expect(markup).toContain("min-h-[50vh]");
    expect(markup).not.toContain("<table");
    expect(markup).not.toContain("Nom");
  });

  it("déclenche le clic de ligne depuis une cellule de données", () => {
    const row: Row = { id: "student-id", name: "Camille Martin" };
    const onRowClick = vi.fn();
    const container = document.createElement("div");
    const root: Root = createRoot(container);
    document.body.appendChild(container);

    try {
      act(() => {
        root.render(
          <DataTable
            columns={[{ accessorKey: "name", header: "Nom" }]}
            data={[row]}
            onRowClick={onRowClick}
          />,
        );
      });

      act(() => {
        container
          .querySelector("tbody td")
          ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });

      expect(onRowClick).toHaveBeenCalledOnce();
      expect(onRowClick).toHaveBeenCalledWith(row);
    } finally {
      act(() => root.unmount());
      container.remove();
    }
  });
});

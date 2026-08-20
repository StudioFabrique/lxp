import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import { DataTable } from "./DataTable";

type Row = { id: string; name: string };

describe("DataTable", () => {
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

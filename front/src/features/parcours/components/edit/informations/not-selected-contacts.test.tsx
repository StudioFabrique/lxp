import { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import NotSelectedContacts from "./not-selected-contacts";

vi.mock("../../../../../components/UI/right-side-drawer/right-side-drawer", () => ({ default: () => null }));
vi.mock("../../../../../../src/components/user-quick-create/user-quick-create", () => ({ default: () => null }));

it("sélectionne tous les contacts, conserve la sélection au tri et ajoute les bons identifiants", async () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const client = new QueryClient();
  const onAddItems = vi.fn();
  const onCloseDrawer = vi.fn();
  try {
    await act(async () => {
      root.render(<QueryClientProvider client={client}><NotSelectedContacts
        list={[
          { id: 1, idMdb: "one", firstname: "Martin", lastname: "D", role: "teacher" },
          { id: 2, idMdb: "two", firstname: "Alice", lastname: "A", role: "teacher" },
        ]}
        onAddItems={onAddItems} onCloseDrawer={onCloseDrawer}
      /></QueryClientProvider>);
    });
    const boxes = () => Array.from(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'));
    await act(async () => { boxes()[0].click(); });
    expect(boxes().every((box) => box.checked)).toBe(true);
    await act(async () => { container.querySelectorAll("th")[1].click(); });
    expect(boxes().every((box) => box.checked)).toBe(true);
    await act(async () => { boxes()[1].click(); });
    expect(boxes()[0].checked).toBe(false);
    await act(async () => { boxes()[1].click(); });
    expect(boxes()[0].checked).toBe(true);
    await act(async () => { boxes()[0].click(); });
    expect(boxes().every((box) => !box.checked)).toBe(true);
    await act(async () => { boxes()[0].click(); });
    await act(async () => {
      Array.from(container.querySelectorAll("button")).find((button) => button.textContent === "Ajouter")!.click();
    });
    expect(onAddItems).toHaveBeenCalledWith([1, 2]);
    expect(onCloseDrawer).toHaveBeenCalledWith("add-contacts");
  } finally {
    act(() => root.unmount());
    client.clear();
    container.remove();
  }
});

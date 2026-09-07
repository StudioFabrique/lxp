import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import TablePagination from "./TablePagination";

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
});

describe("TablePagination", () => {
  it("remonte la liste après chaque changement de page", () => {
    const scrollTo = vi.fn();
    const main = document.createElement("main");
    main.id = "main-scroll-container";
    Object.defineProperty(main, "scrollTo", { value: scrollTo });
    const container = document.createElement("div");
    main.append(container);
    document.body.append(main);

    const onSetCurrentPage = vi.fn();
    const onSetItemsPerPage = vi.fn();
    const onSetPreviousPage = vi.fn();
    const onSetNextPage = vi.fn();

    root = createRoot(container);
    act(() =>
      root?.render(
        <TablePagination
          currentPage={2}
          maxPage={3}
          itemsPerPage={5}
          onSetCurrentPage={onSetCurrentPage}
          onSetItemsPerPage={onSetItemsPerPage}
          onSetPreviousPage={onSetPreviousPage}
          onSetNextPage={onSetNextPage}
        />,
      ),
    );

    const click = (button: Element | null) => {
      act(() => {
        button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    };

    click(container.querySelector('[aria-label="Page précédente"]'));
    click(container.querySelector('[aria-label="Page suivante"]'));
    click(
      Array.from(container.querySelectorAll("button")).find(
        (button) => button.textContent?.trim() === "3",
      ) ?? null,
    );
    click(
      Array.from(container.querySelectorAll("button")).find(
        (button) => button.textContent?.trim() === "10",
      ) ?? null,
    );

    expect(onSetPreviousPage).toHaveBeenCalledOnce();
    expect(onSetNextPage).toHaveBeenCalledOnce();
    expect(onSetCurrentPage).toHaveBeenCalledWith(3);
    expect(onSetItemsPerPage).toHaveBeenCalledWith(10);
    expect(scrollTo).toHaveBeenCalledTimes(4);
    expect(scrollTo).toHaveBeenLastCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });
});

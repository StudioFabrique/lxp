import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import RoleTypeSelector from "./RoleTypeSelector";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe("RoleTypeSelector", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
  });

  const renderSelector = (minimumRank: number, disabled = false, editMode = false) => {
    const onChange = vi.fn();
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() => root?.render(
      <>
        <span id="model-label">Modèle de rôle</span>
        <RoleTypeSelector
          id="model"
          minimumRank={minimumRank}
          currentRoleType={2}
          onSetCurrentRoleType={onChange}
          disabled={disabled}
          editMode={editMode}
        />
      </>,
    ));
    return onChange;
  };

  it("affiche les modèles avec leurs icônes et transmet le rang sélectionné", () => {
    const onChange = renderSelector(0);
    const radios = container?.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios?.length).toBe(4);
    expect(container?.querySelectorAll("label svg").length).toBe(4);
    expect(container?.querySelector('[role="radiogroup"]')?.getAttribute("aria-labelledby")).toBe("model-label");
    expect(radios?.[1].checked).toBe(true);
    const learnerRadio = radios?.[2];
    expect(learnerRadio?.labels?.[0].textContent).toBe("Apprenant");
    act(() => learnerRadio?.click());
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("limite les modèles aux rangs que l'utilisateur peut attribuer", () => {
    renderSelector(2);
    const radios = container?.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(Array.from(radios ?? []).map((radio) => radio.value)).toEqual(["3", "4"]);
  });

  it("empêche la modification quand le modèle est verrouillé", () => {
    const onChange = renderSelector(0, true, true);
    const radio = container?.querySelector<HTMLInputElement>('input[value="3"]');
    expect(radio?.disabled).toBe(true);
    act(() => radio?.click());
    expect(onChange).not.toHaveBeenCalled();
    expect(container?.textContent).not.toContain("remplacera automatiquement");
  });

  it("annonce le remplacement des permissions pendant une modification", () => {
    renderSelector(0, false, true);
    expect(container?.querySelector('[role="radiogroup"]')?.getAttribute("aria-describedby")).toBe("model-warning");
    expect(container?.querySelector("#model-warning")?.textContent).toContain("remplacera automatiquement");
  });
});

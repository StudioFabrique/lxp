import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useUserForm } from "./useUserForm";

describe("useUserForm", () => {
  let container: HTMLDivElement;
  let root: Root;
  let form: ReturnType<typeof useUserForm>;

  const Harness = () => {
    form = useUserForm(null);
    return null;
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);

    act(() => {
      root = createRoot(container);
      root.render(<Harness />);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("attend la sortie du champ avant d'afficher l'erreur de format d'email", () => {
    act(() => form.setEmail("adresse-incomplete"));

    expect(form.emailError).toBe(false);

    act(() => form.touchEmail());

    expect(form.emailError).toBe(true);
  });

  it("garde le formulaire invalide avant que l'erreur d'email soit affichée", () => {
    act(() => {
      form.setFirstname("Marie");
      form.setLastname("Dupont");
      form.setEmail("adresse-incomplete");
    });

    expect(form.emailError).toBe(false);
    expect(form.formIsValid).toBe(false);
  });
});

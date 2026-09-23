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

  it("affiche l'erreur de format seulement après une tentative de sauvegarde", () => {
    act(() => form.setEmail("adresse-incomplete"));

    expect(form.emailError).toBe(false);

    act(() => form.validateEmail());

    expect(form.emailError).toBe(true);

    act(() => form.setEmail("marie@example.com"));

    expect(form.emailError).toBe(false);
    expect(form.formIsValid).toBe(false);
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

  it("accepte une adresse valide avec des espaces autour, comme à l'envoi", () => {
    act(() => {
      form.setFirstname("Marie");
      form.setLastname("Dupont");
      form.setEmail(" marie@example.com ");
    });

    expect(form.formIsValid).toBe(true);
    expect(form.buildUserData().email).toBe("marie@example.com");
  });
});

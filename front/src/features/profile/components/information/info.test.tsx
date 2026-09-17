import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Info from "./info";

const TestInfo = () => {
  const {
    register,
    formState: { errors },
  } = useForm();
  return <Info formProps={{ register, errors }} />;
};

describe("Info", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
  });

  it("ne présente plus le rôle ni la photo dans le formulaire", () => {
    act(() => {
      root = createRoot(container);
      root.render(<TestInfo />);
    });

    expect(container.querySelector("#current-role")).toBeNull();
    expect(container.querySelector('input[type="file"]')).toBeNull();
  });

  it("permet de modifier l'adresse email", () => {
    act(() => {
      root = createRoot(container);
      root.render(<TestInfo />);
    });

    const emailInput = container.querySelector<HTMLInputElement>(
      'input[name="email"]',
    );
    expect(emailInput).not.toBeNull();
    expect(emailInput?.disabled).toBe(false);
    expect(emailInput?.readOnly).toBe(false);
  });

  it("répartit les champs demandés en deux colonnes sans présentation", () => {
    act(() => {
      root = createRoot(container);
      root.render(<TestInfo />);
    });

    const columns = container.querySelectorAll<HTMLDivElement>(".grid > div");
    const fieldNames = (column: HTMLDivElement) =>
      [...column.querySelectorAll<HTMLInputElement>("input")].map(
        (input) => input.name,
      );

    expect(fieldNames(columns[0])).toEqual([
      "firstname",
      "lastname",
      "nickname",
      "email",
    ]);
    expect(fieldNames(columns[1])).toEqual([
      "address",
      "city",
      "postCode",
      "phoneNumber",
    ]);
    expect(container.querySelector("textarea")).toBeNull();
  });
});

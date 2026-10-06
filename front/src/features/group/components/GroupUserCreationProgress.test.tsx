import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import GroupUserCreationProgress from "./GroupUserCreationProgress";

const renderProgress = (returnTo: string): HTMLDivElement => {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(
    <GroupUserCreationProgress returnTo={returnTo} />,
  );
  return container;
};

describe("suivi du groupe pendant la création d'un apprenant", () => {
  it("rappelle le brouillon et distingue l'étape courante de la finalisation", () => {
    const params = new URLSearchParams({
      groupName: "Promotion automne", groupDescription: "Groupe du matin",
      groupFormation: "4", groupParcours: "12", groupStudents: "student-1,student-2,student-1",
    });
    const container = renderProgress(`/admin/group/add?${params.toString()}`);
    expect(container.textContent).toContain("Création du groupe en cours");
    expect(container.querySelector("h2")?.textContent).toBe("Promotion automne (2 apprenants)");
    expect(container.querySelector('[aria-current="step"]')?.textContent).toContain("Créer l’apprenant");
    expect(container.querySelector("details")).toBe(null);
    expect(container.textContent).not.toContain("Détails du groupe");
    expect(container.textContent).toContain("Finaliser le groupe");
  });

  it("affiche les informations absentes sans annoncer un groupe enregistré", () => {
    const container = renderProgress("/admin/group/add");
    expect(container.textContent).toContain("Groupe sans nom (0 apprenant)");
    expect(container.textContent).not.toContain("Chargement");
    expect(container.textContent).not.toContain("Groupe créé");
  });

  it("adapte le suivi pour une modification et affiche le nombre au singulier", () => {
    const container = renderProgress("/admin/group/edit/group-id?groupName=Promotion&groupStudents=student-1");
    expect(container.textContent).toContain("Modification du groupe en cours");
    expect(container.textContent).toContain("Promotion (1 apprenant)");
    expect(container.textContent).toContain("Enregistrer le groupe");
  });

  it("n'affiche aucun suivi pour une destination étrangère au groupe", () => {
    expect(renderProgress("https://example.com/admin/group/add").innerHTML).toBe("");
  });

});

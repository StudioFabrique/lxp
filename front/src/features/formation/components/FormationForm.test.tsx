import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import FormationForm from "./FormationForm";

const renderForm = (deleteDisabled = false) =>
  renderToStaticMarkup(
    <FormationForm
      title="Formation test"
      onTitle={vi.fn()}
      description=""
      onDescription={vi.fn()}
      code=""
      onCode={vi.fn()}
      level="4"
      onLevel={vi.fn()}
      tagInput=""
      onTagInput={vi.fn()}
      currentTags={[]}
      onTagSubmit={vi.fn()}
      onRemoveTag={vi.fn()}
      isEditing
      isPending={false}
      deleteDisabled={deleteDisabled}
      onSubmit={vi.fn()}
      onCancel={vi.fn()}
      onDelete={vi.fn()}
    />,
  );

describe("FormationForm", () => {
  it("n'affiche qu'une seule action d'annulation", () => {
    const markup = renderForm();

    expect(markup.match(/Annuler/g)).toHaveLength(1);
  });

  it("place l'action de suppression dans le formulaire d'édition", () => {
    expect(renderForm()).toContain("Supprimer la formation");
  });

  it("interdit la suppression lorsque des parcours sont rattachés", () => {
    const markup = renderForm(true);

    expect(markup).toContain(
      "Suppression impossible : des parcours sont rattachés",
    );
    expect(markup).toMatch(/<button[^>]*disabled=""[^>]*>.*Supprimer la formation/s);
  });
});

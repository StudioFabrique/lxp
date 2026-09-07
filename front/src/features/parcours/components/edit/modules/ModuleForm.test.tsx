import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { UseFormRegister } from "react-hook-form";

import type { ModuleCreateFormValues } from "../../../parcours.schema";
import ModuleForm from "./ModuleForm";

const register = vi.fn((name: string) => ({ name })) as unknown as UseFormRegister<ModuleCreateFormValues>;

describe("ModuleForm", () => {
  it("n'affiche plus les affectations ni le sélecteur d'image", () => {
    const markup = renderToStaticMarkup(
      <ModuleForm
        refForm={{ current: null }}
        register={register}
        errors={{}}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(markup).not.toContain("Affectations");
    expect(markup).not.toContain("Image du module");
    expect(markup).not.toContain("Modifier l&#x27;image du module");
  });

  it("affiche les compétences conservées en lecture seule lors d'une duplication", () => {
    const markup = renderToStaticMarkup(
      <ModuleForm
        refForm={{ current: null }}
        register={register}
        errors={{}}
        isSubmitting={false}
        duplicatedSkills={[
          { id: 2, description: "Structurer ses idées" },
        ]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(markup).toContain("Compétences dupliquées");
    expect(markup).toContain('data-tip="Structurer ses idées"');
    expect(markup).toContain("lecture seule");
  });
});

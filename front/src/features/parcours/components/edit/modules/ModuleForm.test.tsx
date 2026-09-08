import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { UseFormRegister } from "react-hook-form";

import type { ModuleCreateFormValues } from "../../../parcours.schema";
import ModuleForm from "./ModuleForm";

const register = vi.fn((name: string) => ({ name })) as unknown as UseFormRegister<
  ModuleCreateFormValues
>;

describe("ModuleForm", () => {
  it("affiche le sélecteur d'image sans réafficher les affectations", () => {
    const markup = renderToStaticMarkup(
      <ModuleForm
        mode="create"
        register={register}
        errors={{}}
        isSubmitting={false}
        onSetFile={vi.fn()}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(markup).not.toContain("Affectations");
    expect(markup).toContain("Image du module");
    expect(markup).toContain("Téléverser une image");
    expect(markup).toContain('type="file"');
    expect(markup).not.toContain("Modifier l&#x27;image du module");
    expect(markup).toContain(
      '<footer class="relative z-10 -mx-5 mt-6',
    );
    expect(markup).toContain(
      'id="module-form" class="mt-6 min-h-0 flex-1 overflow-y-auto"',
    );
    expect(markup).toContain('</form><footer class="relative z-10');
    expect(markup).toContain("shrink-0");
    expect(markup).toContain('type="submit" form="module-form"');
    expect(markup).toContain("sm:pb-7");
  });

  it("affiche les compétences conservées en lecture seule lors d'une duplication", () => {
    const markup = renderToStaticMarkup(
      <ModuleForm
        mode="edit"
        register={register}
        errors={{}}
        isSubmitting={false}
        existingImage="data:image/png;base64,module-image"
        onSetFile={vi.fn()}
        duplicatedSkills={[
          { id: 2, description: "Structurer ses idées" },
        ]}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(markup).toContain("Compétences dupliquées");
    expect(markup).toContain("module-image");
    expect(markup).toContain('data-tip="Structurer ses idées"');
    expect(markup).toContain("lecture seule");
  });
});

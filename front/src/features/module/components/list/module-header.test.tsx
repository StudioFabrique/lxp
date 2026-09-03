import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../../../../store/AuthProvider";
import type User from "../../../../utils/interfaces/user";
import ModuleHeader from "./module-header";

const renderHeader = (rank: number) => {
  const auth = {
    user: { roles: [{ rank }] } as User,
  } as React.ContextType<typeof AuthContext>;

  return renderToStaticMarkup(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/admin/module"]}>
        <ModuleHeader />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
};

describe("ModuleHeader", () => {
  it("présente les modules comme ceux du formateur", () => {
    const markup = renderHeader(2);

    expect(markup).toContain("Mes modules");
    expect(markup).toContain("qui vous sont affectés");
  });

  it("conserve le libellé général pour un administrateur", () => {
    expect(renderHeader(1)).toContain("Liste des modules");
  });
});

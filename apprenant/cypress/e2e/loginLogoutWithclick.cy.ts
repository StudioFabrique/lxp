describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:3000");
    cy.get(".loginForm").should("exist");
    cy.get("input[name=username]").type("test@toto.fr");
    cy.get("input[name=password]").type("Abcdef@123456");
    cy.get(".submit").click();
    // cy.url().should("include", "/intranet/profil");
    cy.get("input[name=reset]").should("not.exist");
    cy.get(".home").should("exist");
    cy.get(".logout").click();
    cy.get(".loginForm").should("exist");
  });
});

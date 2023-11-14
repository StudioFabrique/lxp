/**
 * test les fonctionnalités de connexion et de déxonnexion
 */

describe("the home page", () => {
  it("successfully loads", () => {
    cy.visit("http://localhost:3000");
    cy.get("input[name=email]").type("toto@toto.fr");
    cy.get("input[name=password]").type(`Abcdef@123456{enter}`);
    cy.get(".home").should("contains.text", "Hey");
    cy.get("button").click();
    cy.get("input[name=email").should("exist");
    cy.get(".home").should("not.exist");
  });
});

describe("Navigation", () => {
  it("should visit root", () => {
    cy.visit("/");
  });
  it("should select Tuesday when clicked and verify background color", () => {
    cy.contains("li", "Tuesday")
      .click()
      .should("have.css", "background-color", "rgb(242, 242, 242)");
  });
  it("should select Tuesday when clicked and verify class name", () => {
    cy.contains("[data-testid=day]", "Tuesday") // [anything in here are treated as attr]
      .click()
      .should("have.class", "day-list__item--selected");
  });
});

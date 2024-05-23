describe('Simple Test', () => {
  it('Renders elements', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="dataset-id-field"]').should('be.visible');
    cy.get('[data-cy="upload-file-button"]').should('be.visible');
    cy.get('[data-cy="submit-button"]').should('be.visible');
  });
});

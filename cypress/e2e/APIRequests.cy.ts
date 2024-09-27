import { successResponse } from 'cypress/fixtures/mocked-responses';

describe('API Requests', () => {
  it('Tests the upload request with a mock response and inspects the request body', () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '/openneuro/upload*',
      },
      (req) => {
        req.reply(successResponse);
      }
    ).as('uploadFile');

    cy.visit('http://localhost:5173');

    cy.get('[data-cy="upload-ds000001-button"]').click();
    cy.get('[data-cy="user-name-field"]').type('John Doe');
    cy.get('[data-cy="email-field"]').type('johndoe@noreply.com');
    cy.get('[data-cy="changes-summary-field"]').type('This is a summary of the changes');

    cy.get('input[type="file"]').attachFile('participants.json');

    cy.contains('File uploaded: participants.json');

    cy.get('[data-cy="submit-button"]').click();

    cy.wait('@uploadFile').then((interception) => {
      const requestBody = interception.request.body;

      expect(requestBody).to.include(
        'Content-Disposition: form-data; name="data_dictionary"; filename="participants.json"'
      );

      expect(requestBody).to.include('Content-Disposition: form-data; name="name"');
      expect(requestBody).to.include('John Doe');

      expect(requestBody).to.include('Content-Disposition: form-data; name="email"');
      expect(requestBody).to.include('johndoe@noreply.com');

      expect(requestBody).to.include('Content-Disposition: form-data; name="changes_summary"');
      expect(requestBody).to.include('This is a summary of the changes');
    });
  });
});

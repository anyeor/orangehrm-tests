/// <reference types="Cypress" />

describe('Testy logowania', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
        });
    });

    it('powinien zalogować użytkownika z prawidłowymi danymi', () => {
        cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
        cy.get('h6.oxd-text').should('have.text', 'Dashboard');
    });

    it('powinien wyświetlić błąd przy nieprawidłowych danych', () => {
        cy.login(testData.authentication.invalidCredentials.username, testData.authentication.invalidCredentials.password);
        cy.get('div > p.oxd-alert-content-text').should('have.text', 'Invalid credentials');
    });

    it('powinien wyświetlić błąd przy pustych polach', () => {
        cy.get('button[class*="login"]').click();
        cy.get('span.oxd-input-field-error-message').should('exist');
    });
});

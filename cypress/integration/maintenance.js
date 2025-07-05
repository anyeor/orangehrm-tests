/// <reference types="Cypress" />

describe('Testy trybu maintenance', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
            cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
            cy.get('h6.oxd-text').should('have.text', 'Dashboard');
            cy.get('a[href*="maintenance"]').click();
        });
    });

    it('powinien uzyskać dostęp do trybu maintenance z prawidłowym hasłem', () => {
        cy.typeInField('Password', testData.authentication.validCredentials.password);
        cy.get('button[type="submit"]').click();
        
        // Weryfikacja czy użytkownik jest w trybie maintenance
        cy.get('h6.oxd-text.oxd-topbar-header-breadcrumb-module')
            .should('have.text', 'Maintenance');
    });

    it('powinien odmówić dostępu do trybu maintenance z nieprawidłowym hasłem', () => {
        cy.typeInField('Password', testData.authentication.invalidCredentials.password);
        cy.get('button[type="submit"]').click();
        
        // Weryfikacja czy wyświetlił się błąd
        cy.get('div[class*=error] > p')
            .should('have.text', 'Invalid credentials');
    });

    it('powinien wyświetlić błąd przy pustym polu hasła', () => {
        cy.get('button[type="submit"]').click();
        
        // Weryfikacja czy wyświetlił się błąd walidacji
        cy.get('span.oxd-input-field-error-message')
            .should('exist');
    });
});
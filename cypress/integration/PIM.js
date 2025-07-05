/// <reference types="Cypress" />

describe('Testy zarządzania pracownikami (PIM)', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
            cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
            cy.get('h6.oxd-text').should('have.text', 'Dashboard');
            cy.get('a[href*="Pim"]').click();
        });
    });

    it('powinien dodać nowego pracownika', () => {
        // Usuń pracownika jeśli istnieje
        cy.search('Employee Name', testData.employees.newEmployee.firstName);
        cy.deleteEmployee(testData.employees.newEmployee.firstName);
        
        // Dodaj pracownika
        cy.addEmployee(testData.employees.newEmployee.firstName, testData.employees.newEmployee.lastName, testData.employees.newEmployee.employeeID);
        
        // Weryfikacja dodania pracownika
        cy.get('div[class*="employee-name"] > h6')
            .should('have.text', `${testData.employees.newEmployee.firstName} ${testData.employees.newEmployee.lastName}`);
    });

    it('powinien edytować dane pracownika', () => {
        // Upewnij się, że pracownik istnieje
        cy.search('Employee Name', testData.employees.newEmployee.firstName);
        cy.get('body').then(($body) => {
            if ($body.find('div.oxd-table-card > div[role="row"]').length === 0) {
                // Jeśli pracownik nie istnieje, najpierw go dodaj
                cy.addEmployee(testData.employees.newEmployee.firstName, testData.employees.newEmployee.lastName, testData.employees.newEmployee.employeeID);
                cy.get('a[href*="Pim"]').click();
                cy.search('Employee Name', testData.employees.newEmployee.firstName);
            }
        });
        
        // Edytuj dane pracownika
        cy.get('div.oxd-table-card > div[role="row"]').first().within(() => {
            cy.get('i.bi-pencil-fill').parent().click();
        });
        
        // Zaktualizuj dane
        cy.get('input[name="firstName"]').clear().type(testData.employees.editedEmployee.firstName);
        cy.get('input[name="lastName"]').clear().type(testData.employees.editedEmployee.lastName);
        cy.get('div.oxd-form-actions > p + button').click();
        
        // Weryfikacja edycji
        cy.get('div[class*="employee-name"] > h6')
            .should('contain', testData.employees.editedEmployee.firstName);
    });

    it('powinien usunąć pracownika', () => {
        // Upewnij się, że pracownik istnieje
        cy.search('Employee Name', testData.employees.editedEmployee.firstName);
        cy.get('body').then(($body) => {
            if ($body.find('div.oxd-table-card > div[role="row"]').length === 0) {
                // Jeśli pracownik nie istnieje, najpierw go dodaj
                cy.addEmployee(testData.employees.editedEmployee.firstName, testData.employees.editedEmployee.lastName, testData.employees.newEmployee.employeeID);
                cy.get('a[href*="Pim"]').click();
                cy.search('Employee Name', testData.employees.editedEmployee.firstName);
            }
        });
        
        // Usuń pracownika
        cy.deleteEmployee(testData.employees.editedEmployee.firstName);
        
        // Weryfikacja usunięcia
        cy.get('div > span.oxd-text').should('have.text', 'No Records Found');
    });

    it('powinien wyszukać pracownika po imieniu', () => {
        // Upewnij się, że pracownik istnieje
        cy.search('Employee Name', testData.employees.newEmployee.firstName);
        cy.get('body').then(($body) => {
            if ($body.find('div.oxd-table-card > div[role="row"]').length === 0) {
                cy.addEmployee(testData.employees.newEmployee.firstName, testData.employees.newEmployee.lastName, testData.employees.newEmployee.employeeID);
                cy.get('a[href*="Pim"]').click();
            }
        });
        
        // Wyszukaj pracownika
        cy.search('Employee Name', testData.employees.newEmployee.firstName);
        
        // Weryfikacja wyników wyszukiwania
        cy.get('div.oxd-table-card > div[role="row"]').should('exist');
        cy.get('div.oxd-table-card').should('contain', testData.employees.newEmployee.firstName);
    });

    it('powinien wyświetlić komunikat o braku wyników dla nieistniejącego pracownika', () => {
        const nonExistentName = 'NonExistentEmployee12345';
        
        cy.search('Employee Name', nonExistentName);
        cy.get('div > span.oxd-text').should('have.text', 'No Records Found');
    });
});
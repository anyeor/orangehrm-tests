/// <reference types="Cypress" />

describe('Testy administracji', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
            cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
            cy.get('h6.oxd-text').should('have.text', 'Dashboard');
            cy.get('a[href*="Admin"]').click();
        });
    });

    describe('Zarządzanie użytkownikami', () => {
        it('powinien dodać nowego użytkownika do systemu', () => {
            // Usuń użytkownika jeśli istnieje
            cy.deleteUser(testData.users.testEmployee.username);
            
            // Dodaj nowego użytkownika
            cy.get('button').contains('Add').click();
            
            cy.selectOption('User Role', testData.users.roles[0]);
            cy.selectOption('Status', testData.users.statuses[0]);
            
            // Wybierz pracownika z autocomplete
            cy.typeInField('Employee Name', testData.users.testEmployee.associatedEmployeeName);
            cy.wait(2000);
            cy.get('div[role="listbox"]').find('.oxd-autocomplete-option').each(($element) => {
                if ($element.text().includes(testData.users.testEmployee.associatedEmployeeName)) {
                    cy.wrap($element).click();
                }
            });
            
            cy.typeInField('Username', testData.users.testEmployee.username);
            cy.typeInField('Password', testData.users.testEmployee.password);
            cy.typeInField('Confirm Password', testData.users.testEmployee.password);
            
            cy.get('button[type="submit"]').click();
            
            // Weryfikacja utworzenia użytkownika
            cy.intercept('/web/index.php/api/v2/admin/users?limit=50&offset=0&sortField=u.userName&sortOrder=ASC').as('users');
            cy.wait('@users');
            
            cy.scrollTo(0, 0);
            cy.typeInField('Username', testData.users.testEmployee.username);
            cy.get('button[type="submit"]').click({force: true});
            
            // Sprawdź czy użytkownik został dodany
            cy.get('div.oxd-table-card > div[role="row"]').should('contain', testData.users.testEmployee.username);
        });

        it('powinien wyświetlić błąd przy próbie dodania użytkownika z istniejącą nazwą', () => {
            cy.get('button').contains('Add').click();
            
            cy.selectOption('User Role', testData.users.roles[0]);
            cy.selectOption('Status', testData.users.statuses[0]);
            
            // Wybierz pracownika z autocomplete
            cy.typeInField('Employee Name', testData.users.testEmployee.associatedEmployeeName);
            cy.wait(2000);
            cy.get('div[role="listbox"]').find('.oxd-autocomplete-option').each(($element) => {
                if ($element.text().includes(testData.users.testEmployee.associatedEmployeeName)) {
                    cy.wrap($element).click();
                }
            });
            
            cy.typeInField('Username', testData.users.testEmployee.username);
            cy.typeInField('Password', testData.users.testEmployee.password);
            cy.typeInField('Confirm Password', testData.users.testEmployee.password);
            
            cy.get('button[type="submit"]').click();
            
            // Weryfikacja błędu
            cy.get('span.oxd-input-field-error-message')
                .should('have.text', 'Already exists');
        });
    });

    describe('Zarządzanie stanowiskami', () => {
        it('powinien dodać nowe stanowisko', () => {
            // Przejdź do zarządzania stanowiskami
            cy.get('li[class*="topbar"]').contains('Job').click();
            cy.get('ul.oxd-dropdown-menu > li').contains('Job Titles').click();
            
            // Usuń stanowisko jeśli istnieje
            cy.deleteJob(testData.jobs.testJobTitle);
            
            // Dodaj nowe stanowisko
            cy.get('button').contains('Add').click({force: true});
            cy.typeInField('Job Title', testData.jobs.testJobTitle);
            cy.get('button[type="submit"]').click();
            
            // Weryfikacja dodania stanowiska
            cy.intercept('/web/index.php/api/v2/admin/job-titles?limit=50&offset=0&sortField=jt.jobTitleName&sortOrder=ASC').as('jobs');
            cy.wait('@jobs');
            
            cy.get('div.oxd-table-card > div > div:nth-child(2)')
                .should('contain', testData.jobs.testJobTitle);
        });

        it('powinien usunąć stanowisko', () => {
            // Przejdź do zarządzania stanowiskami
            cy.get('li[class*="topbar"]').contains('Job').click();
            cy.get('ul.oxd-dropdown-menu > li').contains('Job Titles').click();
            
            // Usuń stanowisko
            cy.deleteJob(testData.jobs.testJobTitle);
            
            // Weryfikacja usunięcia
            cy.get('div.oxd-table-card > div > div:nth-child(2) > div').then(($element) => {
                expect($element).not.to.include.text(testData.jobs.testJobTitle);
            });
        });
    });
});
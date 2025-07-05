// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//

// Komendy niestandardowe dla testów Cypress
// Umożliwiają wielokrotne używanie często wykonywanych akcji

/**
 * Komenda do logowania użytkownika
 * @param {string} username - nazwa użytkownika
 * @param {string} password - hasło
 */
Cypress.Commands.add('login', (username, password) => {
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[class*="login"]').click();
});

/**
 * Komenda do usuwania użytkownika (jeśli istnieje)
 * @param {string} username - nazwa użytkownika do usunięcia
 */
Cypress.Commands.add('deleteUser', (username) => {
    cy.get('label').contains('Username').parent().parent().find('div').eq(1).clear().type(username);
    cy.get('button[type="submit"]').click({force: true});
    cy.wait(1000);

    cy.get('body').then(($body) => {
        if ($body.find('div.oxd-table-card > div[role="row"]').length > 0) {
            cy.get('div.oxd-table-card > div[role="row"]').each(($element) => {
                if ($element.find('div').eq(3).text().includes(username)) {
                    cy.wrap($element).find('div i.bi-trash').parent().click();
                    cy.get('div.orangehrm-modal-footer > button > i.bi-trash').click();
                }
            });
        }
    });
});

/**
 * Komenda do usuwania stanowiska (jeśli istnieje)
 * @param {string} jobTitle - nazwa stanowiska do usunięcia
 */
Cypress.Commands.add('deleteJob', (jobTitle) => {
    cy.get('body').then(($body) => {
        if ($body.find('div.oxd-table-card > div').length > 0) {
            cy.get('div.oxd-table-card > div').each(($element) => {
                if ($element.find('div:nth-child(2)').text().includes(jobTitle)) {
                    cy.wrap($element).find('div:nth-child(4) button:first-child').click({force: true});
                    cy.get('div.orangehrm-modal-footer > button > i.bi-trash').click();
                }
            });
        }
    });
});

/**
 * Komenda do dodawania pracownika
 * @param {string} firstName - imię
 * @param {string} lastName - nazwisko
 * @param {string} employeeId - ID pracownika
 */
Cypress.Commands.add('addEmployee', (firstName, lastName, employeeId) => {
    cy.get('button').contains('Add').click({force: true});
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    
    // Wyczyść domyślne ID i wpisz nowe
    cy.get('label').contains('Employee Id').parent().parent().find('div').eq(1).clear();
    cy.typeInField('Employee Id', employeeId);
    
    cy.get('button').contains('Save').click();
});

/**
 * Komenda do wyszukiwania użytkownika/pracownika
 * @param {string} fieldLabel - etykieta pola wyszukiwania
 * @param {string} searchValue - wartość do wyszukania
 */
Cypress.Commands.add('search', (fieldLabel, searchValue) => {
    cy.get('label').contains(fieldLabel).parent().parent().find('div:last-child input').clear().type(searchValue);
    cy.get('button[type="submit"]').click({force: true});
    cy.wait(1000);
});

/**
 * Komenda do usuwania pracownika (jeśli istnieje)
 * @param {string} employeeName - nazwa pracownika do usunięcia
 */
Cypress.Commands.add('deleteEmployee', (employeeName) => {
    cy.get('body').then(($body) => {
        if ($body.find('div.oxd-table-card > div[role="row"]').length > 0) {
            cy.get('div.oxd-table-card > div[role="row"]').each(($element) => {
                if ($element.find('div').eq(5).text().includes(employeeName)) {
                    cy.wrap($element).find('div i.bi-trash').parent().click();
                    cy.get('div.orangehrm-modal-footer > button > i.bi-trash').click();
                }
            });
        }
    });
});

/**
 * Komenda do dodawania ogłoszenia o pracę
 * @param {string} vacancyName - nazwa ogłoszenia
 * @param {string} jobTitle - tytuł stanowiska
 * @param {string} hiringManager - menedżer rekrutacji
 */
Cypress.Commands.add('addVacancy', (vacancyName, jobTitle, hiringManager) => {
    cy.typeInField('Vacancy Name', vacancyName);
    cy.selectOption('Job Title', jobTitle);
    cy.typeInField('Hiring Manager', hiringManager);
    
    cy.wait(2000);
    
    // Wybierz z listy autocomplete
    cy.get('div[role="listbox"]').find('.oxd-autocomplete-option').each(($element) => {
        if ($element.text().includes(hiringManager)) {
            cy.wrap($element).click();
        }
    });
    
    cy.get('button[type="submit"]').click();
    
    cy.intercept('/web/index.php/api/v2/recruitment/vacancies?limit=0').as('editVacancy');
    cy.wait('@editVacancy');
});

/**
 * Komenda do usuwania ogłoszenia o pracę
 * @param {string} vacancyName - nazwa ogłoszenia do usunięcia
 */
Cypress.Commands.add('deleteVacancy', (vacancyName) => {
    cy.get('body').then(($body) => {
        if ($body.find('div.oxd-table-card > div > div:nth-child(2)').text().includes(vacancyName)) {
            cy.get('div.oxd-table-card > div > div:nth-child(2)').contains(vacancyName)
                .parent().parent().find('div:nth-child(6) button:first-child').click();
            cy.get('div.orangehrm-modal-footer > button > i.bi-trash').click();
        }
    });
});

/**
 * Komenda do wybierania opcji z listy rozwijanej
 * @param {string} fieldLabel - etykieta pola
 * @param {string} optionValue - wartość opcji do wybrania
 */
Cypress.Commands.add('selectOption', (fieldLabel, optionValue) => {
    cy.get('label').contains(fieldLabel).parent().parent().find('div').eq(1).click();
    
    cy.get('div[role="listbox"] > div[role="option"]').each(($element) => {
        if ($element.text().includes(optionValue)) {
            cy.wrap($element).click();
        }
    });
});

/**
 * Komenda do wpisywania tekstu w pole identyfikowane przez etykietę
 * @param {string} fieldLabel - etykieta pola
 * @param {string} value - wartość do wpisania
 */
Cypress.Commands.add('typeInField', (fieldLabel, value) => {
    cy.get('label').contains(fieldLabel).parent().parent().find('div').eq(1).type(value);
});

//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
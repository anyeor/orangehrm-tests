/// <reference types="Cypress" />

describe('Testy modułu rekrutacji', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
            cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
            cy.get('h6.oxd-text').should('have.text', 'Dashboard');
            cy.get('a[href*="recruitment"]').click();
        });
    });

    it('powinien dodać nowe ogłoszenie o pracę', () => {
        // Przejdź do listy ogłoszeń
        cy.get('li[class*="topbar"]').contains('Vacancies').click();
        
        cy.intercept('/web/index.php/api/v2/recruitment/hiring-managers?limit=0').as('hiringManagers');
        cy.wait('@hiringManagers');
        
        // Usuń ogłoszenie jeśli istnieje
        cy.deleteVacancy(testData.recruitment.testVacancy.name);
        
        // Dodaj nowe ogłoszenie
        cy.get('button').contains('Add').click({force: true});
        cy.addVacancy(testData.recruitment.testVacancy.name, testData.recruitment.testVacancy.jobTitle, testData.recruitment.testVacancy.hiringManager);
        
        // Wróć do listy ogłoszeń
        cy.get('li[class*="topbar"]').contains('Vacancies').click();
        
        // Weryfikacja dodania ogłoszenia
        cy.get('div.oxd-table-card > div > div:nth-child(2)')
            .should('contain', testData.recruitment.testVacancy.name);
    });

    it('powinien usunąć ogłoszenie o pracę', () => {
        // Przejdź do listy ogłoszeń
        cy.get('li[class*="topbar"]').contains('Vacancies').click();
        
        cy.intercept('/web/index.php/api/v2/recruitment/hiring-managers?limit=0').as('hiringManagers');
        cy.wait('@hiringManagers');
        
        // Upewnij się, że ogłoszenie istnieje
        cy.get('body').then(($body) => {
            if (!$body.find('div.oxd-table-card > div > div:nth-child(2)').text().includes(testData.recruitment.testVacancy.name)) {
                // Jeśli ogłoszenie nie istnieje, najpierw je dodaj
                cy.get('button').contains('Add').click({force: true});
                cy.addVacancy(testData.recruitment.testVacancy.name, testData.recruitment.testVacancy.jobTitle, testData.recruitment.testVacancy.hiringManager);
                cy.get('li[class*="topbar"]').contains('Vacancies').click();
                cy.wait('@hiringManagers');
            }
        });
        
        // Usuń ogłoszenie
        cy.deleteVacancy(testData.recruitment.testVacancy.name);
        
        // Weryfikacja usunięcia
        cy.get('div.oxd-table-card > div > div:nth-child(2)').then(($element) => {
            expect($element).not.to.include.text(testData.recruitment.testVacancy.name);
        });
    });

    it('powinien wyświetlić listę ogłoszeń', () => {
        // Przejdź do listy ogłoszeń
        cy.get('li[class*="topbar"]').contains('Vacancy').click();
        
        cy.intercept('/web/index.php/api/v2/recruitment/hiring-managers?limit=0').as('hiringManagers');
        cy.wait('@hiringManagers');
        
        // Weryfikacja wyświetlenia listy
        cy.get('div.oxd-table-card').should('exist');
        cy.get('h6').should('contain', 'Vacancies');
    });

    it('powinien wyświetlić formularz dodawania ogłoszenia', () => {
        // Przejdź do listy ogłoszeń
        cy.get('li[class*="topbar"]').contains('Vacancies').click();
        
        cy.intercept('/web/index.php/api/v2/recruitment/hiring-managers?limit=0').as('hiringManagers');
        cy.wait('@hiringManagers');
        
        // Kliknij przycisk dodawania
        cy.get('button').contains('Add').click({force: true});
        
        // Weryfikacja wyświetlenia formularza
        cy.get('h6').should('contain', 'Add Vacancy');
        cy.get('label').should('contain', 'Vacancy Name');
        cy.get('label').should('contain', 'Job Title');
        cy.get('label').should('contain', 'Hiring Manager');
    });
});
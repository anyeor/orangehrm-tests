/// <reference types="Cypress" />

describe('Testy funkcji Buzz', () => {
    let testData;

    beforeEach(() => {
        cy.fixture('data').then((data) => {
            testData = data;
            cy.visit(Cypress.env('url'));
            cy.login(testData.authentication.validCredentials.username, testData.authentication.validCredentials.password);
            cy.get('h6.oxd-text').should('have.text', 'Dashboard');
            cy.get('a[href*="Buzz"]').click();
        });
    });

    it('powinien utworzyć nowy post', () => {
        cy.get('textarea').type(testData.social.samplePost);
        cy.get('button[type="submit"]').click();

        // Weryfikacja czy post został dodany
        cy.get('div.oxd-grid-item p.orangehrm-buzz-post-body-text')
            .first()
            .should('have.text', testData.social.samplePost);
    });

    it('powinien polubić post', () => {
        let initialLikes = 0;
        const likesSelector = 'div.oxd-grid-item i[class*="like"] + p';
        const heartSelector = 'div.oxd-grid-item svg';

        // Sprawdź czy post nie jest już polubiony
        cy.get(heartSelector).first().then(($heart) => {
            if ($heart.parent().hasClass('orangehrm-like-animation')) {
                cy.wrap($heart).click({force: true});
                cy.wait(1000);
            }
        });

        // Zapisz liczbę polubień przed akcją
        cy.get(likesSelector).first().then(($element) => {
            initialLikes = parseInt($element.text().split(' ')[0]);
        });

        // Polub post
        cy.get(heartSelector).first().click({force: true});
        cy.wait(1000);

        // Sprawdź czy liczba polubień się zwiększyła
        cy.get(likesSelector).first().then(($element) => {
            expect($element).to.include.text(initialLikes + 1);
        });
    });

    it('powinien anulować polubienie posta', () => {
        let initialLikes = 0;
        const likesSelector = 'div.oxd-grid-item i[class*="like"] + p';
        const heartSelector = 'div.oxd-grid-item svg';

        // Upewnij się, że post jest polubiony
        cy.get(heartSelector).first().then(($heart) => {
            if (!$heart.parent().hasClass('orangehrm-like-animation')) {
                cy.wrap($heart).click({force: true});
                cy.wait(1000);
            }
        });

        // Zapisz liczbę polubień przed akcją
        cy.get(likesSelector).first().then(($element) => {
            initialLikes = parseInt($element.text().split(' ')[0]);
        });

        // Anuluj polubienie
        cy.get(heartSelector).first().click({force: true});
        cy.wait(1000);

        // Sprawdź czy liczba polubień się zmniejszyła
        cy.get(likesSelector).first().then(($element) => {
            expect($element).to.include.text(initialLikes - 1);
        });
    });
});
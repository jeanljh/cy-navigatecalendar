/// <reference types="cypress" />

describe('Dual Calendar Navigation', () => {
    beforeEach('Visit URL', () => {
        cy.visit(Cypress.env('urlDualCal'));
        cy.url().should('eq', Cypress.env('urlDualCal'))
        cy.title().should('contains', "Boutique Hotel KL | MoMo's Kuala Lumpur - Homepage | New Hotel in KL")
        cy.get('body').then(e => {
            if (e.find('span.close-cpp').length > 0)
                cy.get('span.close-cpp').click()
        })
        cy.get("[class*='desktopNav__bookNow']").click()
    })
    it('Test Default Calendar State', () => {
        const today = new Date()
        const arriveMonth = today.toLocaleDateString('default', {month:'long', year: 'numeric'})
        // validate arrive month/year header
        cy.getMonthHeader(0).should('eq', arriveMonth)

        // validate pre-selected today and tomorrow
        cy.getDays(0).eq(0).invoke('text').should('eq', new Date().getDate().toString())
        cy.getDays(0).eq(1).invoke('text').should('eq', (new Date().getDate() + 1) + '')
        
        today.setMonth(today.getMonth() + 1, 1)
        const departMonth = today.toLocaleDateString('default', {month:'long', year:'numeric'})
        // validate depart month/year header
        cy.getMonthHeader(1).should('eq', departMonth)
        
        // validate visibility of previous and next month buttons
        cy.get('.DayPicker-NavButton--prev').should('not.be.visible')
        cy.get('.DayPicker-NavButton--next').should('be.visible')
    })
    it('Test Calendar Navigation', () => {
        // get test data from from dualCal.json
        cy.fixture('dualCal').then(d => {
            const today = new Date()
            const arriveDt = new Date(d.arriveDate)
            const departDt = new Date(d.departDate)
            
            // validate depart date is after arrive date
            expect(departDt).to.gt(arriveDt)
            
            // validate arrive date is from today onwards
            expect(arriveDt).to.gte(today)

            // select arrive date and depart date
            cy.selectDate(arriveDt)
            cy.selectDate(departDt)
        })
    })
})
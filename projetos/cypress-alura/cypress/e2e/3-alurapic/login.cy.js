describe('Login de usuários alurapic', () => {

  beforeEach(() => {
    cy.visit('/');
    // cy.intercept('POST', 'https://apialurapic.herokuapp.com/user/login', {
    //   statusCode: 400
    // }).as('stubPost');
  })

  it('fazer login de usuario valido', () => {
    cy.login(Cypress.env('userName'), Cypress.env('password'));
    //cy.wait('@stubPost');
    cy.contains('a', '(Logout)').should('be.visible');
  })

  it('fazer login de usuario invalido', () => {
    // cy.get('input[formControlName="userName"]').type('nayla');
    // cy.get('input[formControlName="password"]').type('1234');
    // cy.get('button[type="submit"]').click();
    cy.login('nayla', '1234')
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Invalid user name or password')
    })
  })
})
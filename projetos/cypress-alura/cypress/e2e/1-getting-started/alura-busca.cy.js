describe('alura busca cursos', () => {
  // ARRANGE
  // ACT
  // ASSERT

  beforeEach(() => {
    cy.visit('https://www.alura.com.br');
  })

  it('busca cursos', () => {
    cy.get('#header-barraBusca-form-campoBusca').type('angular{enter}');
    // cy.get('.header-barraBusca-form-submit').click(); // clica no botão
    // cy.get(':nth-child(1) > .busca-resultado-link > .busca-resultado-container > .busca-resultado-nome')
    //   .should('have.text', 'Formação Angular');
    cy.get('h4.busca-resultado-nome').should('contain', 'Formação Angular');
  })
})
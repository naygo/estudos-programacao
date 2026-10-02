Cypress.Commands.add('login', (nome, senha) => {
  cy.get('input[formControlName="userName"]').type(nome);
  cy.get('input[formControlName="password"]').type(senha, {log: false});
  cy.get('button[type="submit"]').click();
})
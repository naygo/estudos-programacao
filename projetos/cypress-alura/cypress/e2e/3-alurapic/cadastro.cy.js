describe('Cadastros de usuários alurapic', () => {

  beforeEach(() => {
    // cy.visit('https://alura-fotos.herokuapp.com')
    cy.visit('/')
  })

  it('verifica mensagens validação', () => {
    cy.contains('a', 'Register now').click();

    cy.contains('button', 'Register').click();
    cy.contains('ap-vmessage', 'Email is required!').should('be.visible');

    cy.contains('button', 'Register').click();
    cy.contains('ap-vmessage', 'Full name is required!').should('be.visible');
    cy.contains('ap-vmessage', 'User name is required!').should('be.visible');
    cy.contains('ap-vmessage', 'Email is required!').should('be.visible');
    cy.contains('ap-vmessage', 'User name is required!').should('be.visible');
  });

  it('verifica mensagens de EMAIL invalido', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="email"]').type('nayla').blur();
    cy.contains('ap-vmessage', 'Invalid e-mail').should('be.visible');
  })

  it('verifica mensagem de tamanho minimo no FULL NAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="fullName"]').type('a').blur();
    cy.contains('ap-vmessage', 'Mininum length is 2').should('be.visible');
  })

  it('verifica mensagem de tamanho máximo no FULL NAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="fullName"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').blur();
    cy.contains('ap-vmessage', 'Maximun length is 40').should('be.visible');
  })

  it('verifica mensagem de letra maiúscula no USERNAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="userName"]').type('AA').blur();
    cy.contains('ap-vmessage', 'Must be lower case').should('be.visible');
  })

  it('verifica mensagem de tamanho minimo no USERNAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="userName"]').type('a').blur();
    cy.contains('ap-vmessage', 'Mininum length is 2').should('be.visible');
  })

  it('verifica mensagem de letra maiúscula e tamanho minímo no USERNAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="userName"]').type('A').blur();
    cy.contains('ap-vmessage', 'Must be lower case').should('be.visible');
    cy.contains('ap-vmessage', 'Mininum length is 2').should('be.visible');
  })

  it('verifica mensagem de tamanho máximo no USERNAME', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="userName"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').blur();
    cy.contains('ap-vmessage', 'Maximun length is 30').should('be.visible');
  })

  it('verifica mensagem de tamanho minimo na PASSWORD', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="password"]').type('a').blur();
    cy.contains('ap-vmessage', 'Mininum length is 8').should('be.visible');
  })

  it('verifica mensagem de tamanho máximo na PASSWORD', () => {
    cy.contains('a', 'Register now').click();
    
    cy.get('input[formControlName="password"]').type('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa').blur();
    cy.contains('ap-vmessage', 'Maximun length is 18').should('be.visible');
  })

  const usuarios = require('../../fixtures/usuarios.json');
  usuarios.forEach(usuario => {
    it(`registra novo usuario ${usuario.userName}`, () => {
      cy.contains('a', 'Register now').click();
      cy.contains('button', 'Register').click();
      cy.get('input[formControlName="email"]').type(usuario.email);
      cy.get('input[formControlName="fullName"]').type(usuario.fullName);
      cy.get('input[formControlName="userName"]').type(usuario.userName);
      cy.get('input[formControlName="password"]').type(usuario.password);
      cy.contains('button', 'Register').click();
    })
  })
})
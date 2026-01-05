describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
     //verificação de resultado esperado, poderia ser not.be.equal 
  })
    
  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = Cypress._.repeat('abcdefghijklm', '50')
    cy.get('#firstName')
      .as('CampoDeNome')
      .should('be.visible')
      .type('Larissa')
    cy.get('@CampoDeNome')
      .should('have.value', 'Larissa')

    cy.get('#lastName')
      .as('CampoDeSobrenome')
      .should('be.visible')
      .type('Silva')
    cy.get('@CampoDeSobrenome')
      .should('have.value', 'Silva')

    cy.get('#email')
      .as('email')
      .should('be.visible')
      .type('larissa.testi@gmail.com')
    cy.get('@email')
      .should('have.value', 'larissa.testi@gmail.com')

    cy.get('#phone')
      .as('telefone')
      .should('be.visible')
      .type('11987654321')
    cy.get('@telefone')
      .should('have.value', '11987654321')

    cy.get('#product').select('Blog')

    cy.get('#open-text-area').type(longText, {delay: 0})

    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')

  })

  it('Exibe mensagem de erro ao submeter o formulário com um email inválido', () =>  {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('larissa@gmail,com')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
  })

it('campo telefone continua vazio quando preenchido com um valor não-numérico', () => {
  cy.get('#phone')
    .type('abcde')
    .should('have.value', '') //verificando que está vazio
})

it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('larissa@gmail,com')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
})

it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').type('Larissa').should('have.value','Larissa').clear().should('have.value', '')
    cy.get('#lastName').type('Silva').should('have.value','Silva').clear().should('have.value', '')
    cy.get('#email').type('larissa@gmail,com').should('have.value','larissa@gmail,com').clear().should('have.value', '')
    cy.get('#phone').type('11987654321').should('have.value','11987654321').clear().should('have.value', '')
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
})

it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', () => {
    cy.contains('button', 'Enviar').click()

    cy.get('.error').should('be.visible')
})

it('envia o formuário com sucesso usando um comando customizado', () => {
  const data = {
    firstName: 'Larissa',
    lastName: 'Silva',
    email: 'larissa@gmail.com',
    text: 'Teste.'
  }
    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success').should('be.visible')
})

it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('larissa@gmail.com')
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
})

it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('larissa@gmail.com')
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
})

it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#firstName').type('Larissa')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('larissa@gmail.com')
    cy.get('#product').select(1).should('have.value', 'blog')
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()

    cy.get('.success').should('be.visible')
})

it('marca o tipo de atendimento "Feedback"', () => {
  cy.get(':nth-child(4) > input').check().should('be.checked', 'Feedback')
  // cy.get('input[type="radio"][value="feedback"])
})

it('marca cada tipo de atendimento', () => {
  cy.get('#support-type > :nth-child(2) > input').check().should('be.checked', 'Ajuda')
  cy.get(':nth-child(3) > input').check().should('be.checked', 'Elogio')
  cy.get(':nth-child(4) > input').check().should('be.checked', 'Feedback') 
})

it('marca cada tipo de atendimento com each', () => {
  cy.get('input[type="radio"]')
    .each((typeOfService => //each recebe como argumento uma função, e essa função ela recebe como argumento cada um desses argumentos do array
      cy.wrap(typeOfService)
      .check()
      .should('be.checked')
    ))
})

it('marca ambos checkboxes, depois desmarca o último', () => {
  cy.get('#email-checkbox').check().should('be.checked')
  cy.get('#phone-checkbox').check().should('be.checked')
  cy.get('#phone-checkbox').uncheck().should('not.be.checked')
})

it('marca ambos checkboxes, mas desmarca o último', () => {
  cy.get('input[type="checkbox"]')
    .check()
    .should('be.checked')
    .last()
    .uncheck()
    .should('not.be.checked')
})

it('exibe mensagem de erro quando o telefone se torna obrigatório no entanto não é preenchido antes do envio do formulário', () => {
  cy.get('#firstName').type('Larissa')
  cy.get('#lastName').type('Silva')
  cy.get('#email').type('larissa@gmail.com')
  cy.get('#product').select(1).should('have.value', 'blog')
  cy.get('#phone-checkbox').check().should('be.checked')
  cy.get('#open-text-area').type('Teste')
  cy.contains('button', 'Enviar').click()

  cy.get('.error').should('be.visible')
})

it('seleciona um arquivo da pasta fixtures', () => {
  cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json')
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')

  })
})

it('seleciona um arquivo simulando um drag-and-drop', () => {
  cy.get('#file-upload')
    .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')

  })
})

it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
  cy.fixture('example.json').as('sampleFile')
  cy.get('#file-upload')
    .selectFile('@sampleFile')
    .should(input =>{
      expect(input[0].files[0].name).to.equal('example.json')
})
})

it('Verifica que abre em outra aba', () => {
  cy.contains('a', 'Política de Privacidade')
    .should('have.attr', 'href', 'privacy.html')
    .and('have.attr', 'target', '_blank')
})

it('acessa a página da política de privacidade removendo o target', () => {
  cy.contains('a', 'Política de Privacidade')
    .invoke('removeAttr', 'target')
    .click()

  cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
})
})
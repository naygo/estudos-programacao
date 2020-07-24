# HTML5 e CSS3 parte 1: A primeira página da Web

## 1. Marcação do primeiro texto
+ Uma introdução ao HTML e às suas tags
+ Como definir o título e os parágrafos de um texto
+ Utilizando as tags  &#x276e;h1&#x276f; e &#x276e;p&#x276f;, respectivamente
+ Como dar destaque para algumas informações do texto, deixando-as em negrito, utilizando a tag &#x276e;strong&#x276f;
+ Como dar ênfase para algumas informações do texto, deixando-as em itálico, utilizando a tag &#x276e;em&#x276f;

## 2. Separando o conteúdo e informações

+ A definir a estrutura básica do HTML
Com a tag DOCTYPE, definimos qual versão do HTML estamos utilizando
    - A tag &#x276e;html&#x276f;, que marca o conteúdo a ser renderizado no navegador
        - Dentro desta tag, podemos definir a linguagem da página, através da propriedade lang
+ Como passar as informações do encoding da nossa página para o navegador, através da tag &#x276e;meta&#x276f; e da propriedade charset
+ Como definir o título de uma página, através da tag &#x276e;title&#x276f;
+ Como separar as informações que estão sendo passadas para o navegador, utilizando a tag &#x276e;head&#x276f;
+ Como separar o conteúdo da página, utilizando a tag &#x276e;body&#x276f;

## 3. Trabalhando com CSS
+ A mexer na apresentação dos textos
    - No alinhamento deles (text-align)
    - No tamanho da fonte (font-size)
    - Na cor de fundo (background)
    - Na cor do texto (color)
+ CSS inline
    - Na linha onde temos a nossa tag, adicionamos a propriedade do CSS
+ A tag #x276e;style&#x276f;
    - Dentro da tag, podemos colocar marcações de CSS referentes aos elementos que temos no nosso HTML
+ A apresentação do CSS com um arquivo externo
+ Como funciona o estilo em cascata do CSS
+ Como importar um arquivo externo de CSS dentro da nossa página HTML
+ Como representar cores no CSS
    - Através do nome da cor
    - Através do seu hexadecimal
    - Através do seu RGB

### Como representar cores no CSS
#### Hexadecimais

**Red | Green | Blue**
 #RRGGBB

0 = ausência #0000000
F = máximo #FFFFFF

Ex.: #FF0000

#### RGB

**Red | Green | Blue**
0 - 255
0 = ausência
255 = máximo

rgb(red, green, blue)

Ex.: rgb(0, 255, 0)

## 4. Utilizando imagens

+ Como reestruturar o nosso código, removendo os CSS inline e colocando-os no arquivo CSS externo
Como criar um identificador para marcar especificamente um elemento
+ Como fazer referência a esse identificador no CSS
+ Como adicionar uma imagem à nossa página
+ Como ajustar a altura do elemento, através da propriedade height
+ Como ajustar a largura do elemento, através da propriedade width
+ Como ajustar o espaçamento interno do elemento, através da propriedade padding
+ Como ajustar o espaçamento externo do elemento, através da propriedade margin
+ Como se comporta um time de front-end hoje em dia

### Time Front-End

+ **UX - User Experience** _(Usabilidade)_**:** responde como as informações vão ser entregues
+ **UI - User Interface** _(Design)_**:** da o visual
+ **Desenvolvedor Front-end:** transforma tudo em código para a web

>UX + UI + Desenvolvedor 

## 5. Listas e divisões de conteúdo

+ A trabalhar com listas não-ordenadas e listas ordenadas
    - Para cada um dos itens da lista, utilizamos a tag <li>
+ O conceito das classes no CSS
    - Elas servem para marcar itens, só que são repetíveis
+ Como referenciar uma classe no CSS
+ Divisões de conteúdo, utilizando a tag <div>
+ Os comportamentos inline e block

## Finalizando a página
+ O conceito de cabeçalho da página e como criá-lo
+ Que o cabeçalho da página deve ter mais destaque
+ Que não é recomendado criar estilos usando tags
    - O ideal é usarmos classes para tudo

# HTML5 e CSS3 parte 2: Posicionamento, listas e navegação
## 1. Criando uma nova página

+ Uma introdução ao projeto do treinamento
+ Uma revisão do conteúdo aprendido no treinamento anterior
+ Uma revisão da base de uma página HTML
+ Lista HTML não ordenada

## 2. Navegação entre páginas
+ A criar links para outras páginas, sejam elas do nosso projeto ou páginas externas
+ Um reforço aos estilos inline e block
+ Como transformar o texto para ter todas as letras maiúsculas
+ Como deixar o texto em negrito com CSS
+ Como remover a decoração do texto

## 3. Posicionamento dos elementos
+ Como remover os estilos que o navegador cria automaticamente
+ Como funciona os posicionamentos static, relative e absolute dos elementos
+ Como posicionar o cabeçalho da nossa página

## 4. A tag section
+ A tag main, para o conteúdo principal da nossa página
+ A criar listas complexas, com títulos, imagens e parágrafos
+ A utilizar o inline-block
+ A praticar e estilizar o conteúdo principal da nossa página

## 5. Lidando com bordas

+ Através do CSS, aplicar bordas nos elementos.
+ Os diferentes tipos de bordas.
+ A deixar a borda arredondada.

## 6. Pseudo-classe CSS

+ Algumas **pseudo-classes** CSS
    - **hover**, quando o usuário passa o cursor sobre o elemento
    - **active**, quando um elemento está sendo ativado pelo usuário
+ A mudar a cor do texto e/ou da borda de um elemento, quando o usuário passar o cursor sobre o mesmo
+ A mudar a cor da borda de um elemento, quando o mesmo estiver sendo ativado pelo usuário

## 7. Finalizando a página de produtos
+ A tag footer, para o rodapé da nossa página
+ Que, com CSS, podemos colocar uma imagem de fundo em um elemento
    - Quando colocamos uma imagem de fundo em um elemento, o CSS, por padrão, copia e cola a imagem diversas vezes até ocupar todo o espaço do elemento
+ A tabela Unicode


# HTML5 e CSS3 parte 3: Trabalhando com formulários e tabelas
## Criando uma nova página
+ Uma revisão do conteúdo aprendido no treinamento anterior
+ Uma introdução ao projeto do treinamento
+ A criação da página de contato
+ Um pouco sobre os formulários

## Começando um formulário
+ A criar um formulário HTML
    - A tag que o representa é a <form>
+ A tag <input>, para a entrada de dados do usuário
+ A criar uma etiqueta para o input, com a tag <label>
+ A conectar um input com o seu label
    - Colocamos um id para o input e associamos esse id ao atributo for do label
+ Alguns tipos de input, como text e submit
+ Que label e input por padrão possuem o display inline
+ A estilizar o nosso formulário

## Tipos de campos diferentes
+ O textarea, para entradas de texto de mais de uma linha
+ O input do tipo radio
+ Como agrupar vários input do tipo radio, impedindo que mais de um input seja selecionado
+ O input do tipo checkbox
+ Que podemos criar um input dentro de um label, assim associando-os
+ Mais estilizações para a nossa página
+ Como funciona a hierarquia no CSS
+ O select, que é seletor, um campo de seleção de um item, e o option, que representa cada opção do seletor

## Melhorando a semântica
+ Alguns tipos de inputs para celular: email, tel, number, password, date, datetime, month e search
+ Como não permitir que um campo não seja preenchido, através do atributo <kbd>required</kbd>
+ Como exibir uma sugestão de preenchimento para os campos, através do atributo <kbd>placeholder</kbd>
+ Como deixar uma opção marcada por padrão nos nossos input <kbd>radio</kbd> e <kbd>checkbox</kbd>, através do atributo <kbd>checked</kbd>
+ Como estruturar melhor o nosso código com <kbd>fieldset</kbd> e <kbd>legend</kbd>
+ Como adicionar uma alternativa à imagem, descrevendo-a, com o atributo <kbd>alt</kbd>

## CSS avançado
+ Como estilizar o botão de envio de formulário
+ A realizar transições nos nossos elementos, com a propriedade CSS <kbd>transition</kbd>
+ A modificar o estilo do ponteiro do mouse, quando passar por cima de determinado elemento, através da propriedade CSS <kbd>cursor</kbd>
+ A realizar transformações nos nossos elementos, como aumentar proporcionalmente a escala de determinado elemento ou rotacioná-lo, através da propriedade CSS <kbd>transform</kbd>

## Estrutura de tabelas
+ A criar uma tabela HTML
    - A tag <kbd>table</kbd>, que representa a tabela
    - A tag <kbd>tr</kbd>, que representa a linha da tabela
    - A tag <kbd>td</kbd>, que representa a célula da tabela
    - A tag <kbd>thead</kbd>, que representa o cabeçalho da tabela
    - A tag <kbd>tbody</kbd>, que representa o corpo da tabela
    - A tag <kbd>th</kbd>, que representa a célula do cabeçalho da tabela
    - A tag <kbd>tfoot</kbd>, que representa o rodapé da tabela
+ A estilizar a tabela

# HTML5 e CSS3 parte 4: Avançando no CSS
## Adaptando a página inicial

+ A ajustar a página principal para utilizar os mesmos padrões da página de produtos
+ Medidas proporcionais com CSS
+ Como funciona a flutuação dos elementos e como modificá-la, com a propriedade <kbd>float</kbd> do CSS
+ Como limpar o float, com a propriedade <kbd>clear</kbd> do CSS

## Conteúdo externo
+ A utilizar fontes externas nas nossas páginas
+ Como incorporar um mapa à nossa página
+ Como incorporar um vídeo à nossa página

## Melhorando o CSS
+ A melhorar mais ainda a semântica da página principal, com novas divisões, classes, etc
+ Novas pseudo-classes
+ Como aplicar um background gradiente na página
+ Pseudo-elementos

## Selecionando qualquer coisa
+ Seletores avançados CSS
    - Seletor <kbd>></kbd>, para acessar os filhos de determinado elemento. Por exemplo, para acessar todos os p dentro de main:
    ```css
    main > p {
    }
    ```
    - Seletor <kbd>+</kbd>, para acessar o primeiro irmão de determinado elemento. Por exemplo, para acessar o primeiro p após um img:
    ```css
    img + p {
    }
    ```
    - Seletor <kbd>~</kbd>, para acessar todos os irmãos de determinado elemento. Por exemplo, para acessar todos os p após um img:
    ```css
    img ~ p {
    }
    ```
    - Seletor <kbd>not</kbd>, para acessar os elementos, exceto algum. Por exemplo, para acessar todos os p dentro de main, exceto o p que tem id missao:
    ```css
    main p:not(#missao) {
    }
    ```
+ Como fazer contas com CSS, com a propriedade <kbd>calc</kbd>

## Opacidade e sombra
+ Como manipular a opacidade dos elementos, com a propriedade CSS <kbd>opacity</kbd>
+ Como manipular a opacidade das cores
+ Como adicionar um sombreamento em volta dos elementos, com a propriedade CSS <kbd>box-shadow</kbd>
+ Como adicionar um sombreamento em textos, com a propriedade CSS <kbd>text-shadow</kbd>

## Design responsivo
+ **Design responsivo:** como ajustar o estilo da nossa página de acordo com o tamanho da tela do dispositivo que a acesse
    - Meta tag de **Viewport**
    - Media Queries
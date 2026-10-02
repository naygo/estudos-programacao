# Coisas novas que aprendi

Eu já possuía conhecimento em HTML e CSS, então fiz esses cursos para relembrar e aprender qualquer coisa que não eu conhecesse.
Então vou deixar registrado essas coisas aqui :smile:

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


### Time Front-End

+ **UX - User Experience** _(Usabilidade)_**:** responde como as informações vão ser entregues
+ **UI - User Interface** _(Design)_**:** da o visual
+ **Desenvolvedor Front-end:** transforma tudo em código para a web

>UX + UI + Desenvolvedor 

## Pseudo-classe CSS

+ Algumas **pseudo-classes** CSS
    - **hover**, quando o usuário passa o cursor sobre o elemento
    - **active**, quando um elemento está sendo ativado pelo usuário

## Como funciona a hierarquia no CSS
1. Inline: 1000 pontos.
2. ID:100 pontos.
3. Classes, pseudo-classe e atributos: 10 pontos
4. Tag HTML:1 ponto.


## CSS avançado
+ Transições em elementos, com a propriedade CSS <kbd>transition</kbd>
+ Transformações em elementos, como aumentar proporcionalmente a escala de determinado elemento ou rotacioná-lo, através da propriedade CSS <kbd>transform</kbd>
+ Como aplicar um background gradiente na página

## Flutuação
+ Flutuação dos elementos e como modificá-la, com a propriedade <kbd>float</kbd> do CSS
+ Como limpar o float, com a propriedade <kbd>clear</kbd> do CSS


## Pseudo-coisas
+ Novas pseudo-classes
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
    
## Calc
+ Como fazer contas com CSS, com a propriedade <kbd>calc</kbd>

## Opacidade e sombra
+ Manipular a opacidade dos elementos, com a propriedade CSS <kbd>opacity</kbd>
+ Manipular a opacidade das cores
+ Adicionar um sombreamento em volta dos elementos, com a propriedade CSS <kbd>box-shadow</kbd>
+ Adicionar um sombreamento em textos, com a propriedade CSS <kbd>text-shadow</kbd>

## Design responsivo
+ **Design responsivo:** como ajustar o estilo da nossa página de acordo com o tamanho da tela do dispositivo que a acesse
    - Meta tag de **Viewport**
    - Media Queries

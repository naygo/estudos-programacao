# Angular

## Começando
+ Instalação do Angular CLI
    - <kbd>npm install -g @angular/cli</kbd>
+ Criação de um novo projeto com a ferramenta e como executá-lo
    - <kbd>ng new nome-projeto</kbd>
    - <kbd>ng serve --open</kbd>
+ Data binding: um mecanismo para coordenar o que os usuários veem; sincronização entre model e view.
    - {{}} para _tags_
    - [] para atributos
+ Convenções
    - Para arquivos: _menubar.component.ts_
    - Para nomes: _MenubarComponent_

## Criando o primeiro componente

+ Adicionar bootstrap.css
    - download pelo _npm_
    - adicionar diretório ao arquivo _angular.json_, em styles
+ Criação de um novo componente
    - criar pasta para o componente
    - criar os components _html_ e _ts_
    - exportar a classe e a transformar em componente:
    ```js
     @Component({
         selector: '';
         templateUrl: '';
     })
     export class Classe { }
     ```
+ A importância de declarar o componente em um módulo
    - um componente deve fazer parte de um módulo, obrigatoriamente
+ Como passar dados para o componente através das **inbound properties**
    - propriedade do tipo componente.ts que aceitam receber um valor por meio de sua forma declarativa
    - usar <kbd>@Input()</kbd>
+ Criação de um módulo e boas práticas
    - criar módulos para importar todos os componentes, e o módulo principal importar estes módulos
    - <kbd>@NgModule</kbd> para tornar a classe um módulo
+ A diretiva <kbd>*ngFor</kbd>
    - muda o comportamento de um componente já existente
    - renderiza um modelo para cada item em uma coleção
    - diretiva é colocada em um elemento, que se torna o pai dos modelos clonados.

## Integração com Web API's

+ Front-end e back-end rodam em servidores separados

+ Consumir uma Web API através do serviço <kbd>HttpClient</kbd>
    - **Injeção de depêndencia**: feita com constructor e _provider_ (adicionar import no module principal)
        - requisições ajax para o backend

+ Isolando aceeso à API em uma classe especializada
    - classe **service**
+ Tipando a API
    - criando uma **interface** para saber como lidar com os dados
+ Ciclo de vida de um componente
    - <kbd>ngOnInit</kbd>

## Single Page Applications e Rotas

+ Gerando componente pelo CLI
    - <kbd>ng generate component pasta/pasta-componente</kbd>

+ BrowserModule e CommonModule
    - O CommonModule possui todas as diretivas básicas como NgIf, NgFor, NgForOf, etc.
    - O BrowserModule possui funcionalidades essenciais para rodar e iniciar a aplicação.
    - O BrowserModule só deve ser importado no modulo principal da aplicação.

+ Roteamento de uma single page application
    - o index carrega os componentes de acordo com as rotas
    - intercepta a mudança de endereço antes dela chegar ao backend, e carrega se existir
  
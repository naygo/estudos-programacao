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
        - o framework Angular interpreta essa URL e verifica se há um roteamento associado

+ Como lidar com páginas 404
    - gerar módulo _errors_ e componente _not-found_

+ Parametrizando rotas e como obter valores do segmento parametrizado
    - com <kbd>ActivatedRoute</kbd> é possível extrair os parâmetros  e parametrizar as rotas no <kbd>app.routing.module.ts</kbd>

## Novos conceitos

+ Novo componente para listar photos
    - componente _photos_ para listar as fotos separando corretamente

+ Adequação dos dados recebidos pelo componente
    - função _groupColumns_ para partir o array de photos 

+ Quando a fase OnInit não é suficiente
    - essa fase executa só uma vez, e nesse caso era necessário a executar mais vezes

+ A interface OnChanges, e como interagir com SimpleChanges
    - OnChanges: "um gancho de ciclo de vida chamado quando qualquer propriedade ligada a dados de uma diretiva é alterada."
    - SimpleChanges: "um hashtable de alterações representados pelos objetos do SimpleChange armazenados no nome da propriedade declarada a que pertencem em uma Directive ou Component"
    
## Melhorando a experiência do usuário

+ Event bind
    - nome do evento entre parenteses
    - contrário do data bind, são unidirecionais, só que cada um tem uma direção específica
        - [] - dado vem do componente (fonte de dados) para o template
        - () - o evento é do disparado, vai da view para o compoenente

+ Pipe e implementação
    - | -> pipe
    - pipes ("tubos", em português) podem gerar transformações nos dados, podemos criar os nossos
    - para que seja um Pipe, sua classe deve ser anotada com o decorator <kbd>@Pipe</kbd>, além de implementar o método transform(), que possui determinada assinatura (parâmetros)
        - implementando a _interface PipeTransform_

+ Resolver 
    - resolve os dados durante a navegação de uma rota para disponibiliza-lós para um componente

+ Padrão debounce com RxJS
    - usando debounce para criar um delay na busca e não haver tantas requisições
    - usar o método <kbd>OnDestroy</kbd> para evitar gastos desnecessários da memória, um problema famoso e conhecido por _memory leak_!

> É boa prática implementar um padrão de projeto, chamado **debounce**, toda vez que for executar uma operação que será disparada repetidas vezes de acordo com eventos gerados pelo usuário

+ Paginação
    - resolve o problema de carregamento excessivo de dados
    - componente _load-button_ para carregar imagens
    - backend deve estar para isso
    - é possível fazer if/else em templates com o angular

## Lapidando ainda mais nossa aplicação

+ Submódulos
    - criando módulos dentro de todos os componentes para melhor organização

+ Integração com Font Awesome
    - integrando fonte awesome para utilizar ícones

+ Component container e ng-content
    - componente _card_ que aceita conteúdo entre as tags

+ Componentizando o filtro
    - por excesso de html, foi criado um componente para a barra de pesquisa, porém o filtro parou de funcionar

+ Output property
    - usada para fazer o filtro funcionar e limpá-lo
    - são propriedades decoradas com o decorator Output
    - é necessário que a propriedade seja uma instância de _EventEmitter_
    - o nome da output property é o mesmo nome do evento utilizado por aqueles que desejam interagir com o componente

+ Criando a primeira diretiva
    - criando uma diretiva para aplicar css em mais de um componente

+ Terminando a implementação da diretiva
    - usando ElementRef e Render para manipular o DOM
    - diretiva pode receber parâmetros
    

  
# AngularJS ↔ Angular Interop

Prova de conceito para explorar a convivência entre AngularJS e Angular 16 e o compartilhamento de componentes durante uma migração gradual.

- `web/`: aplicação Angular com `@angular/upgrade`. Registra `TestComponent` como diretiva AngularJS usando `downgradeComponent` e contém a inicialização do módulo AngularJS via `UpgradeModule`.
- `api/`: servidor Express que disponibiliza os arquivos legados e a página AngularJS em `/template`.

O experimento contém código de downgrade de componente Angular e inicialização híbrida. Ainda não há um exemplo de componente AngularJS adaptado para uso no Angular com `UpgradeComponent`.

## Desenvolvimento

Instale as dependências e inicie cada aplicação em um terminal separado:

```bash
# Terminal 1 — Express: http://localhost:3000/template
cd api
npm install
npm start
```

```bash
# Terminal 2 — Angular: http://localhost:4200
cd web
npm install
npm start
```

## Estado

PoC experimental. A integração ainda precisa de ajustes e validação: existem referências fixas a bundles de build e um wrapper legado que chama um método `render()` ausente em `TestComponent`. Os comandos acima iniciam os servidores; o compartilhamento de componentes ainda não foi validado em execução.
